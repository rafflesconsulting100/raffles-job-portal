import React from 'react';
import {
  Building2,
  Bookmark,
  IndianRupee,
  MapPin,
  Briefcase,
  Check,
  Share2,
  Send,
  GraduationCap,
  Building
} from 'lucide-react';
import { showSuccess } from '../../Utils/toast';

export default function JobDetailPreview({
  job,
  isSaved,
  isApplied,
  onSaveClick,
  onApplyClick
}) {
  if (!job) return null;
  const jobId = job._id || job.id;

  return (
    <div className="hidden xl:block xl:col-span-6 sticky top-24 max-h-[85vh] overflow-y-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Detailed Title */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl overflow-hidden ${job.logoBg || 'bg-linear-to-br from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0 border border-slate-100`}>
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover bg-white"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : null}
              {!job.companyLogo && (
                <span>{job.company ? job.company.substring(0, 2).toUpperCase() : 'JP'}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] leading-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-bold text-gray-500 flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {job.company}
                </p>
                {job.category && (
                  <span className="bg-blue-50 text-[#2B2A8C] text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-100">
                    {job.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveClick(jobId, job.title)}
              className={`p-2.5 rounded-xl border hover:bg-gray-50 transition cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
              title="Bookmark Job"
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Metadata boxes */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Salary Package</span>
            <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-gray-500 shrink-0" />
              {job.salary}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location / Venue</span>
            <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              {job.location}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Work Mode</span>
            <p className="text-xs font-bold text-[#1e293b]">
              {job.workMode} ({job.jobType})
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience Required</span>
            <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-gray-500 shrink-0" />
              {job.experience} ({job.experienceLevel})
            </p>
          </div>
          {job.minEducation && (
            <div className="space-y-1 col-span-2 border-t border-gray-200/60 pt-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Min Education</span>
              <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#2B2A8C] shrink-0" />
                {job.minEducation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Actions Bar */}
      <div className="flex gap-4 border-t border-b border-gray-100 py-4">
        <button
          onClick={() => onApplyClick(job)}
          disabled={isApplied}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            isApplied
              ? 'bg-emerald-600 text-white cursor-not-allowed shadow-xs'
              : 'bg-[#2B2A8C] hover:bg-[#1E1D66] text-white shadow-md active:scale-95'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-4 h-4" />
              Applied Already
            </>
          ) : (
            'Apply Now'
          )}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showSuccess(`Copied link to "${job.title}"!`);
          }}
          className="px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer"
          title="Share Job"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Job Description Detail */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* About Company Section */}
      {job.aboutCompany && (
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-[#2B2A8C]" />
            About {job.company}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {job.aboutCompany}
          </p>
        </div>
      )}

      {/* Key Requirements & Skills */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Requirements</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Key Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-50 text-[#2B2A8C] rounded-lg text-xs font-bold border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* END OF JOB CARD APPLY ACTION */}
      <div className="pt-6 border-t border-gray-100 flex flex-col space-y-3 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#1e293b]">Interested in this position?</h4>
            <p className="text-xs text-gray-500">Apply now to submit your profile directly to {job.company}.</p>
          </div>
        </div>
        <button
          onClick={() => onApplyClick(job)}
          disabled={isApplied}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            isApplied
              ? 'bg-emerald-600 text-white cursor-not-allowed'
              : 'bg-[#2B2A8C] hover:bg-[#1E1D66] text-white active:scale-95'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-4 h-4" />
              Applied Already
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Apply Now for {job.title}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
