import React from "react";
import { Lock, ChevronRight, ShieldAlert, Mail } from "lucide-react";

export default function AuthGuard({ navigate, isRestricted }) {
  if (isRestricted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Employer Access Restricted</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your access to the recruiter portal has been <strong>suspended or is pending Administrator approval</strong>. Please contact system support or await approval from an Admin.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Admin Support
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#2B2A8C] mx-auto mb-6">
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
