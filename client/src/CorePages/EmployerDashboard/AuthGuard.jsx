import React, { useState } from "react";
import { Lock, ChevronRight, ShieldAlert, Clock, Mail, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AuthGuard({ navigate, isPending, isRestricted, onRefreshStatus }) {
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    if (onRefreshStatus) {
      setChecking(true);
      try {
        await onRefreshStatus();
      } finally {
        setChecking(false);
      }
    } else {
      window.location.reload();
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Verification in Progress
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Admin Approval Pending
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Thank you for registering your organization! Your employer account has been submitted and is currently <strong>awaiting approval from the Raffles Administrator</strong>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">What happens next?</p>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>Admin reviews your organization credentials.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>Upon approval, access to post jobs and search the student database will be unlocked automatically.</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={checking}
              onClick={handleCheckStatus}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Checking Status..." : "Check Approval Status"}
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Raffles Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Employer Access Restricted</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your employer portal privileges have been <strong>suspended by Administrator</strong>. Please reach out to system support for assistance.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Support Team
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
            >
              Return to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#2B2A8C] mx-auto mb-6 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Employer Access Only</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          You must be logged in as a registered <strong>Employer</strong> account to access the recruiter dashboard and job management features.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            Sign In as Employer <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
          >
            Register Employer Account
          </button>
        </div>
      </div>
    </div>
  );
}

