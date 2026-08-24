import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchAdminStats,
  fetchAdminEmployers,
  toggleEmployerAccess,
  fetchAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
  fetchAdminUsers,
  updateUserRole,
  deleteUserByAdmin,
  seedAdminAccount,
} from "../../Service/Operation/adminApi";
import { showSuccess, showError } from "../../Utils/toast";

import OverviewTab from "./OverviewTab";
import EmployersTab from "./EmployersTab";
import JobsTab from "./JobsTab";
import UsersTab from "./UsersTab";
import EmployerDetailModal from "./EmployerDetailModal";

import {
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Lock,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(currentTabParam);

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Admin Data State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
    grantedEmployers: 0,
    suspendedEmployers: 0,
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [employersLoading, setEmployersLoading] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [selectedEmployerModal, setSelectedEmployerModal] = useState(null);

  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  const loadUserData = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        if (parsedUser.role === "Admin") {
          loadAllAdminData(storedToken);
        }
      } catch (e) {
        console.error("Error parsing user context", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadAllAdminData = async (authToken) => {
    const tok = authToken || token;
    if (!tok) return;

    loadStats(tok);
    loadEmployers(tok);
    loadJobs(tok);
    loadUsers(tok);
  };

  const loadStats = async (tok) => {
    try {
      const res = await fetchAdminStats(tok || token);
      if (res.success) {
        setStats(res.stats);
        setRecentUsers(res.recentRegistrations || []);
      }
    } catch (err) {
      console.error("Error loading stats:", err.message);
    }
  };

  const loadEmployers = async (tok) => {
    setEmployersLoading(true);
    try {
      const res = await fetchAdminEmployers(tok || token);
      if (res.success) {
        setEmployers(res.employers);
      }
    } catch (err) {
      showError(err.message || "Failed to load employers list");
    } finally {
      setEmployersLoading(false);
    }
  };

  const loadJobs = async (tok) => {
    setJobsLoading(true);
    try {
      const res = await fetchAdminJobs(tok || token);
      if (res.success) {
        setJobs(res.jobs);
      }
    } catch (err) {
      showError(err.message || "Failed to load jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const loadUsers = async (tok) => {
    setUsersLoading(true);
    try {
      const res = await fetchAdminUsers(tok || token);
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      showError(err.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Toggle Employer Access (Grant / Revoke)
  const handleToggleAccess = async (employerId, newAccessState) => {
    if (!token) return;
    try {
      const res = await toggleEmployerAccess(
        employerId,
        { employerAccess: newAccessState, isApproved: newAccessState },
        token
      );
      if (res.success) {
        showSuccess(res.message || "Employer access status updated!");
        loadEmployers(token);
        loadStats(token);
        if (selectedEmployerModal && selectedEmployerModal._id === employerId) {
          setSelectedEmployerModal({
            ...selectedEmployerModal,
            employerAccess: newAccessState,
            isApproved: newAccessState,
            status: newAccessState ? "Active" : "Suspended",
          });
        }
      }
    } catch (err) {
      showError(err.message || "Operation failed");
    }
  };

  // Toggle Job Status (Active / Closed)
  const handleToggleJobStatus = async (jobId, newStatus) => {
    if (!token) return;
    try {
      const res = await updateAdminJobStatus(jobId, newStatus, token);
      if (res.success) {
        showSuccess(`Job status updated to ${newStatus}`);
        setJobs(jobs.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j)));
        loadStats(token);
      }
    } catch (err) {
      showError(err.message || "Failed to update job status");
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete job "${jobTitle}"?`)) return;
    try {
      const res = await deleteAdminJob(jobId, token);
      if (res.success) {
        showSuccess("Job listing deleted successfully");
        setJobs(jobs.filter((j) => j._id !== jobId));
        loadStats(token);
      }
    } catch (err) {
      showError(err.message || "Failed to delete job");
    }
  };

  // Update User Role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await updateUserRole(userId, newRole, token);
      if (res.success) {
        showSuccess(`Role updated to ${newRole}`);
        loadUsers(token);
        loadEmployers(token);
        loadStats(token);
      }
    } catch (err) {
      showError(err.message || "Role update failed");
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user account "${username}"?`)) return;
    try {
      const res = await deleteUserByAdmin(userId, token);
      if (res.success) {
        showSuccess("User account deleted");
        setUsers(users.filter((u) => u._id !== userId));
        setEmployers(employers.filter((e) => e._id !== userId));
        loadStats(token);
      }
    } catch (err) {
      showError(err.message || "User deletion failed");
    }
  };

  // Seed / Self-Promote Admin button
  const handleSeedAdmin = async () => {
    if (!token) {
      showError("Please sign in first to promote your account to Admin");
      navigate("/login");
      return;
    }

    setSeeding(true);
    try {
      const res = await seedAdminAccount(token);
      if (res.success) {
        showSuccess("Account upgraded to Admin role!");
        const updatedUser = { ...user, role: "Admin", status: "Active" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("auth-change"));
        loadAllAdminData(token);
      }
    } catch (err) {
      showError(err.message || "Could not grant admin status");
    } finally {
      setSeeding(false);
    }
  };

  // Auth Guard Screen if not Admin
  if (!loading && (!token || !user || user.role !== "Admin")) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">
            Administrator Access Required
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You must be logged in as an <strong>Admin</strong> account to manage employer portal access, grant privileges, and view overall portal analytics.
          </p>

          <div className="space-y-3">
            {token && user && user.role !== "Admin" && (
              <button
                disabled={seeding}
                onClick={handleSeedAdmin}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {seeding ? (
                  <RefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                Enable Admin Access (Promote Current Account)
              </button>
            )}

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In as Admin <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">Admin Control Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm">
                Signed in as <strong>{user?.username}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadAllAdminData(token)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={15} /> Sync Data
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => handleTabSwitch("overview")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} /> Overview & Analytics
          </button>

          <button
            onClick={() => handleTabSwitch("employers")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "employers"
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} /> Employer Access Control
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === "employers" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"
              }`}
            >
              {employers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch("jobs")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "jobs"
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Briefcase size={18} /> Job Postings
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === "jobs" ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-700"
              }`}
            >
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch("users")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "users"
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users size={18} /> All Users
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === "users" ? "bg-violet-500 text-white" : "bg-violet-100 text-violet-700"
              }`}
            >
              {users.length}
            </span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            recentUsers={recentUsers}
            handleTabSwitch={handleTabSwitch}
          />
        )}

        {activeTab === "employers" && (
          <EmployersTab
            employers={employers}
            employersLoading={employersLoading}
            onToggleAccess={handleToggleAccess}
            onDeleteUser={handleDeleteUser}
            onViewEmployerModal={(emp) => setSelectedEmployerModal(emp)}
            onRefresh={() => loadEmployers(token)}
          />
        )}

        {activeTab === "jobs" && (
          <JobsTab
            jobs={jobs}
            jobsLoading={jobsLoading}
            onToggleJobStatus={handleToggleJobStatus}
            onDeleteJob={handleDeleteJob}
            onRefresh={() => loadJobs(token)}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            usersLoading={usersLoading}
            onUpdateRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
            onRefresh={() => loadUsers(token)}
          />
        )}
      </div>

      {/* MODAL */}
      <EmployerDetailModal
        employer={selectedEmployerModal}
        onClose={() => setSelectedEmployerModal(null)}
        onToggleAccess={handleToggleAccess}
      />
    </div>
  );
}
