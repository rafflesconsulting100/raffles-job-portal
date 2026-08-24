import React, { useState } from "react";
import {
  Users,
  Search,
  Shield,
  Building2,
  UserCheck,
  Trash2,
  RefreshCw,
  Mail,
  X
} from "lucide-react";

export default function UsersTab({
  users,
  usersLoading,
  onUpdateRole,
  onDeleteUser,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (roleFilter === "Job Seeker") return matchesSearch && u.role === "Job Seeker";
    if (roleFilter === "Employer") return matchesSearch && u.role === "Employer";
    if (roleFilter === "Admin") return matchesSearch && u.role === "Admin";
    return matchesSearch;
  });

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await onUpdateRole(userId, newRole);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="text-blue-600" size={24} /> User Directory & Role Controls
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage registered accounts across job seekers, employers, and administrators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={16} className={usersLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              roleFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("Job Seeker")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              roleFilter === "Job Seeker"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Candidates ({users.filter((u) => u.role === "Job Seeker").length})
          </button>
          <button
            onClick={() => setRoleFilter("Employer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              roleFilter === "Employer"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Employers ({users.filter((u) => u.role === "Employer").length})
          </button>
          <button
            onClick={() => setRoleFilter("Admin")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              roleFilter === "Admin"
                ? "bg-purple-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Admins ({users.filter((u) => u.role === "Admin").length})
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {usersLoading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-blue-600" />
            <p className="font-semibold text-sm">Loading users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Account Created</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isBusy = updatingId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {u.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.username}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail size={12} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <select
                          disabled={isBusy}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                          <option value="Job Seeker">Job Seeker</option>
                          <option value="Employer">Employer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onDeleteUser(u._id, u.username)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <Users size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-800 text-base">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
