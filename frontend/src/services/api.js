import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ======================
// TOKEN INTERCEPTOR
// ======================
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

// ======================
// AUTH APIs
// ======================
export const authAPI = {
  register: (userData) => API.post("/auth/register", userData),
  login: (credentials) => API.post("/auth/login", credentials),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (profileData) => API.put("/auth/profile", profileData),

  uploadProfilePicture: (formData) =>
    API.post("/auth/upload-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ======================
// PROJECT APIs
// ======================
export const projectAPI = {
  getAll: (params) => API.get("/projects", { params }),
  getById: (id) => API.get(`/projects/${id}`),

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

// ======================
// ADMIN APIs
// ======================
export const adminAPI = {
  getAllUsers: () => API.get("/admin/users"),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),

  getAllProjects: (params) => API.get("/admin/projects", { params }),
  updateProjectStatus: (id, status) =>
    API.put(`/admin/projects/${id}/status`, { status }),

  deleteProject: (id) => API.delete(`/admin/projects/${id}`),
};

// ======================
// ANALYTICS
// ======================
export const analyticsAPI = {
  getStats: () => API.get("/analytics/stats"),
  getTopProjects: () => API.get("/analytics/top-projects"),
  getInternPerformance: () => API.get("/analytics/intern-performance"),
  getTagStats: () => API.get("/analytics/tags"),
};

// ======================
// USER + PORTFOLIO
// ======================
export const userAPI = {
  getUserById: (id) => API.get(`/users/${id}`),
};

export const portfolioAPI = {
  getPortfolio: (id) => API.get(`/portfolio/${id}`),
};

export default API;
