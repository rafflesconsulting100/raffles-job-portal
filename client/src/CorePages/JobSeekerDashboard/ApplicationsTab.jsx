import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  ExternalLink,
  HelpCircle
} from "lucide-react";

export default function ApplicationsTab({
  applications = [],
  loading = false,
  setViewingApplicationModal,
  setWithdrawingAppId
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtering
  const filteredApps = applications.filter((app) => {
    const job = app.job || {};
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const matchesSearch =
      title.includes(search.toLowerCase()) || company.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Job Applications</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all positions you have applied for
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {["all", "pending", "accepted", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
          Loading your job applications...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No applications found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "You haven't applied to any job openings yet."}
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl hover:bg-[#1D4ED8] transition shadow-md"
          >
            <Search size={15} /> Find & Apply for Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const job = app.job || {};
            const appliedDate = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently";

            const isAccepted = app.status === "accepted";
            const isRejected = app.status === "rejected";

            return (
              <div
                key={app._id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Job & Company Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">
                          {job.title || "Position Title Unavailable"}
                        </h3>
                        {job.jobType && (
                          <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                            {job.jobType}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Building2 size={14} className="text-slate-400" />
                          {job.company || "Company"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar size={14} /> Applied on {appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                        isAccepted
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : isRejected
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isAccepted && <CheckCircle2 size={15} />}
                      {isRejected && <XCircle size={15} />}
                      {!isAccepted && !isRejected && <Clock size={15} />}
                      {app.status || "Pending"}
                    </span>

                    <button
                      onClick={() => setViewingApplicationModal(app)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => setWithdrawingAppId(app._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Withdraw Application"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
