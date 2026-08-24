import React from "react";
import { LayoutDashboard, Briefcase, PlusCircle, Users } from "lucide-react";

export default function NavigationTabs({ activeTab, handleTabSwitch, jobsCount, totalApplicants, editingJob }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200 no-scrollbar">
      <button
        onClick={() => handleTabSwitch("overview")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition whitespace-nowrap cursor-pointer ${
          activeTab === "overview"
            ? "bg-[#2B2A8C] text-white shadow-md shadow-[#2B2A8C]/20"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
        }`}
      >
        <LayoutDashboard className="w-4 h-4" /> Overview & Analytics
      </button>

      <button
        onClick={() => handleTabSwitch("my-jobs")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition whitespace-nowrap cursor-pointer ${
          activeTab === "my-jobs"
            ? "bg-[#2B2A8C] text-white shadow-md shadow-[#2B2A8C]/20"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
        }`}
      >
        <Briefcase className="w-4 h-4" /> My Job Listings ({jobsCount})
      </button>

      <button
        onClick={() => handleTabSwitch("post-job")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition whitespace-nowrap cursor-pointer ${
          activeTab === "post-job"
            ? "bg-[#2B2A8C] text-white shadow-md shadow-[#2B2A8C]/20"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
        }`}
      >
        <PlusCircle className="w-4 h-4" /> {editingJob ? "Edit Job Posting" : "Post a Job"}
      </button>

      <button
        onClick={() => handleTabSwitch("applicants")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition whitespace-nowrap cursor-pointer ${
          activeTab === "applicants"
            ? "bg-[#2B2A8C] text-white shadow-md shadow-[#2B2A8C]/20"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
        }`}
      >
        <Users className="w-4 h-4" /> Applicant ATS Pipeline ({totalApplicants})
      </button>
    </div>
  );
}
