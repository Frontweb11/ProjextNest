import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import {
  Share2,
  Copy,
  Check,
  Eye,
  ExternalLink,
  Code2,
  User as UserIcon,
  Layers,
  Flame,
  Award,
} from "lucide-react";

// ================= COHESIVE LOCAL BRAND SVG COMPONENTS =================
const GitHub = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedIn = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ================= MAIN PORTFOLIO COMPONENT =================
const Portfolio = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
        const response = await API.get(`/portfolio/${id}`);
        setData(response.data); // ✅ response, not res
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  // Copy Link Action
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // Native Web Share API Action
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data?.user?.name || "Developer"} Portfolio`,
          text: `Check out ${data?.user?.name || "this developer"}'s projects and skills!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Loading Skeleton Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 animate-pulse">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 h-[500px] rounded-2xl"></div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 h-32 rounded-2xl"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 h-48 rounded-2xl"></div>
              <div className="bg-white/5 border border-white/10 h-48 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found / Error State Screen
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center backdrop-blur-md max-w-sm">
          <UserIcon className="mx-auto text-purple-400 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-400 text-sm mb-4">
            The developer profile you are looking for does not exist or has been
            moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const user = data;
  const projects = data.projects || [];

  // Fallback defaults for properties that may not be populated in the database
  const userRole = user.role || "Software Developer Intern";
  const userSkills = user.skills || [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "JavaScript (ES6+)",
  ];
  const stats = {
    totalProjects: projects?.length || 0,
    totalViews: user.profileViews || Math.floor(Math.random() * 400) + 120,
    rating: user.rating || "4.9",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans antialiased p-4 md:p-8 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
        {/* ================= STICKY PROFILE SIDEBAR ================= */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 space-y-6">
          {/* Main User Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10 group-hover:bg-purple-500/20 transition-all duration-500" />

            <div className="flex flex-col items-center text-center">
              {/* Profile Image with Gradient Frame */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-all" />
                <img
                  src={
                    user.profilePicture ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
                  }
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-white/20 relative z-10"
                />
              </div>

              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                {user.name}
              </h1>
              <p className="text-purple-400 font-medium text-sm tracking-wide mt-1 uppercase">
                {userRole}
              </p>
              <p className="text-gray-400 text-sm mt-3 line-clamp-3 px-2">
                {user.bio ||
                  "Building modern digital experiences with clean, production-ready code configurations."}
              </p>

              {/* Localized SVG Brand Handles */}
              <div className="flex gap-4 mt-5">
                {user.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
                    title="GitHub"
                  >
                    <GitHub size={18} />
                  </a>
                )}
                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300 hover:text-blue-400"
                    title="LinkedIn"
                  >
                    <LinkedIn size={18} />
                  </a>
                )}
                {user.socialLinks?.website && (
                  <a
                    href={user.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300 hover:text-purple-400"
                    title="Personal Website"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              {/* Share & Copy Portfolio Drawer Link Handlers */}
              <div className="grid grid-cols-2 gap-3 w-full mt-6 border-t border-white/5 pt-5">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/10 transition-all active:scale-95"
                >
                  {copied ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold py-2.5 px-3 rounded-xl shadow-lg shadow-purple-900/30 transition-all active:scale-95"
                >
                  <Share2 size={14} />
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Platform Performance Insight Stats */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Layers size={14} className="text-purple-400" /> Platform Insights
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="text-lg font-bold text-white">
                  {stats.totalProjects}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Projects</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                  <Eye size={14} className="text-blue-400 inline" />{" "}
                  {stats.totalViews}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Views</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-0.5">
                  <Award size={14} className="text-amber-400 inline" />{" "}
                  {stats.rating}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Rating</div>
              </div>
            </div>
          </div>

          {/* Technical Competencies Framework Grid */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <Code2 size={14} className="text-purple-400" /> Key Frameworks &
              Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-500/20 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT: ABOUT & PROJECT SHOWCASE ================= */}
        <main className="lg:col-span-2 space-y-6">
          {/* Expanded Overview Panel */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Flame size={18} className="text-orange-400" /> Professional
              Background
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              I am a dedicated builder specializing in modern engineering
              ecosystems. Passionate about tackling complex architectural
              challenges, component life cycles, and constructing fluid user
              interfaces that balance speed, accessibility, and intuitive
              presentation.
            </p>
          </div>

          {/* Project Dynamic Grid System */}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <span>Selected Projects</span>
              <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
                {projects?.length || 0}
              </span>
            </h2>

            {/* Empty State UI Controller */}
            {!projects || projects.length === 0 ? (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-dashed border-white/10 rounded-2xl p-12 text-center">
                <Code2 className="mx-auto text-gray-600 mb-3" size={40} />
                <p className="text-gray-400 text-sm">
                  No production builds uploaded yet.
                </p>
              </div>
            ) : (
              /* Premium Responsive Grid: 3 columns desktop, 2 tablet, 1 mobile */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {p.title}
                        </h3>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium bg-white/5 px-2 py-0.5 rounded-full">
                          <Eye size={10} />{" "}
                          {Math.floor(Math.random() * 80) + 10}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {p.description ||
                          "No project summary provided by the author."}
                      </p>
                    </div>

                    <div>
                      {/* Component Tag Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags && p.tags.length > 0 ? (
                          p.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-md border border-white/5 font-mono"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-md italic">
                            General Stack
                          </span>
                        )}
                      </div>

                      {/* Explicit Component Redirection Splitting Links */}
                      <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                        <Link
                          to={`/projects/${p._id}`}
                          className="flex items-center justify-center gap-1.5 text-xs text-center font-medium bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl border border-white/5 transition-all"
                        >
                          View App
                        </Link>
                        <a
                          href={
                            user.socialLinks?.github || "https://github.com"
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 text-xs text-center font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 py-2 rounded-xl border border-purple-500/20 transition-all"
                        >
                          <GitHub size={12} /> Repo
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
