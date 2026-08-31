import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  UserPlus
} from "lucide-react";

export default function OverviewTab({ stats, recentUsers, handleTabSwitch, onGrantAccessClick }) {
  const statCards = [
    {
      title: "Total Employers",
      value: stats.totalEmployers || 0,
      subtext: `${stats.grantedEmployers || 0} Granted • ${stats.pendingEmployers || 0} Pending`,
      icon: Building2,
      color: "from-blue-600 to-indigo-700",
      iconBg: "bg-blue-500/10 text-blue-600",
      tab: "employers",
    },
    {
      title: "Pending Approval",
      value: stats.pendingEmployers || 0,
      subtext: "Recruiters awaiting admin authorization",
      icon: Clock,
      color: "from-amber-600 to-yellow-600",
      iconBg: "bg-amber-500/10 text-amber-600",
      tab: "employers",
    },
    {
      title: "Granted Employers",
      value: stats.grantedEmployers || 0,
      subtext: "Active employers with portal access",
      icon: CheckCircle2,
      color: "from-emerald-600 to-teal-700",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      tab: "employers",
    },
    {
      title: "Access Revoked / Suspended",
      value: stats.suspendedEmployers || 0,
      subtext: "Employers with restricted portal access",
      icon: XCircle,
      color: "from-rose-600 to-red-700",
      iconBg: "bg-rose-500/10 text-rose-600",
      tab: "employers",
    },
    {
      title: "Total Job Seekers",
      value: stats.totalJobSeekers || 0,
      subtext: "Registered candidate profiles",
      icon: Users,
      color: "from-violet-600 to-purple-700",
      iconBg: "bg-violet-500/10 text-violet-600",
      tab: "users",
    },
    {
      title: "Total Jobs Posted",
      value: stats.totalJobs || 0,
      subtext: `${stats.activeJobs || 0} Active • ${stats.closedJobs || 0} Closed`,
      icon: Briefcase,
      color: "from-sky-600 to-blue-700",
      iconBg: "bg-sky-500/10 text-sky-600",
      tab: "jobs",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications || 0,
      subtext: "Candidate applications submitted",
      icon: FileCheck,
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-600",
      tab: "jobs",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* QUICK BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
            <ShieldCheck size={14} /> Admin Access & Portal Management Control
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Employer Access Control Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Manage recruiter portal access, approve or restrict employer privileges, oversee job listings, and monitor platform-wide analytics in real time.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleTabSwitch("employers")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Manage Employer Access <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleTabSwitch("jobs")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition text-sm flex items-center gap-2 cursor-pointer"
            >
              Review Posted Jobs <Briefcase size={16} />
            </button>
          </div>
        </div>

        {/* Decorative ambient background glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 -mb-16 w-60 h-60 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />
      </div>

      {/* KPI METRICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Platform Overview & Access Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => handleTabSwitch(card.tab)}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {card.title}
                  </span>
                  <div className={`p-3 rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 mb-1">
                  {card.value}
                </div>

                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  {card.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT REGISTRATIONS & QUICK MANAGEMENT */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" /> Recent User Registrations
            </h3>
            <p className="text-xs text-slate-500">
              Latest users registered across employer and job seeker accounts
            </p>
          </div>
          <button
            onClick={() => handleTabSwitch("users")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            View All Users ({stats.totalUsers || 0}) <ArrowRight size={14} />
          </button>
        </div>

        {recentUsers && recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Portal Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((u) => {
                  const isEmp = u.role === "Employer";
                  const isGranted = u.employerAccess !== false && u.isApproved !== false && u.status !== "Suspended";

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-tr from-slate-700 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {u.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.username}</p>
                          <p className="text-xs text-slate-500 font-normal">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.role === "Admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : u.role === "Employer"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isEmp ? (
                          isGranted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={12} /> Access Granted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              <XCircle size={12} /> Access Revoked
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-500">
                            Active Candidate
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isEmp ? (
                          <button
                            onClick={() => handleTabSwitch("employers")}
                            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer"
                          >
                            Manage Access
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTabSwitch("users")}
                            className="text-xs font-semibold text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                          >
                            User Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">
            No recent registrations found.
          </div>
        )}
      </div>
    </div>
  );
}
