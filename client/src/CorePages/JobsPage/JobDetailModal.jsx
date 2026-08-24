import React from 'react';
import {
  Bookmark,
  X,
  Building2,
  IndianRupee,
  MapPin,
  Briefcase,
  CheckCircle2,
  Gift,
  HelpCircle,
  Check,
  Send,
  GraduationCap,
  Building
} from 'lucide-react';

export default function JobDetailModal({
  job,
  onClose,
  isSaved,
  isApplied,
  onSaveClick,
  onApplyClick
}) {
  if (!job) return null;
  const jobId = job._id || job.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 transform transition-all max-h-[90vh] overflow-y-auto space-y-6">

        {/* Top Controls: Bookmark & Close */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B2A8C] bg-blue-50 px-3 py-1 rounded-lg">
            Job Overview & Details
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveClick(jobId, job.title)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
              title="Bookmark Job"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header: Title & Company info */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl overflow-hidden ${job.logoBg || 'bg-linear-to-br from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold text-2xl shadow-inner shrink-0 border border-slate-100`}>
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
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e293b]">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
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

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs font-semibold">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Salary</span>
            <p className="font-bold text-[#1e293b] flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
              {/* {job.salary} */}
               {job.salary ? job.salary.split(' ')[0] : 'Competitive'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
            <p className="font-bold text-[#1e293b] flex items-center gap-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              {job.location}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Work Mode</span>
            <p className="font-bold text-[#1e293b]">{job.workMode}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Experience</span>
            <p className="font-bold text-[#1e293b] flex items-center gap-0.5">
              <Briefcase className="w-3.5 h-3.5 text-gray-500" />
              {job.experience}
            </p>
          </div>
          {job.minEducation && (
            <div className="space-y-1 sm:col-span-4 col-span-2 border-t border-gray-200/60 pt-2 font-semibold">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Min Education Required</span>
              <p className="font-bold text-[#1e293b] flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#2B2A8C]" />
                {job.minEducation}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">About the Role</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
            {job.description}
          </p>
        </div>


        {/* Key Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Key Requirements</h3>
            <div className="space-y-2">
              {job.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
         
            {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-blue-50 text-[#2B2A8C] rounded-lg text-xs font-bold border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              {/* <Gift className="w-4 h-4 text-[#2B2A8C]" /> */}
              Benefits & Perks
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

           {/* About Company Section */}
        {job.aboutCompany && (
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              {/* <Building className="w-4 h-4 text-[#2B2A8C]" /> */}
              About {job.company}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {job.aboutCompany}
            </p>
          </div>
        )}

        {/* Screening Questions Preview */}
        {job.screeningQuestions && job.screeningQuestions.length > 0 && (
          <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#2B2A8C]" />
              Application Questions ({job.screeningQuestions.length})
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {job.screeningQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        )}

     

        {/* END OF JOB CARD DETAILS - APPLY BUTTON ACTION */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1e293b]">Ready to apply?</h4>
              <p className="text-xs text-gray-500">Submit your resume directly to {job.company}.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => onApplyClick(job)}
              disabled={isApplied}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
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

      </div>
    </div>
  );
}
