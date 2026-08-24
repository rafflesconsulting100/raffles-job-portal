import React from "react";
import { X, FileText, CheckCircle2, XCircle, Clock, Building2, MapPin, Calendar, HelpCircle } from "lucide-react";

export default function ApplicationDetailModal({
  application,
  onClose
}) {
  if (!application) return null;

  const job = application.job || {};
  const isAccepted = application.status === "accepted";
  const isRejected = application.status === "rejected";

  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
            {job.company ? job.company.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {job.title || "Job Application Details"}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Building2 size={14} /> {job.company || "Company"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {job.location || "Remote"}
              </span>
            </div>
          </div>
        </div>

        {/* STATUS BANNER */}
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
            isAccepted
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : isRejected
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isAccepted && <CheckCircle2 size={20} className="text-emerald-600" />}
            {isRejected && <XCircle size={20} className="text-rose-600" />}
            {!isAccepted && !isRejected && <Clock size={20} className="text-amber-600" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Application Status</p>
              <p className="text-sm font-extrabold capitalize">{application.status || "Pending Review"}</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500">
            <Calendar size={13} className="inline mr-1" /> {appliedDate}
          </span>
        </div>

        {/* RESUME SUBMITTED */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Submitted Resume File
          </h4>
          {application.resume ? (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={20} />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {application.resumeOriginalName || "Applied_Resume.pdf"}
                </span>
              </div>
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Download / View
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No custom resume attached.</p>
          )}
        </div>

        {/* SCREENING QUESTIONS & ANSWERS */}
        {Array.isArray(application.screeningAnswers) && application.screeningAnswers.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={15} className="text-indigo-600" /> Screening Questions & Answers
            </h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {application.screeningAnswers.map((qa, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <p className="font-bold text-slate-800 mb-1">Q: {qa.question}</p>
                  <p className="text-slate-600 italic">A: {qa.answer || "No response provided"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER ACTION */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
