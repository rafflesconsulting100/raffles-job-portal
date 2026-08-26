import React, { useState } from 'react';
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
  Building,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  ShieldAlert,
  Star,
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { showSuccess } from '../../Utils/toast';

export default function JobDetailPreview({
  job,
  isSaved = false,
  isApplied = false,
  onSaveClick,
  onApplyClick,
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <div className={`bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-600 shadow-sm ${className}`}>
        <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="font-bold text-slate-800">Select a job from the list to view its complete details.</p>
      </div>
    );
  }

  const jobId = job._id || job.id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showSuccess(`Job link for "${job.title}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-900 space-y-6 max-h-[88vh] overflow-y-auto ${className}`}
    >
      {/* 1. NAUKRI-STYLE HEADER CARD */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-linear-to-br ${job.logoBg || 'from-blue-600 via-indigo-600 to-purple-700'}  text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shrink-0 border border-slate-200"
            >
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover bg-white"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span>{job.company ? job.company.substring(0, 2).toUpperCase() : 'RC'}</span>
              )}
            </div>

            {/* Title & Company */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
                <span className="font-bold text-slate-800 hover:text-[#2563EB] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                  {job.company || 'Verified Employer'}
                </span>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-amber-800 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>4.2</span>
                  <span className="text-amber-700 font-semibold text-[10px] ml-0.5">(150+ reviews)</span>
                </div>

                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions: Bookmark & Share */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSaveClick && onSaveClick(jobId, job.title)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title={isSaved ? 'Job Saved' : 'Save Job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Share Job Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. THREE-PILLAR NAUKRI STATS BAR (Experience, Salary, Location) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          {/* Experience */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Briefcase className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Experience</p>
              <p className="text-sm font-black text-slate-900">
                {job.experience || job.experienceYears || '0 - 3 Yrs'}
              </p>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <IndianRupee className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Salary Package</p>
              <p className="text-sm font-black text-slate-900">
                {job.salary ? (job.salary.startsWith('₹') ? job.salary : `₹${job.salary}`) : '₹3.5 - 6.5 Lacs P.A.'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <MapPin className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Location</p>
              <p className="text-sm font-black text-slate-900 truncate">
                {job.location || 'Erode, Tamil Nadu'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Posting Meta Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Posted: {job.postedAgo || 'Recently'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Applicants: 45+ candidates
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-[#2B2A8C] px-2.5 py-0.5 rounded-md text-xs font-black">
              {job.jobType || 'Full Time'}
            </span>
            <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md text-xs font-black">
              {job.workMode || 'On-site'}
            </span>
          </div>
        </div>

        {/* Top Apply Button */}
        <div className="pt-2">
          <button
            onClick={() => onApplyClick && onApplyClick(job)}
            disabled={isApplied}
            className={`w-full py-3.5 px-6 rounded-2xl text-sm font-black transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
              isApplied
                ? 'bg-emerald-700 text-white cursor-not-allowed shadow-emerald-700/20'
                : 'bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] text-white shadow-blue-600/25 hover:shadow-lg active:scale-98'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Application Submitted Already</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Apply for this Job</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. JOB HIGHLIGHTS & KEY INSIGHTS (Naukri Style Details Grid) */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          Job Highlights & Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Role / Designation</span>
            <p className="text-xs font-bold text-slate-900">{job.title}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Industry / Department</span>
            <p className="text-xs font-bold text-slate-900">{job.category || 'Recruitment & Staffing'}</p>
          </div>

          <div className="space-y-0.5 border-t border-slate-200 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Employment Type</span>
            <p className="text-xs font-bold text-slate-900">{job.jobType || 'Full Time, Permanent'}</p>
          </div>

          <div className="space-y-0.5 border-t border-slate-200 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Min Education</span>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
              {job.minEducation || 'Any Graduate / Postgraduate'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. KEY SKILLS SECTION (Naukri Signature Skill Pills) */}
      {job.skills && job.skills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            Key Skills & Technologies
          </h3>

          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 bg-white text-slate-900 border border-slate-300 hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-xs rounded-full shadow-2xs transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. JOB DESCRIPTION & RESPONSIBILITIES */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Job Description & Responsibilities
        </h3>
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
          <p className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">
            {job.description ||
              'We are searching for a passionate and result-oriented candidate to join our team. The ideal professional will be responsible for handling end-to-end tasks, collaborating across teams, and delivering high quality results on time.'}
          </p>
        </div>
      </div>

      {/* 6. KEY REQUIREMENTS & QUALIFICATIONS */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Candidate Requirements
          </h3>

          <div className="space-y-2 bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
            {job.requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. ABOUT COMPANY SECTION */}
      <div className="space-y-3 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-[#2B2A8C]" />
          About {job.company || 'Raffles Consulting'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
          {job.aboutCompany ||
            `${job.company || 'Raffles Consulting'} is a top recruitment and staffing agency committed to bridging top-tier talent with industry leaders. We foster a collaborative, growth-oriented environment with competitive compensation.`}
        </p>

        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-700 font-bold gap-2">
          <span>Headquarters: Erode, Tamil Nadu</span>
          <span className="text-[#2563EB]">Official Recruitment Partner</span>
        </div>
      </div>

      {/* 8. NAUKRI-STYLE FRAUD ADVISORY BOX */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-extrabold text-amber-900">Fraud Advisory & Job Safety</p>
          <p className="text-amber-800 leading-relaxed font-medium">
            Raffles Job Portal does not charge any registration or interview fee from candidates. If someone asks for money promising a job, please report them immediately.
          </p>
        </div>
      </div>

      {/* 9. BOTTOM STICKY-LIKE CTA CARD */}
      <div className="pt-6 border-t border-slate-200 flex flex-col space-y-3 bg-slate-50 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-5 sm:p-7 rounded-b-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900">
              Ready to take the next step in your career?
            </h4>
            <p className="text-xs text-slate-600 font-semibold">
              Submit your verified resume to {job.company || 'the hiring team'} in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => onApplyClick && onApplyClick(job)}
            disabled={isApplied}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
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

          <button
            onClick={() => onSaveClick && onSaveClick(jobId, job.title)}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Saved' : 'Save Job'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
