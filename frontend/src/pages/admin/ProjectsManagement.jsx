import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Eye, CheckCircle, XCircle, RotateCcw, Search, X } from "lucide-react";

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // For modal

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await adminAPI.getAllProjects();
      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await adminAPI.updateProjectStatus(id, newStatus);
      toast.success(
        `Project ${newStatus === "published" ? "approved" : newStatus}`,
      );
      fetchProjects();
    } catch {
      toast.error("Status update failed");
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      if (activeTab === "pending") return p.status === "pending";
      if (activeTab === "approved") return p.status === "published";
      if (activeTab === "rejected") return p.status === "rejected";
      return false;
    })
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );

  const tabCounts = {
    pending: projects.filter((p) => p.status === "pending").length,
    approved: projects.filter((p) => p.status === "published").length,
    rejected: projects.filter((p) => p.status === "rejected").length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="animate-pulse h-8 bg-white/10 rounded w-1/3"></div>
          <div className="flex gap-2 animate-pulse">
            <div className="h-10 w-24 bg-white/10 rounded"></div>
            <div className="h-10 w-24 bg-white/10 rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Moderation</h1>
          <p className="text-gray-400">Review and manage intern projects</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 transition-all hover:bg-white/10"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-white font-semibold text-lg">
                  {project.title}
                </h3>
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
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
                {project.tags?.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs">Owner</p>
                  <p className="text-white text-sm">
                    {project.internId?.name || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Submitted</p>
                  <p className="text-white text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                {/* View Details Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {activeTab === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(project._id, "published")}
                      className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 flex items-center gap-1 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(project._id, "rejected")}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center gap-1 text-sm"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {(activeTab === "approved" || activeTab === "rejected") && (
                  <button
                    onClick={() => updateStatus(project._id, "pending")}
                    className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 flex items-center gap-1 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset to Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No projects in this tab
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Project Details</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Title</label>
                <p className="text-white text-lg font-semibold">
                  {selectedProject.title}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <p className="text-gray-300">{selectedProject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Owner</label>
                  <p className="text-white">
                    {selectedProject.internId?.name || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {selectedProject.internId?.email}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p
                    className={`capitalize ${selectedProject.status === "published" ? "text-green-400" : selectedProject.status === "pending" ? "text-yellow-400" : "text-red-400"}`}
                  >
                    {selectedProject.status}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProject.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Demo URL</label>
                {selectedProject.demoUrl ? (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline block break-all"
                  >
                    {selectedProject.demoUrl}
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm">GitHub URL</label>
                {selectedProject.githubUrl ? (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline block break-all"
                  >
                    {selectedProject.githubUrl}
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm">Images</label>
                {selectedProject.images?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedProject.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Project ${idx}`}
                        className="rounded-lg w-full h-24 object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No images</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-400">View Count</label>
                  <p className="text-white">{selectedProject.viewCount || 0}</p>
                </div>
                <div>
                  <label className="text-gray-400">Submitted</label>
                  <p className="text-white">
                    {new Date(selectedProject.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectsManagement;
