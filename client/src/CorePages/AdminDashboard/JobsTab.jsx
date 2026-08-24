import React, { useState } from "react";
import {
  Search,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Users,
  Eye,
  X
} from "lucide-react";

export default function JobsTab({
  jobs,
  jobsLoading,
  onToggleJobStatus,
  onDeleteJob,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyJobId, setBusyJobId] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "active") return matchesSearch && job.status === "active";
    if (statusFilter === "closed") return matchesSearch && job.status === "closed";
    return matchesSearch;
  });

  const handleStatusToggle = async (jobId, currentStatus) => {
    setBusyJobId(jobId);
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      await onToggleJobStatus(jobId, newStatus);
    } finally {
      setBusyJobId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={24} /> Portal-Wide Job Postings
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Monitor, toggle active states, or remove job listings across all employers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={16} className={jobsLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company, or employer..."
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
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              statusFilter === "active"
                ? "bg-emerald-600 text-white"
                : "bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 size={14} /> Active ({jobs.filter((j) => j.status === "active").length})
          </button>
          <button
            onClick={() => setStatusFilter("closed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              statusFilter === "closed"
                ? "bg-slate-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <XCircle size={14} /> Closed ({jobs.filter((j) => j.status === "closed").length})
          </button>
        </div>
      </div>

      {/* JOBS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {jobsLoading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-blue-600" />
            <p className="font-semibold text-sm">Loading job listings...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Job Title & Company</th>
                  <th className="py-4 px-6">Posted By</th>
                  <th className="py-4 px-6">Location & Type</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((j) => {
                  const isActive = j.status === "active";
                  const isBusy = busyJobId === j._id;

                  return (
                    <tr key={j._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-base">{j.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={12} /> {j.company}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 text-xs">
                          {j.creator?.username || "Employer"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {j.creator?.email || ""}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {j.location}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {j.jobType} • {j.experienceLevel}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                          <Users size={13} /> {j.applicantCount || 0}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <XCircle size={12} /> Closed
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isBusy}
                            onClick={() => handleStatusToggle(j._id, j.status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              isActive
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-500"
                            }`}
                          >
                            {isBusy ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : isActive ? (
                              "Close Job"
                            ) : (
                              "Activate"
                            )}
                          </button>

                          <button
                            onClick={() => onDeleteJob(j._id, j.title)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <Briefcase size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-800 text-base">No job postings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
