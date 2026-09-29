// Single source of truth for an employer's approval state.
//
// The User model keeps `approvalStatus`, `status`, `isApproved` and
// `employerAccess` in sync, but different dashboards re-implemented the
// comparison and disagreed: the admin overview table labelled a *pending*
// employer as "Access Revoked" because it only checked the boolean flags.
export function getEmployerState(employer) {
  if (!employer) return "granted";
  const approval = (employer.approvalStatus || "").toLowerCase();
  const status = (employer.status || "").toLowerCase();

  if (approval === "rejected" || status === "rejected") return "rejected";
  if (approval === "revoked" || status === "suspended") return "revoked";
  if (approval === "pending" || status === "pending") return "pending";
  if (employer.employerAccess === false) return "revoked";
  if (employer.isApproved === false) return "pending";
  return "granted";
}

export const EMPLOYER_STATE_META = {
  granted: {
    label: "Access Granted",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending Approval",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  revoked: {
    label: "Access Revoked",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
};
