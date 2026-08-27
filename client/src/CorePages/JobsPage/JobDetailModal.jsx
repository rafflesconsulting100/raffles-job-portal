import React, { useState } from 'react';
import {
  Bookmark,
  X,
  Building2,
  IndianRupee,
  MapPin,
  Briefcase,
  CheckCircle2,
  Check,
  Send,
  GraduationCap,
  Building,
  Star,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Users,
  Share2,
  Layers,
  Sparkles,
  Award,
  Languages
} from 'lucide-react';
import { showSuccess } from '../../Utils/toast';

export default function JobDetailModal({
  job,
  onClose,
  isSaved,
  isApplied,
  onSaveClick,
  onApplyClick
}) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;
  const jobId = job._id || job.id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showSuccess(`Job link for "${job.title}" copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 selection:bg-[#2563EB] selection:text-white">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 transform transition-all max-h-[92vh] overflow-y-auto space-y-6 text-slate-900">

        {/* Top Controls: Header & Close */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#2B2A8C] bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
            Job Details Overview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveClick(jobId, job.title)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Bookmark Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              title="Share Job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header: Title & Company info */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-linear-to-br ${job.logoBg || 'from-blue-600 via-indigo-600 to-purple-700'}  text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shrink-0 border border-slate-200`}>
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover bg-white"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span>{job.company ? job.company.substring(0, 2).toUpperCase() : 'RC'}</span>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" />
                {job.company || 'Verified Employer'}
              </span>

              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-amber-800 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>4.2</span>
              </div>

              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* 3-Pillar Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Briefcase className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Experience</p>
              <p className="text-xs sm:text-sm font-black text-slate-900">
                {job.experience || job.experienceYears || '0 - 3 Yrs'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <IndianRupee className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Salary</p>
              <p className="text-xs sm:text-sm font-black text-slate-900">
                {job.salary ? (job.salary.startsWith('') ? job.salary : `${job.salary}`) : '₹3.5 - 6.5 Lacs P.A.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <MapPin className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Location</p>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {job.location || 'Erode, Tamil Nadu'}
              </p>
            </div>
          </div>
        </div>

        {/* Number of Openings & Preferred Languages */}
        {(job.numberOfOpenings != null || (job.preferredLanguages && job.preferredLanguages.length > 0)) && (
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              Job Information
            </h3>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              {job.numberOfOpenings != null && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Number of Openings
                  </span>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    {job.numberOfOpenings}
                  </p>
                </div>
              )}
              {job.preferredLanguages && job.preferredLanguages.length > 0 && (
                <div className="space-y-0.5 col-span-2 border-t border-slate-200 pt-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Preferred Languages
                  </span>
                  <p className="text-xs font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    {job.preferredLanguages.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Highlights Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            Job Overview & Specifications
          </h3>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Role / Department</span>
              <p className="text-xs font-bold text-slate-900">{job.category || 'Software & Tech'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Work Mode</span>
              <p className="text-xs font-bold text-slate-900">{job.workMode || 'On-site'} ({job.jobType || 'Full-Time'})</p>
            </div>
            <div className="space-y-0.5 col-span-2 border-t border-slate-200 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Min Education</span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                {job.minEducation || 'Bachelor Degree or Equivalent'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Job Description</h3>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-200 font-medium">
            {job.description}
          </p>
        </div>

        {/* Key Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Key Requirements
            </h3>
            <div className="space-y-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              {job.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
         
        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 bg-white text-slate-900 border border-slate-300 font-bold text-xs rounded-full shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* About Company Section */}
        {job.aboutCompany && (
          <div className="space-y-2 bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#2B2A8C]" />
              About {job.company}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
              {job.aboutCompany}
            </p>
          </div>
        )}

        {/* Fraud Advisory Notice */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-amber-900">Job Safety & Scam Warning</p>
            <p className="text-amber-800 font-medium mt-0.5">
              Raffles Job Portal is 100% free for candidates. Never pay money to anyone for interview calls or offer letters.
            </p>
          </div>
        </div>

        {/* END OF JOB CARD DETAILS - APPLY BUTTON ACTION */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900">Interested in this role?</h4>
              <p className="text-xs text-slate-600 font-medium">Submit your verified application directly to {job.company}.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 border border-slate-300 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => onApplyClick(job)}
              disabled={isApplied}
              className={`flex-1 py-3.5 px-5 rounded-2xl text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                isApplied
                  ? 'bg-emerald-700 text-white cursor-not-allowed'
                  : 'bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] text-white shadow-blue-600/25 active:scale-98'
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Applied Already</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

