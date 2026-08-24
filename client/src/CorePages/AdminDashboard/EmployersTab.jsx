import React, { useState } from "react";
import {
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Users,
  Eye,
  Trash2,
  RefreshCw,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function EmployersTab({
  employers,
  employersLoading,
  onToggleAccess,
  onDeleteUser,
  onViewEmployerModal,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const filteredEmployers = employers.filter((emp) => {
    const isGranted = emp.employerAccess !== false && emp.isApproved !== false && emp.status !== "Suspended";
    const matchesSearch =
      emp.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "granted") return matchesSearch && isGranted;
    if (statusFilter === "revoked") return matchesSearch && !isGranted;
    return matchesSearch;
  });

  const handleAccessToggle = async (empId, currentGranted) => {
    setTogglingId(empId);
    try {
      await onToggleAccess(empId, !currentGranted);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="text-blue-600" size={24} /> Employer Portal Access Directory
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Grant or restrict access privileges for employers to use the recruiter portal and post jobs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={16} className={employersLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Employers ({employers.length})
          </button>
          <button
            onClick={() => setStatusFilter("granted")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              statusFilter === "granted"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 size={14} /> Access Granted (
            {employers.filter((e) => e.employerAccess !== false && e.isApproved !== false && e.status !== "Suspended").length}
            )
          </button>
          <button
            onClick={() => setStatusFilter("revoked")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              statusFilter === "revoked"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-rose-700 hover:bg-rose-50"
            }`}
          >
            <XCircle size={14} /> Access Revoked (
            {employers.filter((e) => e.employerAccess === false || e.isApproved === false || e.status === "Suspended").length}
            )
          </button>
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {employersLoading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-blue-600" />
            <p className="font-semibold text-sm">Loading employer access records...</p>
          </div>
        ) : filteredEmployers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Employer / Organization</th>
                  <th className="py-4 px-6">Portal Access State</th>
                  <th className="py-4 px-6">Jobs Posted</th>
                  <th className="py-4 px-6">Applications Received</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployers.map((emp) => {
                  const isGranted =
                    emp.employerAccess !== false &&
                    emp.isApproved !== false &&
                    emp.status !== "Suspended";
                  const isBusy = togglingId === emp._id;

                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Employer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                            {emp.username?.charAt(0).toUpperCase() || "E"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{emp.username}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail size={12} /> {emp.email}
                            </p>
                            {emp.location && (
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {emp.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Access Status Badge */}
                      <td className="py-4 px-6">
                        {isGranted ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>ACCESS GRANTED</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                            <ShieldAlert size={14} className="text-rose-600" />
                            <span>ACCESS REVOKED</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isGranted
                            ? "Can post & manage jobs"
                            : "Portal features restricted"}
                        </p>
                      </td>

                      {/* Jobs Stats */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-blue-500" />
                          <span className="font-bold text-slate-900">{emp.jobCount || 0}</span>
                          <span className="text-xs text-slate-400">
                            ({emp.activeJobCount || 0} active)
                          </span>
                        </div>
                      </td>

                      {/* Applications Received */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-indigo-500" />
                          <span className="font-bold text-slate-900">{emp.applicantCount || 0}</span>
                          <span className="text-xs text-slate-400">candidates</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {new Date(emp.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action Controls */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Access Button */}
                          <button
                            disabled={isBusy}
                            onClick={() => handleAccessToggle(emp._id, isGranted)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              isGranted
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                            }`}
                          >
                            {isBusy ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : isGranted ? (
                              <>
                                <XCircle size={14} /> Revoke Access
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} /> Grant Access
                              </>
                            )}
                          </button>

                          {/* View Modal */}
                          <button
                            onClick={() => onViewEmployerModal(emp)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Delete Employer */}
                          <button
                            onClick={() => onDeleteUser(emp._id, emp.username)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                            title="Delete Employer Account"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <Building2 size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-800 text-base">No employers found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try refining your search terms or filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
