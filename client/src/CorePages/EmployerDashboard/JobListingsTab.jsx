import React from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Edit3,
  Trash2,
  Languages
} from "lucide-react";

export default function JobListingsTab({
  jobs,
  filteredJobs,
  jobsLoading,
  jobSearch,
  setJobSearch,
  jobStatusFilter,
  setJobStatusFilter,
  handleTabSwitch,
  handleToggleJobStatus,
  startEditJob,
  setDeletingJobId,
  resetForm
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-11 w-full max-w-md focus-within:border-[#2B2A8C] focus-within:bg-white transition">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search by job title or location..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
            {jobSearch && (
              <button onClick={() => setJobSearch("")} className="text-slate-400 hover:text-slate-700 text-xs">
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 h-11 outline-none focus:border-[#2B2A8C] focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> postings
        </div>
      </div>

      {/* Jobs List */}
      {jobsLoading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#2B2A8C] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading job postings...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Job Listings Found</h3>
          <p className="text-slate-500 text-xs mt-1 mb-6">
            {jobSearch || jobStatusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "You haven't created any job postings yet."}
          </p>
          <button
            onClick={() => {
              resetForm();
              handleTabSwitch("post-job");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] text-[#ffffff] font-bold text-xs transition cursor-pointer shadow-xs"
          >
            + Post First Job
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                      job.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {job.status}
                  </span>
                  <span className="text-xs bg-blue-50 text-[#2B2A8C] border border-blue-100 px-2.5 py-1 rounded-full font-semibold">
                    {job.jobType}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                    {job.experienceLevel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <IndianRupee className="w-4 h-4" /> {job.salary || "Not Specified"}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
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

                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  onClick={() => handleTabSwitch("applicants", job._id)}
                  className="px-4 py-2.5 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Users className="w-4 h-4" /> View Applicants
                </button>

                <button
                  onClick={() => handleToggleJobStatus(job)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    job.status === "active"
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {job.status === "active" ? "Mark Closed" : "Re-Open"}
                </button>

                <button
                  onClick={() => startEditJob(job)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                  title="Edit Job"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeletingJobId(job._id)}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
