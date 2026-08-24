import React from "react";

export default function CandidateModal({ viewingApplicantModal, setViewingApplicantModal }) {
  if (!viewingApplicantModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={() => setViewingApplicantModal(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-lg bg-slate-100 cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Candidate Screening Responses
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Submitted by <strong>{viewingApplicantModal.applicant?.username}</strong>
        </p>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {viewingApplicantModal.screeningAnswers?.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-[#2B2A8C] mb-1">
                Q{idx + 1}: {item.question}
              </div>
              <div className="text-xs text-slate-800 font-medium leading-relaxed">
                Ans: {item.answer || "No response provided."}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setViewingApplicantModal(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
