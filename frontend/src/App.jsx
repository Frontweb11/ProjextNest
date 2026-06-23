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
import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail";
import CourseLearn from "./pages/courses/CourseLearn";
import CreateCourse from "./pages/courses/CreateCourse";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Resume Builder Pages (new)
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeTemplates from "./pages/ResumeTemplates";

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
        <Route path="/explore" element={<Explore />} />
        <Route path="/portfolio/:id" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/learn" element={<CourseLearn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* ================= RESUME BUILDER ROUTES ================= */}
        <Route
          path="/resume/builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/templates"
          element={
            <ProtectedRoute>
              <ResumeTemplates />
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
