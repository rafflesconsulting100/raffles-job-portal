// Shared filter constants for the Jobs listing page.
//
// The salary slider used to top out at ₹35L and start *at* that maximum, so
// every job paying more than 35 LPA was silently filtered out of the default
// result set. The cap is now an explicit "no limit" sentinel: when the slider
// sits at SALARY_FILTER_MAX the salary predicate is skipped entirely.
export const SALARY_FILTER_MAX = 6000000; // ₹60 LPA = "Any salary"
export const SALARY_FILTER_MIN = 100000; // ₹1 LPA slider floor — entry-level BPO roles often pay less

export function isSalaryFilterActive(maxSalary) {
  return Number.isFinite(maxSalary) && maxSalary < SALARY_FILTER_MAX;
}

export function salaryFilterLabel(maxSalary) {
  if (!isSalaryFilterActive(maxSalary)) return 'Any salary';
  return `₹${(maxSalary / 100000).toFixed(1)}L PA`;
}
