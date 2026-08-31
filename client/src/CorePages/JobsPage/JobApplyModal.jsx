import React from 'react';
import {
  X,
  Building,
  FileText,
  Upload,
  Loader2,
  Send,
  Users,
  Languages,
  HelpCircle,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function JobApplyModal({
  job,
  onClose,
  userProfile,
  user,
  customResumeFile,
  setCustomResumeFile,
  useProfileResume,
  setUseProfileResume,
  screeningAnswers,
  setScreeningAnswers,
  coverLetter,
  setCoverLetter,
  submittingApp,
  onSubmit
}) {
  if (!job) return null;

  const hasProfileResume = Boolean(userProfile?.resume || user?.resume);
  const profileResumeName = userProfile?.resumeOriginalName || user?.resumeOriginalName || 'Saved Profile Resume.pdf';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 selection:bg-[#2563EB] selection:text-white">
      {/* Modal Container: Fixed max-height with flex column layout to keep header & footer fixed while body scrolls smoothly */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden text-slate-900 transition-all">
        
        {/* 1. FIXED MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0 relative pr-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2B2A8C] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                Job Application
              </span>
              {job.jobType && (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {job.jobType}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
              {job.title}
            </h3>

            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 pt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{job.company}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{job.location}</span>
            </p>

            {(job.numberOfOpenings != null || (job.preferredLanguages && job.preferredLanguages.length > 0)) && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {job.numberOfOpenings != null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50/70 border border-blue-100 text-[#2B2A8C] rounded-lg text-[11px] font-extrabold">
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    {job.numberOfOpenings} Openings
                  </span>
                )}
                {job.preferredLanguages && job.preferredLanguages.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">
                    <Languages className="w-3.5 h-3.5 text-slate-500" />
                    {job.preferredLanguages.join(' · ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. SCROLLABLE MODAL FORM BODY */}
        <form id="job-application-form" onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Resume Selection Section */}
          <div className="space-y-3 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <label className="flex text-xs font-black text-slate-900 uppercase tracking-wider items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              Resume / CV Document
            </label>

            {hasProfileResume ? (
              <div className="space-y-2.5">
                {/* Option A: Profile Resume */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                  useProfileResume
                    ? 'bg-white border-[#2563EB] shadow-xs'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}>
                  <input
                    type="radio"
                    name="resumeChoice"
                    checked={useProfileResume}
                    onChange={() => setUseProfileResume(true)}
                    className="mt-0.5 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Use Saved Profile Resume
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {profileResumeName}
                    </p>
                  </div>
                </label>

                {/* Option B: Upload New Custom Resume */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                  !useProfileResume
                    ? 'bg-white border-[#2563EB] shadow-xs'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}>
                  <input
                    type="radio"
                    name="resumeChoice"
                    checked={!useProfileResume}
                    onChange={() => setUseProfileResume(false)}
                    className="mt-0.5 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900">Upload a tailored resume for this role</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      PDF, DOC, or DOCX (Max size: 5MB)
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-xs text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                No resume found on your profile. Please select and upload your resume below:
              </p>
            )}

            {/* File Dropzone if uploading new file or no profile resume */}
            {(!useProfileResume || !hasProfileResume) && (
              <div className="pt-1">
                <label className="flex flex-col items-center justify-center p-4 sm:p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-white cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/20 transition group">
                  <Upload className="w-6 h-6 text-[#2563EB] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-slate-900 text-center">
                    {customResumeFile ? customResumeFile.name : 'Click to select PDF or DOCX file'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {customResumeFile ? `${(customResumeFile.size / (1024 * 1024)).toFixed(2)} MB • Selected` : 'Maximum file size: 5MB'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCustomResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Employer Screening Questions Section */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <div className="space-y-3.5 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="flex text-xs font-black text-slate-900 uppercase tracking-wider items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                  Screening Questions ({job.screeningQuestions.length})
                </label>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                  * Required
                </span>
              </div>

              <div className="space-y-3">
                {job.screeningQuestions.map((question, idx) => (
                  <div key={idx} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-extrabold text-slate-900 leading-snug">
                      <span className="text-[#2563EB] font-black mr-1">{idx + 1}.</span> {question}
                    </p>
                    <input
                      type="text"
                      placeholder="Type your answer here..."
                      required
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition"
                      value={screeningAnswers[idx] || ''}
                      onChange={(e) =>
                        setScreeningAnswers({ ...screeningAnswers, [idx]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Cover Letter / Candidate Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Cover Letter / Note to Recruiter <span className="text-slate-400 font-semibold lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Introduce yourself or highlight why you are a strong fit for this position..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition resize-none"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

        </form>

        {/* 3. FIXED MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-slate-300 hover:bg-white rounded-xl text-xs font-extrabold text-slate-700 transition cursor-pointer shadow-2xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="job-application-form"
            disabled={submittingApp}
            className="flex-1 py-3.5 px-5 bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] text-white rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submittingApp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
