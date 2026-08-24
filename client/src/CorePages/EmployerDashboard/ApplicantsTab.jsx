import React from "react";
import {
  Search,
  RefreshCw,
  Users,
  FileText,
  ExternalLink,
  Eye,
  UserCheck,
  UserX
} from "lucide-react";

export default function ApplicantsTab({
  selectedJobId,
  setSelectedJobId,
  setSearchParams,
  jobs,
  applicantSearch,
  setApplicantSearch,
  applicantStatusFilter,
  setApplicantStatusFilter,
  filteredApplicants,
  applicantsLoading,
  setViewingApplicantModal,
  handleUpdateStatus,
  updatingAppId
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Job Selector & Search Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Select Job Posting */}
          <div className="w-full sm:w-72">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Select Job Opening
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams({ tab: "applicants", jobId: e.target.value });
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3.5 h-11 outline-none focus:border-[#2B2A8C] focus:bg-white"
            >
              {jobs.length === 0 && <option value="">No Jobs Posted</option>}
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.company})
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Search */}
          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Search Candidate
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 focus-within:border-[#2B2A8C] focus-within:bg-white">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Name or email..."
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter Status
            </label>
            <select
              value={applicantStatusFilter}
              onChange={(e) => setApplicantStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 h-11 outline-none focus:border-[#2B2A8C] focus:bg-white"
            >
              <option value="all">All Applicants</option>
              <option value="pending">Pending Review</option>
              <option value="accepted">Accepted / Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium self-end md:self-center">
          Total Applicants: <strong className="text-slate-900">{filteredApplicants.length}</strong>
        </div>
      </div>

      {/* Applicants Cards / Table */}
      {applicantsLoading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#2B2A8C] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Fetching candidate applications...</p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Applicants Found</h3>
          <p className="text-slate-500 text-xs mt-1">
            {jobs.length === 0
              ? "Post a job opening to start receiving job candidate applications."
              : "No candidates match the current search filters for this job."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.map((app) => {
            const candidate = app.applicant || {};
            return (
              <div
                key={app._id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2B2A8C] to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                    {(candidate.username || "C").charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-bold text-slate-900">
                        {candidate.username || "Anonymous Candidate"}
                      </h4>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          app.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : app.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>📧 {candidate.email}</span>
                      {candidate.contactNumber && <span>📞 {candidate.contactNumber}</span>}
                      {candidate.location && <span>📍 {candidate.location}</span>}
                      <span className="text-slate-400">
                        📅 Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {candidate.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-3 self-end md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Resume Download / View */}
                  {app.resume && (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-[#2B2A8C]" /> Resume <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}

                  {/* Screening Q&A Details */}
                  {app.screeningAnswers && app.screeningAnswers.length > 0 && (
                    <button
                      onClick={() => setViewingApplicantModal(app)}
                      className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2B2A8C] border border-blue-100 transition cursor-pointer"
                      title="View Screening Answers"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {/* Accept / Reject Buttons */}
                  <button
                    onClick={() => handleUpdateStatus(app._id, "accepted")}
                    disabled={updatingAppId === app._id || app.status === "accepted"}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 disabled:opacity-50 text-xs font-bold border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Accept
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app._id, "rejected")}
                    disabled={updatingAppId === app._id || app.status === "rejected"}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-50 text-xs font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
