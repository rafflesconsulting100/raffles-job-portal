import React from "react";
import { AlertCircle } from "lucide-react";

export default function DeleteJobModal({ deletingJobId, setDeletingJobId, handleDeleteJob }) {
  if (!deletingJobId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Job Posting?</h3>
        <p className="text-slate-500 text-xs mb-6">
          Are you sure you want to delete this job posting? This action is permanent and cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setDeletingJobId(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteJob(deletingJobId)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
