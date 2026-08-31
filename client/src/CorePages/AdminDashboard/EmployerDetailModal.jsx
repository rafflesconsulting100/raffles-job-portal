import React from "react";
import {
  X,
  Building2,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function EmployerDetailModal({
  employer,
  onClose,
  onToggleAccess,
}) {
  if (!employer) return null;

  const isPending =
    employer.status === "Pending" ||
    (employer.isApproved === false && employer.status !== "Suspended");

  const isGranted =
    employer.employerAccess !== false &&
    employer.isApproved !== false &&
    employer.status === "Active";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* MODAL HEADER */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 font-black text-xl flex items-center justify-center text-white shadow-md">
              {employer.username?.charAt(0).toUpperCase() || "E"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {employer.username}
              </h3>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                <Mail size={12} /> {employer.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY DETAILS */}
        <div className="p-6 space-y-6">
          {/* ACCESS STATUS BANNER */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isPending
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : isGranted
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPending ? (
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
              ) : isGranted ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isPending
                    ? "Portal Access: PENDING APPROVAL"
                    : isGranted
                    ? "Portal Access: GRANTED"
                    : "Portal Access: REVOKED"}
                </p>
                <p className="text-xs text-slate-600">
                  {isPending
                    ? "Employer is waiting for administrator approval before accessing the dashboard."
                    : isGranted
                    ? "Employer has active permission to post and manage jobs."
                    : "Employer access to recruiter tools is suspended."}
                </p>
              </div>
            </div>

            <button
              onClick={() => onToggleAccess(employer._id, !isGranted)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                isGranted
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : isPending
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              }`}
            >
              {isGranted ? (
                <>
                  <XCircle size={14} /> Revoke
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Approve & Grant
                </>
              )}
            </button>
          </div>

          {/* INFORMATION GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Jobs Posted
              </span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                {employer.jobCount || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Candidates
              </span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                {employer.applicantCount || 0}
              </div>
            </div>
          </div>

          {/* METADATA LIST */}
          <div className="space-y-3 pt-2 text-sm text-slate-700">
            {employer.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>Location: <strong>{employer.location}</strong></span>
              </div>
            )}
            {employer.contactNumber && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>Contact: <strong>{employer.contactNumber}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span>Registered on: <strong>{new Date(employer.createdAt).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
