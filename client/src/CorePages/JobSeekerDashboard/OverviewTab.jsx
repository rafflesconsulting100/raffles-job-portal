import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Bookmark,
  ArrowUpRight,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Trash2
} from "lucide-react";

export default function OverviewTab({
  stats,
  applications = [],
  savedJobs = [],
  handleTabSwitch,
  setViewingApplicationModal,
  setWithdrawingAppId,
  toggleSaveJob,
  profileCompletion
}) {
  const recentApplications = applications.slice(0, 4);
  const recentSaved = savedJobs.slice(0, 3);

  const statCards = [
    {
      title: "Total Applied",
      value: stats.totalApplied,
      icon: FileText,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-100",
      tab: "applications",
    },
    {
      title: "Under Review",
      value: stats.pending,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-100",
      tab: "applications",
    },
    {
      title: "Shortlisted / Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-100",
      tab: "applications",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600",
      bgLight: "bg-rose-50 border-rose-100",
      tab: "applications",
    },
    {
      title: "Saved Bookmarks",
      value: stats.savedCount,
      icon: Bookmark,
      color: "from-purple-600 to-violet-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50 border-purple-100",
      tab: "saved-jobs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => handleTabSwitch(card.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-linear-to-r ${card.color} text-white shadow-xs group-hover:scale-110 transition duration-300`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900">
                  {card.value}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600 font-semibold flex items-center gap-0.5">
                  View <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: RECENT APPLICATIONS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                <p className="text-xs text-slate-500 mt-0.5">Track real-time status updates from recruiters</p>
              </div>
              <button
                onClick={() => handleTabSwitch("applications")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                View All ({applications.length}) <ArrowUpRight size={14} />
              </button>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="mx-auto text-slate-300 mb-3" size={40} />
                <h4 className="font-bold text-slate-700">No applications yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Start applying to open positions to track your application progress here.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl hover:bg-[#1D4ED8] transition"
                >
                  <Search size={14} /> Explore Open Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => {
                  const job = app.job || {};
                  const isAccepted = app.status === "accepted";
                  const isRejected = app.status === "rejected";

                  return (
                    <div
                      key={app._id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2B2A8C] font-bold flex items-center justify-center shrink-0">
                          {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                            {job.title || "Job Posting"}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Building2 size={13} /> {job.company || "Company"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} /> {job.location || "Remote"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                            isAccepted
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isRejected
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isAccepted && <CheckCircle size={13} />}
                          {isRejected && <XCircle size={13} />}
                          {!isAccepted && !isRejected && <Clock size={13} />}
                          {app.status || "Pending"}
                        </span>

                        <button
                          onClick={() => setViewingApplicationModal(app)}
                          className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SAVED JOBS & QUICK ACTIONS */}
        <div className="space-y-6">
          {/* PROFILE COMPLETENESS CARD */}
          <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Profile Readiness
              </span>
              <Sparkles size={18} className="text-amber-400" />
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span>Completeness</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Complete profile details and upload your latest resume to boost recruiter visibility by 3x.
            </p>

            <button
              onClick={() => handleTabSwitch("profile")}
              className="w-full py-2.5 bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Update Profile Details
            </button>
          </div>

          {/* SAVED JOBS PREVIEW */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bookmark size={16} className="text-purple-600" /> Saved Jobs ({savedJobs.length})
              </h3>
              <button
                onClick={() => handleTabSwitch("saved-jobs")}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {recentSaved.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No saved jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSaved.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {job.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {job.company} • {job.location}
                      </p>
                    </div>

                    <Link
                      to="/jobs"
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold rounded-lg transition shrink-0"
                    >
                      Apply
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
