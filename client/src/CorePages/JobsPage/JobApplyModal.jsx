import React from 'react';
import { X, Building, FileText, Upload, Loader2, Send, Users, Languages } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 transform transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2A8C] bg-blue-50 px-2.5 py-1 rounded-md">
            Job Application
          </span>
          <h3 className="text-xl font-extrabold text-[#1e293b]">
            {job.title}
          </h3>
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            {job.company} • {job.location}
          </p>

          {(job.numberOfOpenings != null || (job.preferredLanguages && job.preferredLanguages.length > 0)) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {job.numberOfOpenings != null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                  <Users className="w-3.5 h-3.5 text-[#2B2A8C]" />
                  {job.numberOfOpenings} Openings
                </span>
              )}
              {job.preferredLanguages && job.preferredLanguages.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                  <Languages className="w-3.5 h-3.5 text-[#2B2A8C]" />
                  {job.preferredLanguages.join(' · ')}
                </span>
              )}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Resume Selection Section */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <label className="flex text-xs font-extrabold text-gray-700 uppercase tracking-wider items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#2B2A8C]" />
              Resume / CV Document
            </label>

            {hasProfileResume ? (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="radio"
                    name="resumeChoice"
                    checked={useProfileResume}
                    onChange={() => setUseProfileResume(true)}
                    className="text-[#2B2A8C] focus:ring-[#2B2A8C] cursor-pointer"
                  />
                  <span>Use saved profile resume ({userProfile?.resumeOriginalName || user?.resumeOriginalName || 'Uploaded Resume'})</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="radio"
                    name="resumeChoice"
                    checked={!useProfileResume}
                    onChange={() => setUseProfileResume(false)}
                    className="text-[#2B2A8C] focus:ring-[#2B2A8C] cursor-pointer"
                  />
                  <span>Upload a new resume for this application</span>
                </label>
              </div>
            ) : (
              <p className="text-xs text-amber-700 font-medium">
                No resume found on profile. Please upload your resume file below:
              </p>
            )}

            {(!useProfileResume || !hasProfileResume) && (
              <div className="pt-2">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-pointer hover:border-[#2B2A8C] transition">
                  <Upload className="w-6 h-6 text-[#2B2A8C] mb-1" />
                  <span className="text-xs font-bold text-gray-600">
                    {customResumeFile ? customResumeFile.name : 'Click to select PDF or DOCX file'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Max size: 5MB</span>
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

          {/* Screening Questions Section */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Employer Screening Questions
              </label>
              {job.screeningQuestions.map((question, idx) => (
                <div key={idx} className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-700">
                    {idx + 1}. {question}
                  </p>
                  <input
                    type="text"
                    placeholder="Your answer..."
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={screeningAnswers[idx] || ''}
                    onChange={(e) =>
                      setScreeningAnswers({ ...screeningAnswers, [idx]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Optional Cover Letter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Cover Letter / Additional Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Introduce yourself or highlight key experience..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition resize-none"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingApp}
              className="flex-1 py-3 bg-[#2B2A8C] hover:bg-[#1E1D66] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submittingApp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
