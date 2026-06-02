import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { projectAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  PlusIcon,
  FolderIcon,
  EyeIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const InternDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalViews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const response = await projectAPI.getMyProjects();
      const projectsData = response.data;
      setProjects(projectsData);

      const totalViews = projectsData.reduce(
        (sum, p) => sum + (p.viewCount || 0),
        0,
      );

      setStats({
        totalProjects: projectsData.length,
        totalViews,
        averageRating: 4.5,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        await projectAPI.delete(projectId);
        toast.success("Project deleted");
        fetchMyProjects(); // refresh list
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading your projects...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-indigo-200 mt-1">
            Showcase your projects and impress recruiters.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="bg-indigo-500/30 p-3 rounded-full">
                <FolderIcon className="w-6 h-6 text-indigo-200" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalViews}
                </p>
              </div>
              <div className="bg-green-500/30 p-3 rounded-full">
                <EyeIcon className="w-6 h-6 text-green-200" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-white">
                  {stats.averageRating}
                </p>
              </div>
              <div className="bg-yellow-500/30 p-3 rounded-full">
                <StarIcon className="w-6 h-6 text-yellow-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Projects</h2>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:shadow-lg transition"
            >
              <PlusIcon className="w-4 h-4" />
              New Project
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12 text-indigo-200">
              <DocumentTextIcon className="w-12 h-12 mx-auto text-indigo-300/50 mb-2" />
              <p>No projects yet. Click "New Project" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-indigo-200 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-white/10 text-indigo-100 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="text-right">
                        <p className="text-sm text-indigo-200">
                          {project.viewCount || 0} views
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-indigo-300 hover:text-white transition"
                          title="View"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/projects/edit/${project._id}`}
                          className="text-yellow-300 hover:text-white transition"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-300 hover:text-white transition"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip Card */}
        <div className="bg-indigo-500/20 backdrop-blur-md rounded-xl p-4 border border-indigo-400/30">
          <div className="flex gap-3 items-start">
            <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-200 mt-0.5" />
            <div>
              <h3 className="font-medium text-white">Boost your visibility</h3>
              <p className="text-sm text-indigo-200">
                Complete your profile and add detailed project descriptions to
                attract recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InternDashboard;
