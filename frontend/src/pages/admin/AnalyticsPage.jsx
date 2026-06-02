import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { adminAPI } from "../../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  Tag,
  TrendingUp,
  Users,
  FolderKanban,
  Eye,
} from "lucide-react";

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalViews: 0,
    approvalRate: 0,
  });
  const [userGrowth, setUserGrowth] = useState([]);
  const [monthlyProjects, setMonthlyProjects] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [topInterns, setTopInterns] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllProjects(),
      ]);
      const users = usersRes.data;
      const projects = projectsRes.data.projects || [];

      // Base stats
      const totalViews = projects.reduce(
        (sum, p) => sum + (p.viewCount || 0),
        0,
      );
      const approvedCount = projects.filter(
        (p) => p.status === "published",
      ).length;
      const approvalRate = projects.length
        ? ((approvedCount / projects.length) * 100).toFixed(1)
        : 0;
      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalViews,
        approvalRate,
      });

      // User growth (mock aggregation by month)
      const userByMonth = {};
      users.forEach((u) => {
        const month = new Date(u.createdAt).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        userByMonth[month] = (userByMonth[month] || 0) + 1;
      });
      setUserGrowth(
        Object.entries(userByMonth)
          .map(([month, count]) => ({ month, count }))
          .slice(-6),
      );

      // Monthly projects
      const projByMonth = {};
      projects.forEach((p) => {
        const month = new Date(p.createdAt).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        projByMonth[month] = (projByMonth[month] || 0) + 1;
      });
      setMonthlyProjects(
        Object.entries(projByMonth)
          .map(([month, count]) => ({ month, count }))
          .slice(-6),
      );

      // Status distribution for pie
      const statusCount = {
        published: projects.filter((p) => p.status === "published").length,
        pending: projects.filter((p) => p.status === "pending").length,
        rejected: projects.filter((p) => p.status === "rejected").length,
      };
      setStatusDistribution([
        { name: "Approved", value: statusCount.published, color: "#10b981" },
        { name: "Pending", value: statusCount.pending, color: "#f59e0b" },
        { name: "Rejected", value: statusCount.rejected, color: "#ef4444" },
      ]);

      // Top interns by project count + views
      const internStats = {};
      projects.forEach((p) => {
        const id = p.internId?._id;
        if (!id) return;
        if (!internStats[id])
          internStats[id] = {
            name: p.internId.name,
            projectCount: 0,
            totalViews: 0,
          };
        internStats[id].projectCount++;
        internStats[id].totalViews += p.viewCount || 0;
      });
      const sortedInterns = Object.values(internStats)
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 5);
      setTopInterns(sortedInterns);

      // Popular tags
      const tagMap = new Map();
      projects.forEach((p) => {
        p.tags?.forEach((tag) => tagMap.set(tag, (tagMap.get(tag) || 0) + 1));
      });
      const sortedTags = Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      setPopularTags(sortedTags);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">
            Platform insights and performance metrics
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/10">
            <Users className="w-8 h-8 text-indigo-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/10">
            <FolderKanban className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalProjects}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/10">
            <Eye className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalViews}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/10">
            <TrendingUp className="w-8 h-8 text-rose-400" />
            <div>
              <p className="text-gray-400 text-sm">Approval Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats.approvalRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-semibold mb-3">
              User Growth (Last 6 months)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1e2f", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#818cf8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-semibold mb-3">
              Projects per Month
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyProjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1e1e2f" }} />
                <Bar dataKey="count" fill="#c084fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-semibold mb-3">
              Project Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Top Performing
              Interns
            </h3>
            <div className="space-y-3">
              {topInterns.map((intern, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-white/10 pb-2"
                >
                  <div>
                    <p className="text-white">{intern.name}</p>
                    <p className="text-xs text-gray-400">
                      {intern.projectCount} projects
                    </p>
                  </div>
                  <p className="text-indigo-300">{intern.totalViews} views</p>
                </div>
              ))}
              {topInterns.length === 0 && (
                <p className="text-gray-400">No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5" /> Most Used Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm"
              >
                #{tag.name} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
