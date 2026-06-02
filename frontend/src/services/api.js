import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth APIs
export const authAPI = {
  register: (userData) => API.post("/auth/register", userData),
  login: (credentials) => API.post("/auth/login", credentials),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (profileData) => API.put("/auth/profile", profileData),

  // ✅ ADDED THIS
  uploadProfilePicture: (formData) =>
    API.post("/auth/upload-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Project APIs
export const projectAPI = {
  // Public
  getAll: (params) => API.get("/projects", { params }),
  getById: (id) => API.get(`/projects/${id}`),

  // Authenticated (intern)
  getMyProjects: () => API.get("/projects/my/projects"),

  create: (formData) =>
    API.post("/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.put(`/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => API.delete(`/projects/${id}`),

  deleteImage: (projectId, imageId) =>
    API.delete(`/projects/${projectId}/images/${imageId}`),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => API.get("/admin/users"),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAllProjects: (params) => API.get("/admin/projects", { params }),
  updateProjectStatus: (id, status) =>
    API.put(`/admin/projects/${id}/status`, { status }),
  deleteProject: (id) => API.delete(`/admin/projects/${id}`),
};

// Analytics APIs (admin only)
export const analyticsAPI = {
  getStats: () => API.get("/analytics/stats"),
  getTopProjects: () => API.get("/analytics/top-projects"),
  getInternPerformance: () => API.get("/analytics/intern-performance"),
  getTagStats: () => API.get("/analytics/tags"),
};

// User APIs (public profile)
export const userAPI = {
  getUserById: (id) => API.get(`/users/${id}`),
  // Add other user‑related endpoints if needed
};

// Portfolio API (public)
export const portfolioAPI = {
  getPortfolio: (id) => API.get(`/portfolio/${id}`),
};
export default API;
