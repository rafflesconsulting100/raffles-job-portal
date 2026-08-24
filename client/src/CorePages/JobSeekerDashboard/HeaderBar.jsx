import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  RefreshCw,
  Search,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function HeaderBar({
  user,
  loading,
  handleTabSwitch,
  loadDashboardData,
  token,
  profileCompletion
}) {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="bg-linear-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* User Identity & Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/30 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg border border-white/20">
                {initial}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Active Candidate" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {user?.username || "Candidate"}! 👋
              </h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                Job Seeker
              </span>
            </div>
            
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {user?.bio ? user.bio : "Track your job applications, manage saved jobs, and update your professional profile."}
            </p>

            {/* Profile setup reminder */}
            <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className={profileCompletion >= 80 ? "text-emerald-400" : "text-amber-400"} />
                Profile Strength: <strong className="text-white">{profileCompletion}%</strong>
              </span>
              {user?.resumeOriginalName && (
                <span className="hidden sm:flex items-center gap-1.5 text-indigo-300">
                  <FileText size={15} /> Resume Attached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => loadDashboardData(token)}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition duration-200 backdrop-blur-md border border-white/10 cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => handleTabSwitch("profile")}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition duration-200 backdrop-blur-md border border-white/10 flex items-center gap-2 cursor-pointer"
          >
            <User size={16} /> Edit Profile
          </button>

          <Link
            to="/jobs"
            className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Briefcase size={16} /> Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
