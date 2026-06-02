import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { projectAPI } from "../services/api";
import toast from "react-hot-toast";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

const ProjectEditor = () => {
  const { id } = useParams(); // if id exists, we're editing
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    demoUrl: "",
    githubUrl: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getById(id);
      const project = response.data;
      setFormData({
        title: project.title,
        description: project.description,
        tags: project.tags?.join(", ") || "",
        demoUrl: project.demoUrl || "",
        githubUrl: project.githubUrl || "",
        images: project.images || [],
      });
      setExistingImages(project.images || []);
    } catch (error) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + imageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeNewImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = async (imageId) => {
    if (window.confirm("Delete this image?")) {
      try {
        await projectAPI.deleteImage(id, imageId);
        setExistingImages(existingImages.filter((img) => img._id !== imageId));
        toast.success("Image deleted");
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("tags", formData.tags);
    if (formData.demoUrl) submitData.append("demoUrl", formData.demoUrl);
    if (formData.githubUrl) submitData.append("githubUrl", formData.githubUrl);
    imageFiles.forEach((file) => submitData.append("images", file));

    try {
      if (id) {
        await projectAPI.update(id, submitData);
        toast.success("Project updated successfully");
      } else {
        await projectAPI.create(submitData);
        toast.success("Project created successfully");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 text-white">
          Loading project...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">
            {id ? "Edit Project" : "Create New Project"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-indigo-200 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-300/50 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-indigo-200 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-300/50 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-indigo-200 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, Tailwind"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-300/50 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-indigo-200 mb-1">
                Demo URL (optional)
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-300/50 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-indigo-200 mb-1">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-300/50 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-indigo-200 mb-2">
                  Existing Images
                </label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => (
                    <div
                      key={img._id}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20"
                    >
                      <img
                        src={img.url}
                        alt="project"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img._id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-indigo-200 mb-2">
                Upload New Images (max 5 total)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 px-4 py-2 rounded-lg flex items-center gap-2">
                  <PhotoIcon className="w-5 h-5" />
                  Select Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <span className="text-indigo-200 text-sm">
                  {imageFiles.length} new files
                </span>
              </div>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {imagePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20"
                    >
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : id
                    ? "Update Project"
                    : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectEditor;
