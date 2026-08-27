import React from "react";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Building2,
  MapPin,
  IndianRupee,
  Edit3,
  Sparkles,
  HelpCircle,
  Languages
} from "lucide-react";

export default function OverviewTab({ stats, jobs, handleTabSwitch, startEditJob, resetForm }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalJobs}</div>
          <div className="text-xs text-slate-500 mt-2">Active recruitment drives</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applicants</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalApplicants}</div>
          <div className="text-xs text-slate-500 mt-2">Candidates registered</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{stats.pending}</div>
          <div className="text-xs text-slate-500 mt-2">Awaiting decision</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted / Hired</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.accepted}</div>
          <div className="text-xs text-slate-500 mt-2">Accepted applications</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{stats.rejected}</div>
          <div className="text-xs text-slate-500 mt-2">Closed applications</div>
        </div>
      </div>

      {/* RECENT JOBS & QUICK ACTIONS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Postings */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Job Openings</h3>
              <p className="text-xs text-slate-500">Manage and view recent active hiring listings</p>
            </div>
            <button
              onClick={() => handleTabSwitch("my-jobs")}
              className="text-xs font-bold text-[#2B2A8C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Jobs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 text-sm font-semibold">No active jobs posted yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-4">Post your first job listing to receive candidate applications.</p>
              <button
                onClick={() => handleTabSwitch("post-job")}
                className="px-4 py-2 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                + Create Job Post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 4).map((job) => (
                <div
                  key={job._id}
                  className="bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 hover:bg-white rounded-2xl p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          job.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600 border border-slate-300"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <IndianRupee className="w-3.5 h-3.5" /> {job.salary || "Negotiable"}
                      </span>
                      {job.numberOfOpenings != null && (
                        <span className="flex items-center gap-1 text-[#2B2A8C] font-semibold">
                          <Users className="w-3.5 h-3.5" /> {job.numberOfOpenings} Openings
                        </span>
                      )}
                      {job.preferredLanguages && job.preferredLanguages.length > 0 && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Languages className="w-3.5 h-3.5" /> {job.preferredLanguages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTabSwitch("applicants", job._id)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2B2A8C] text-xs font-bold border border-blue-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" /> View Applicants
                    </button>
                    <button
                      onClick={() => startEditJob(job)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="Edit Job"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Helpful Tips & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-100 text-[#2B2A8C]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recruiter Fast-Track</h3>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Add custom <strong>screening questions</strong> when posting jobs to pre-qualify applicants and streamline candidate reviews!
            </p>
            <button
              onClick={() => {
                resetForm();
                handleTabSwitch("post-job");
              }}
              className="w-full py-3 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              + Create Screening Job Post
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Employer Support
            </h4>
            <ul className="text-xs text-slate-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#2B2A8C] font-bold">•</span>
                <span>Applicants receive instant status notifications when shortlisted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2B2A8C] font-bold">•</span>
                <span>Closing a job hides it from public search results without deleting candidates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2B2A8C] font-bold">•</span>
                <span>Download resumes directly from candidate profile cards.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
