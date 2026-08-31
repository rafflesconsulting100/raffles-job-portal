import React from "react";
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  Layers,
  Sparkles,
  Award,
  Languages,
  GraduationCap,
  Mail,
  Phone,
  UserCheck,
  ShieldCheck,
  Building
} from "lucide-react";

export default function AdminJobDetailModal({
  job,
  onClose,
  onToggleStatus,
  onDeleteJob,
  isBusy,
}) {
  if (!job) return null;

  const isActive = job.status === "active";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 font-black text-xl flex items-center justify-center text-white shadow-md shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                job.company?.charAt(0).toUpperCase() || "J"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {job.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                <Building2 size={13} className="text-blue-400" />
                {job.company || "Company"} • Posted{" "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 text-sm">
          {/* STATUS & CONTROL BANNER */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isActive
                ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                : "bg-slate-100 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {isActive ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">
                  Listing Status:{" "}
                  <span className={isActive ? "text-emerald-700 uppercase" : "text-slate-600 uppercase"}>
                    {job.status || "Active"}
                  </span>
                </p>
                <p className="text-xs text-slate-600">
                  {isActive
                    ? "Job is live on the portal for candidate applications."
                    : "Job is closed and no longer accepts new candidate applications."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={isBusy}
                onClick={() => onToggleStatus(job._id, job.status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-slate-700 hover:bg-slate-800 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                }`}
              >
                {isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                {isActive ? "Close Listing" : "Make Active"}
              </button>

              <button
                disabled={isBusy}
                onClick={() => {
                  onDeleteJob(job._id, job.title);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                title="Delete Job"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          {/* KEY SPECS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                Location
              </span>
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                <MapPin size={13} className="text-slate-500 shrink-0" />
                {job.location || "Remote / India"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                Salary
              </span>
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                <IndianRupee size={13} className="text-slate-500 shrink-0" />
                {job.salary || "Competitive"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                Experience
              </span>
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                <Briefcase size={13} className="text-slate-500 shrink-0" />
                {job.experienceLevel || job.experienceYears || "0-3 Yrs"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                Applicants
              </span>
              <p className="font-bold text-indigo-700 text-xs flex items-center gap-1">
                <Users size={13} className="text-indigo-600 shrink-0" />
                {job.applicantCount || 0} Candidates
              </p>
            </div>
          </div>

          {/* EMPLOYER / CREATOR INFO */}
          {job.creator && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Posted by Recruiter / Employer
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                    {job.creator.username?.charAt(0).toUpperCase() || "E"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{job.creator.username}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Mail size={11} /> {job.creator.email}
                    </p>
                  </div>
                </div>

                {job.creator.contactNumber && (
                  <div className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Phone size={12} className="text-slate-400" />
                    <span>{job.creator.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* JOB SPECIFICATIONS */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-600" /> Specifications & Mode
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-slate-800">{job.category || "Software & Tech"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Job Type</span>
                <span className="font-bold text-slate-800">{job.jobType || "Full-time"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Mode</span>
                <span className="font-bold text-slate-800">{job.workMode || "On-site"}</span>
              </div>
              {job.minEducation && (
                <div className="col-span-2 sm:col-span-3 border-t border-slate-200 pt-2 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-blue-600" />
                  <span className="text-slate-600">
                    Min Education: <strong>{job.minEducation}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          {job.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Job Description
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs font-medium">
                {job.description}
              </div>
            </div>
          )}

          {/* REQUIREMENTS */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award size={14} className="text-emerald-600" /> Key Requirements
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" /> Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT COMPANY */}
          {job.aboutCompany && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building size={14} className="text-indigo-600" /> About {job.company}
              </h4>
              <p className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {job.aboutCompany}
              </p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onDeleteJob(job._id, job.title);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} /> Delete Job Post
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
