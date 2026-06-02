import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  FolderIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const navItems = isAdmin
    ? [
        { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
        { name: "All Projects", href: "/admin/projects", icon: FolderIcon },
        { name: "Users", href: "/admin/users", icon: UsersIcon },
        { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
        { name: "Profile", href: "/profile", icon: UserIcon },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "My Projects", href: "/projects", icon: FolderIcon },
        { name: "Profile", href: "/profile", icon: UserIcon },
      ];

  const handleLogout = () => {
    logout();
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-white">ProjectNest</span>
          </div>
          <button
            className="lg:hidden text-white/70"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-indigo-200 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-300 hover:bg-red-500/20 rounded-lg px-3 py-2 w-full transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">
              {isAdmin ? "Admin Panel" : "Intern Workspace"}
            </h1>
            <div className="w-8" />
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
