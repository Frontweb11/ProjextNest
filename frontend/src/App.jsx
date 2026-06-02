import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import InternDashboard from "./pages/InternDashboard";
import Projects from "./pages/Projects";
import ProjectEditor from "./pages/ProjectEditor";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

// Layout + Protected
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Explore />} />
        {/* ================= PUBLIC PATHS (NO AUTH NEEDED) ================= */}
        {/* Landing Page: Anyone can search and explore developer profiles */}
        <Route path="/explore" element={<Explore />} />

        {/* Individual Portfolio View: Anyone can see bio and project snippets */}
        <Route path="/portfolio/:id" element={<Portfolio />} />

        {/* Auth portals */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PRIVATE PATHS (LOGIN REQUIRED) ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          }
        />

        {/* This deep-dive project detail page is fully locked down behind the gatekeeper */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN MANAGEMENT PATHS ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProjectsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
