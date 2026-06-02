import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  ChevronDown,
  UserCheck,
  UserX,
  Trash2,
  Crown,
  Eye,
  MoreVertical,
} from "lucide-react";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkBar, setShowBulkBar] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? "activated" : "deactivated"}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      await adminAPI.updateUser(userId, { role: "admin" });
      toast.success("User promoted to admin");
      fetchUsers();
    } catch {
      toast.error("Promotion failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Delete this user permanently?")) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success("User deleted");
        fetchUsers();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    const confirmMsg =
      action === "delete"
        ? `Delete ${selectedUsers.length} users?`
        : `Activate/Deactivate ${selectedUsers.length} users?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const promises = selectedUsers.map((userId) => {
        if (action === "delete") return adminAPI.deleteUser(userId);
        if (action === "activate")
          return adminAPI.updateUser(userId, { isActive: true });
        if (action === "deactivate")
          return adminAPI.updateUser(userId, { isActive: false });
        return Promise.resolve();
      });
      await Promise.all(promises);
      toast.success(`Bulk action completed`);
      setSelectedUsers([]);
      fetchUsers();
    } catch {
      toast.error("Bulk action failed");
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
    setShowBulkBar(selectedUsers.length > 0);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u._id));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "blocked" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="animate-pulse h-10 bg-white/10 rounded w-1/4"></div>
          <div className="animate-pulse h-12 bg-white/10 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage intern and admin accounts</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="intern">Intern</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-3 flex justify-between items-center">
            <span className="text-white text-sm">
              {selectedUsers.length} users selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-green-600/30 text-green-300 rounded-lg text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1 bg-yellow-600/30 text-yellow-300 rounded-lg text-sm"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600/30 text-red-300 rounded-lg text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table (Modern Card-based) */}
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-gray-500 text-xs uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === filteredUsers.length &&
                  filteredUsers.length > 0
                }
                onChange={toggleSelectAll}
                className="rounded border-white/20 bg-white/5"
              />
            </div>
            <div className="col-span-4">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white/5 rounded-xl border border-white/10 p-4 transition hover:bg-white/10"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleSelectUser(user._id)}
                    className="rounded border-white/20 bg-white/5"
                  />
                </div>
                <div className="col-span-11 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="col-span-11 md:col-span-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${user.role === "admin" ? "bg-purple-500/30 text-purple-300" : "bg-blue-500/30 text-blue-300"}`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="col-span-11 md:col-span-2">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    className={`text-xs px-3 py-1 rounded-full transition ${user.isActive ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" : "bg-red-500/20 text-red-300 hover:bg-red-500/30"}`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </button>
                </div>
                <div className="col-span-11 md:col-span-2 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-11 md:col-span-1 flex justify-end gap-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handlePromoteToAdmin(user._id)}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                      title="Promote to Admin"
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No users found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsersManagement;
