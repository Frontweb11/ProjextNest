import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import {
  CalendarIcon,
  EyeIcon,
  LinkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectAPI.getById(id);

        setProject(response.data);
      } catch (error) {
        toast.error("Failed to load project");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Project not found
      </div>
    );
  }

  const images = project.images || [];
  const mainImage =
    images[selectedImage]?.url || "https://placehold.co/800x400?text=No+Image";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/projects"
          className="text-indigo-300 hover:text-white mb-4 inline-block"
        >
          ← Back to Projects
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          {/* Image */}
          <div className="aspect-video bg-black/30 flex items-center justify-center">
            <img
              src={mainImage}
              alt={project.title}
              className="max-h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-indigo-500"
                      : "border-white/20"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-sm text-indigo-200">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                {project.viewCount || 0} views
              </div>

              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-1">
                By {project.internId?.name || "Unknown"}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/10 text-indigo-100 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-indigo-100 whitespace-pre-wrap">
              {project.description}
            </p>

            {/* Links */}
            <div className="flex gap-4 pt-4 flex-wrap">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-700"
                >
                  <LinkIcon className="w-4 h-4" />
                  Live Demo
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-900"
                >
                  <FaGithub />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
