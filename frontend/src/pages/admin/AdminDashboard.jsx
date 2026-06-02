import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Users,
  FolderKanban,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FolderPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalViews: 0,
    pendingApprovals: 0,
  });
  const [trends, setTrends] = useState({
    userGrowth: 12,
    projectGrowth: 8,
    viewGrowth: 24,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [projectsPerDay, setProjectsPerDay] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllProjects(),
      ]);

      const users = usersRes.data;
      const projects = projectsRes.data.projects || [];

      // Compute stats
      const totalViews = projects.reduce(
        (sum, p) => sum + (p.viewCount || 0),
        0,
      );
      const pending = projects.filter((p) => p.status === "pending").length;

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalViews,
        pendingApprovals: pending,
      });

      // Recent data (sorted by createdAt)
      const sortedUsers = [...users].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      const sortedProjects = [...projects].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setRecentUsers(sortedUsers.slice(0, 5));
      setRecentProjects(sortedProjects.slice(0, 5));

      // Generate chart data (mock for demo, replace with real API later)
      const last7Days = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().slice(0, 10);
        })
        .reverse();
      setProjectsPerDay(
        last7Days.map((date) => ({
          date,
          count: Math.floor(Math.random() * 5) + 1,
        })),
      );
      setUserGrowthData(
        last7Days.map((date) => ({
          date,
          users: Math.floor(Math.random() * 10) + 20,
        })),
      );

      // Mock popular tags from projects
      const tagMap = new Map();
      projects.forEach((p) => {
        p.tags?.forEach((tag) => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      });
      const sortedTags = Array.from(tagMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      setPopularTags(sortedTags);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const KPICard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-[1.02] hover:shadow-xl hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                {Math.abs(trend)}%
              </span>
              <span className="text-gray-500"> vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="from-indigo-500 to-purple-600"
            trend={trends.userGrowth}
            trendValue="+12%"
          />
          <KPICard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderKanban}
            color="from-emerald-500 to-teal-600"
            trend={trends.projectGrowth}
            trendValue="+8%"
          />
          <KPICard
            title="Total Views"
            value={stats.totalViews}
            icon={Eye}
            color="from-amber-500 to-orange-600"
            trend={trends.viewGrowth}
            trendValue="+24%"
          />
          <KPICard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            color="from-rose-500 to-pink-600"
            trend={null}
          />
        </div>

        {/* Charts Preview Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Projects per day */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
            <h3 className="text-white font-semibold mb-4">
              Projects Submitted (Last 7 days)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2f",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User growth */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
            <h3 className="text-white font-semibold mb-4">
              User Growth (Weekly)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1e2f", border: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#c084fc"
                  fill="#c084fc"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most used tags preview */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30"
              >
                {tag.name} ({tag.value})
              </span>
            ))}
            {popularTags.length === 0 && (
              <p className="text-gray-400 text-sm">No tags yet</p>
            )}
          </div>
        </div>

        {/* Bottom: Recent Users & Recent Projects */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Recent Users</h3>
              <Link
                to="/admin/users"
                className="text-indigo-400 text-sm hover:text-indigo-300"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${user.role === "admin" ? "bg-purple-500/30 text-purple-300" : "bg-green-500/30 text-green-300"}`}
                    >
                      {user.role}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Recent Projects</h3>
              <Link
                to="/admin/projects"
                className="text-indigo-400 text-sm hover:text-indigo-300"
              >
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {project.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      by {project.internId?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye className="w-3 h-3" /> {project.viewCount || 0}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "published"
                          ? "bg-green-500/30 text-green-300"
                          : project.status === "pending"
                            ? "bg-yellow-500/30 text-yellow-300"
                            : "bg-red-500/30 text-red-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
