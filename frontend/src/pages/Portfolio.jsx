import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

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
  Pencil,
  Save,
  X,
  PlusCircle,
} from "lucide-react";

// GitHub & LinkedIn SVG components (unchanged)
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

const Portfolio = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Bio inline editing state
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");

  const isOwner = currentUser?._id === id;

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
      const response = await API.get(`/portfolio/${id}`);
      setData(response.data);
      if (response.data.user) {
        setTempBio(response.data.user.bio || "");
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveBio = async () => {
    try {
      await authAPI.updateProfile({ bio: tempBio });
      setData((prev) => ({
        ...prev,
        user: { ...prev.user, bio: tempBio },
      }));
      setEditingBio(false);
      toast.success("Bio updated");
    } catch (err) {
      toast.error("Failed to update bio");
    }
  };

  const cancelEditBio = () => {
    setTempBio(data?.user?.bio || "");
    setEditingBio(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

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

  if (!data || !data.user) {
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

  const user = data.user;
  const projects = data.projects || [];
  const userSkills = user.skills || [];
  const userRole = user.role || "Software Developer Intern";
  const stats = {
    totalProjects: projects.length,
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

              {/* Social links */}
              <div className="flex gap-4 mt-5">
                {user.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
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
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              {/* Copy & Share */}
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
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
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
                  <Eye size={14} className="text-blue-400" /> {stats.totalViews}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Views</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-0.5">
                  <Award size={14} className="text-amber-400" /> {stats.rating}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Rating</div>
              </div>
            </div>
          </div>

          {/* Skills section (read-only, no inline edit) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <Code2 size={14} className="text-purple-400" /> Key Frameworks &
              Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.length > 0 ? (
                userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-500/20"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No skills listed.</span>
              )}
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="lg:col-span-2 space-y-6">
          {/* Professional Background with inline editing (only for owner) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Flame size={18} className="text-orange-400" /> Professional
                Background
              </h2>
              {isOwner && !editingBio && (
                <button
                  onClick={() => setEditingBio(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>

            {editingBio ? (
              <div>
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  rows="4"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={saveBio}
                    className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded-lg text-sm"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={cancelEditBio}
                    className="flex items-center gap-1 bg-gray-600 px-3 py-1 rounded-lg text-sm"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm leading-relaxed">
                {user.bio ||
                  (isOwner
                    ? "Click ✏️ to add your professional background."
                    : "No bio provided.")}
              </p>
            )}
          </div>

          {/* Projects Section with "Add Project" button (owner only) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span>Selected Projects</span>
                <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
                  {projects.length}
                </span>
              </h2>
              {isOwner && (
                <Link
                  to="/projects/new"
                  className="flex items-center gap-1 text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition"
                >
                  <PlusCircle size={16} /> Add Project
                </Link>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-dashed border-white/10 rounded-2xl p-12 text-center">
                <Code2 className="mx-auto text-gray-600 mb-3" size={40} />
                <p className="text-gray-400 text-sm">No projects yet.</p>
                {isOwner && (
                  <Link
                    to="/projects/new"
                    className="mt-3 inline-block text-purple-400 text-sm hover:underline"
                  >
                    Create your first project →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 hover:border-purple-500/40 group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {p.title}
                        </h3>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium bg-white/5 px-2 py-0.5 rounded-full">
                          <Eye size={10} />{" "}
                          {p.viewCount || Math.floor(Math.random() * 80) + 10}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {p.description || "No project summary provided."}
                      </p>
                    </div>

                    <div>
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
