import React from "react";
import { Lock, ArrowRight, UserCheck } from "lucide-react";

export default function AuthGuard({ navigate }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Job Seeker Portal</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Please log in as a <strong>Job Seeker</strong> to view your applications, saved jobs, notifications, and profile details.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to Login <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <UserCheck size={18} /> Register as Job Seeker
          </button>
        </div>
      </div>
    </div>
  );
}
