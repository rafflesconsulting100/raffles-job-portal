import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function WithdrawModal({
  withdrawingAppId,
  onClose,
  onConfirmWithdraw,
  submitting = false
}) {
  if (!withdrawingAppId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          Withdraw Application?
        </h3>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to withdraw this job application? This action cannot be undone and your application will be removed from the employer's pipeline.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmWithdraw(withdrawingAppId)}
            disabled={submitting}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/25 cursor-pointer"
          >
            {submitting ? "Withdrawing..." : "Yes, Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
