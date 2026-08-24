import React from "react";
import { Building2, PlusCircle, RefreshCw } from "lucide-react";

export default function HeaderBar({ user, jobsLoading, resetForm, handleTabSwitch, loadDashboardData, token }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-[#2B2A8C] border border-blue-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Employer Hub
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {user?.username || "Recruiter Portal"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Recruitment Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage job postings, review candidate applications, and streamline your hiring pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              resetForm();
              handleTabSwitch("post-job");
            }}
            className="px-5 py-3 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold text-sm shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Post a New Job
          </button>
          <button
            onClick={() => loadDashboardData(token)}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${jobsLoading ? "animate-spin text-[#2B2A8C]" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
