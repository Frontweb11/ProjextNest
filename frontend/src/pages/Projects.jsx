import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  EyeIcon,
  TagIcon,
  PlusCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getMyProjects(); // only current user's projects
      setProjects(res.data.projects || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Sharing Handler
  const handleShareProject = async (project) => {
    const projectUrl = `${window.location.origin}/projects/${project._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || `Check out my project: ${project.title}`,
          url: projectUrl,
        });
      } catch (err) {
        console.error("Error sharing project:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(projectUrl);
        toast.success("Project link copied to clipboard! 📋");
      } catch (err) {
        console.error("Failed to copy link:", err);
        toast.error("Could not copy link");
      }
    }
  };

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Projects</h1>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-300 mt-20">
          No projects found. Create your first project 🚀
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white/10 border border-white/10 rounded-xl p-5 hover:scale-[1.02] transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-white font-semibold text-lg">
                {project.title}
              </h2>
              <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(project.tags || []).slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full text-indigo-200"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {project.viewCount || 0}
                </div>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Split layout for actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/projects/${project._id}`}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium text-sm"
                >
                  View Project
                </Link>
                <button
                  onClick={() => handleShareProject(project)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white p-2 rounded-lg transition flex items-center justify-center active:scale-95"
                  title="Share Project"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Projects;
