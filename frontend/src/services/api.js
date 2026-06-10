import axios from "axios";

// ─── Instance ─────────────────────────────────────────────────────────────────

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);
// ─── Response Interceptor ─────────────────────────────────────────────────────

API.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    if (status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("⛔ Access denied:", message);
    }

    if (status >= 500) {
      console.error("❌ Server error:", message);
    }

    // Re-attach a clean message so callers can do err.message without digging
    err.message = message;
    return Promise.reject(err);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (credentials) => API.post("/auth/login", credentials),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (data) => API.put("/auth/profile", data),
  uploadProfilePicture: (formData) =>
    API.post("/auth/upload-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

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
  deleteImage: (projectId, imgId) =>
    API.delete(`/projects/${projectId}/images/${imgId}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminAPI = {
  getAllUsers: () => API.get("/admin/users"),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAllProjects: (params) => API.get("/admin/projects", { params }),
  updateProjectStatus: (id, status) =>
    API.put(`/admin/projects/${id}/status`, { status }),
  deleteProject: (id) => API.delete(`/admin/projects/${id}`),
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsAPI = {
  getStats: () => API.get("/analytics/stats"),
  getTopProjects: () => API.get("/analytics/top-projects"),
  getInternPerformance: () => API.get("/analytics/intern-performance"),
  getTagStats: () => API.get("/analytics/tags"),
};

// ─── Users & Portfolio ────────────────────────────────────────────────────────

export const userAPI = {
  getUserById: (id) => API.get(`/users/${id}`),
};

export const portfolioAPI = {
  getPortfolio: (id) => API.get(`/portfolio/${id}`),
};

// ─── Resume ───────────────────────────────────────────────────────────────────

export const resumeAPI = {
  generatePDF: (resumeData) =>
    API.post("/resume/generate-pdf", resumeData, {
      responseType: "blob", // binary PDF response
      timeout: 60_000, // PDF generation needs a longer timeout
    }),
};

export default API;
