import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { authAPI, projectAPI } from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  FileText,
  Code, // ✅ instead of Github
  Briefcase, // ✅ instead of Linkedin
  Globe,
  Camera,
  Copy,
  Share2,
  Eye,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  QrCode,
  PlusCircle,
  Clock,
  Link2,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    socialLinks: {
      linkedin: "",
      github: "",
      website: "",
    },
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autosaveTimer, setAutosaveTimer] = useState(null);
  const [stats, setStats] = useState({ projects: 0, views: 0 });
  const [completeness, setCompleteness] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const fileInputRef = useRef(null);
  const portfolioLink = `${window.location.origin}/portfolio/${user?._id}`;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          website: user.socialLinks?.website || "",
        },
      });
      setPreviewUrl(user.profilePicture || "");
      setProfilePicture(user.profilePicture || null);
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const res = await projectAPI.getMyProjects();
      const projects = res.data.projects || [];
      const totalViews = projects.reduce(
        (sum, p) => sum + (p.viewCount || 0),
        0,
      );
      setStats({ projects: projects.length, views: totalViews });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    let completed = 0;
    const total = 5;
    if (formData.name && formData.name.trim() !== "") completed++;
    if (formData.bio && formData.bio.trim().length > 20) completed++;
    if (profilePicture) completed++;
    if (
      formData.socialLinks.github ||
      formData.socialLinks.linkedin ||
      formData.socialLinks.website
    )
      completed++;
    if (formData.email) completed++;
    setCompleteness(Math.round((completed / total) * 100));
  }, [formData.name, formData.bio, profilePicture, formData.socialLinks]);

  // Autosave (same as before)
  useEffect(() => {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    const timer = setTimeout(() => {
      if (
        user &&
        (formData.name !== user.name ||
          formData.bio !== user.bio ||
          JSON.stringify(formData.socialLinks) !==
            JSON.stringify(user.socialLinks))
      ) {
        handleAutosave();
      }
    }, 2000);
    setAutosaveTimer(timer);
    return () => clearTimeout(timer);
  }, [formData.name, formData.bio, formData.socialLinks]);

  const handleAutosave = async () => {
    try {
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        socialLinks: formData.socialLinks,
        profilePicture,
      };
      await authAPI.updateProfile(updateData);
      const refreshed = await authAPI.getProfile();
      updateUser(refreshed.data);
      setLastSaved(new Date());
      toast.success("Auto-saved", { icon: "💾", duration: 2000 });
    } catch (err) {
      console.error("Autosave failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        socialLinks: formData.socialLinks,
        profilePicture,
      };
      await authAPI.updateProfile(updateData);
      const refreshed = await authAPI.getProfile();
      updateUser(refreshed.data);
      setLastSaved(new Date());
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max size 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append("profilePicture", file);
    try {
      const res = await authAPI.uploadProfilePicture(formDataImg);
      setProfilePicture(res.data.profilePicture);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Upload failed");
      setPreviewUrl(user?.profilePicture || "");
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(portfolioLink);
    toast.success("Portfolio link copied!");
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s Portfolio`,
          text: `Check out ${user?.name}'s projects on InternFlow`,
          url: portfolioLink,
        });
      } catch (err) {
        if (err.name !== "AbortError") toast.error("Sharing failed");
      }
    } else {
      copyLink();
      toast("Link copied – share manually", { icon: "📋" });
    }
  };

  const generateQr = () => setShowQr(true);

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-white">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center transition-all hover:shadow-xl">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center ring-4 ring-white/20">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onFileSelect}
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mt-4">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-indigo-300 text-sm mt-1">
                  {user.role === "admin" ? "Administrator" : "Intern Developer"}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {formData.bio || "No bio added yet. Tell us about yourself."}
                </p>

                {/* Social icons row */}
                <div className="flex justify-center gap-3 mt-4">
                  {formData.socialLinks.github && (
                    <a
                      href={formData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition"
                    >
                      <Code className="w-5 h-5" />
                    </a>
                  )}
                  {formData.socialLinks.linkedin && (
                    <a
                      href={formData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition"
                    >
                      <Briefcase className="w-5 h-5" />
                    </a>
                  )}
                  {formData.socialLinks.website && (
                    <a
                      href={formData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-xs">Projects</p>
                    <p className="text-white text-xl font-semibold">
                      {stats.projects}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Views</p>
                    <p className="text-white text-xl font-semibold">
                      {stats.views}
                    </p>
                  </div>
                </div>

                {/* Completeness */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Profile completeness</span>
                    <span>{completeness}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/portfolio/${user._id}`}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition shadow-md"
                >
                  <Eye className="w-4 h-4" /> View Public Portfolio
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                <Link
                  to="/projects/new"
                  className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition"
                >
                  <PlusCircle className="w-5 h-5" /> Add new project
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {lastSaved && (
                <div className="text-right text-xs text-gray-400 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" /> Last saved:{" "}
                  {lastSaved.toLocaleTimeString()}
                </div>
              )}

              {/* Personal Info */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-indigo-400" /> Personal
                  Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={formData.email}
                        disabled
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Bio
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows="4"
                        maxLength="200"
                        className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Tell us about your skills..."
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {formData.bio?.length || 0}/200
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <Link2 className="w-5 h-5 text-indigo-400" /> Social Links
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="github"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: {
                            ...formData.socialLinks,
                            github: e.target.value,
                          },
                        })
                      }
                      placeholder="GitHub profile URL"
                      className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: {
                            ...formData.socialLinks,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      placeholder="LinkedIn profile URL"
                      className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="website"
                      value={formData.socialLinks.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: {
                            ...formData.socialLinks,
                            website: e.target.value,
                          },
                        })
                      }
                      placeholder="Personal website"
                      className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Portfolio Actions */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-3">
                  Portfolio Sharing
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/portfolio/${user._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-xl hover:bg-indigo-600/30 transition"
                  >
                    <Eye className="w-4 h-4" /> View Portfolio
                  </Link>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                  >
                    <Copy className="w-4 h-4" /> Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={shareProfile}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                  >
                    <Share2 className="w-4 h-4" /> Share Profile
                  </button>
                  <button
                    type="button"
                    onClick={generateQr}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                  >
                    <QrCode className="w-4 h-4" /> QR Code
                  </button>
                </div>
              </div>

              <div className="sticky bottom-4 lg:static flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-xl shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* QR Modal */}
        {showQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Your Portfolio QR</h3>
                <button
                  onClick={() => setShowQr(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  QR Code Placeholder
                </div>
              </div>
              <p className="text-gray-400 text-xs text-center mt-4">
                Scan to view {formData.name}'s portfolio
              </p>
              <button
                onClick={() => setShowQr(false)}
                className="mt-4 w-full py-2 bg-indigo-600 rounded-lg text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
