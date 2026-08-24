import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Search,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Trash2,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function SavedJobsTab({
  savedJobs = [],
  loading = false,
  toggleSaveJob,
  handleTabSwitch
}) {
  const [search, setSearch] = useState("");

  const filteredSaved = savedJobs.filter((job) => {
    if (!job) return false;
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const q = search.toLowerCase();
    return title.includes(q) || company.includes(q) || location.includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Saved Jobs</h2>
          <p className="text-xs text-slate-500 mt-1">
            Positions you bookmarked for later review and application
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
          Loading saved jobs...
        </div>
      ) : filteredSaved.length === 0 ? (
        <div className="py-16 text-center">
          <Bookmark size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No saved jobs</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {search
              ? "No saved jobs match your search criteria."
              : "Save interesting job postings while exploring open roles."}
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl hover:bg-[#1D4ED8] transition shadow-md"
          >
            <Search size={15} /> Explore Available Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSaved.map((job) => {
            const requirements = Array.isArray(job.requirements)
              ? job.requirements
              : [];

            return (
              <div
                key={job._id || job.id}
                className="p-6 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-slate-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 font-black text-base flex items-center justify-center shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 size={13} /> {job.company}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job._id || job.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Remove from saved jobs"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Details Badges */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 my-4 flex-wrap">
                    <span className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <MapPin size={13} className="text-slate-400" /> {job.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Briefcase size={13} className="text-slate-400" /> {job.jobType || "Full-time"}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                        <DollarSign size={13} /> {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Skills tags preview */}
                  {requirements.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {requirements.slice(0, 3).map((req, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    {job.experienceLevel || "All levels"}
                  </span>

                  <Link
                    to="/jobs"
                    className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                  >
                    Apply Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
