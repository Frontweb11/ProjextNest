import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Eye,
  Award,
  Search,
  ArrowRight,
  Code,
  Briefcase,
  Users,
} from "lucide-react";

const Explore = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        const API = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
        });

        const res = await API.get("/users/public-profiles"); // ✅ FIXED

        const data = res.data || [];

        setProfiles(data);
        setFilteredProfiles(data);

        const total = data.length;
        const avgRating = total
          ? (
              data.reduce((sum, p) => sum + (p.rating || 4.5), 0) / total
            ).toFixed(1)
          : 0;

        setStats({ total, avgRating });
      } catch (err) {
        console.error("Error loading developer directory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.role?.toLowerCase().includes(query) ||
          p.bio?.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((p) => p.role?.toLowerCase() === roleFilter);
    }
    setFilteredProfiles(filtered);
  }, [searchQuery, roleFilter, profiles]);

  const getRandomViews = () => Math.floor(Math.random() * 300) + 50;
  const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);

  // Check if user is logged in (optional – hide buttons if logged in)
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065] p-6 md:p-12">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-16 bg-white/5 rounded-xl mb-8"></div>
          <div className="h-32 bg-white/5 rounded-2xl mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065] text-gray-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <Link
            to="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400"
          >
            InternFlow
          </Link>
          <div className="flex gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition shadow-md"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10 mb-6">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-gray-300">
              Developer Directory
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
            Discover Top Engineering Talent
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Explore portfolios of passionate developers, see their projects, and
            connect with the next generation of tech innovators.
          </p>

          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white">{stats.total}</span>
              <span className="text-gray-400">developers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-white">
                {stats.avgRating}
              </span>
              <span className="text-gray-400">avg rating</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, role, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
            />
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                roleFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter("intern")}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                roleFilter === "intern"
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Code className="w-3.5 h-3.5 inline mr-1" /> Interns
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                roleFilter === "admin"
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 inline mr-1" /> Admins
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-400">
          Showing{" "}
          <span className="text-white font-medium">
            {filteredProfiles.length}
          </span>{" "}
          developers
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-16 text-center max-w-md mx-auto">
            <User
              className="mx-auto text-gray-500 mb-3"
              size={48}
              strokeWidth={1.5}
            />
            <p className="text-gray-400">No developers match your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
              }}
              className="mt-4 text-purple-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => {
              const views = profile.profileViews || getRandomViews();
              const rating = profile.rating || getRandomRating();
              return (
                <div
                  key={profile._id}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition duration-500 pointer-events-none" />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          profile.profilePicture ||
                          `https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=${encodeURIComponent(
                            profile.name || "Dev",
                          )}`
                        }
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition line-clamp-1">
                          {profile.name}
                        </h3>
                        <p className="text-purple-400 text-xs font-medium uppercase tracking-wide mt-0.5">
                          {profile.role || "Software Intern"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye size={12} className="text-blue-400" /> {views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award size={12} className="text-amber-400" />{" "}
                            {rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-4 line-clamp-3 leading-relaxed">
                      {profile.bio ||
                        "Passionate developer building impactful digital experiences."}
                    </p>

                    {profile.tags && profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {profile.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {profile.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{profile.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/portfolio/${profile._id}`}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-purple-600/80 text-white py-2 rounded-xl text-sm font-medium transition-all group-hover:shadow-md"
                    >
                      View Portfolio{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
