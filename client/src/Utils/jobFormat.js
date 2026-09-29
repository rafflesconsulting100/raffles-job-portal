
const LOGO_GRADIENTS = [
  "from-blue-600 to-indigo-700 text-white",
  "from-purple-600 to-indigo-600 text-white",
  "from-emerald-500 to-teal-700 text-white",
  "from-rose-500 to-red-600 text-white",
  "from-cyan-500 to-blue-600 text-white",
];

const VENDOR_PATTERNS = [
  /special\s+vendor\s+payout/i,
  /vendor\s+payout/i,
  /vendors\s+please\s+prioritize/i,
  /share\s+maximum\s+(quality\s+)?lineups/i,
  /maximum\s+lineups/i,
  /special\s+payout\s+(for\s+)?successful\s+joining/i,
  /\bspoc\b\s*[:-]/i,
  /commercials\s*[:-]/i,
  /billing\s+payout/i,
];

export function cleanJobDescription(text) {
  if (!text) return '';
  const lines = String(text).split('\n');
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return !VENDOR_PATTERNS.some((pattern) => pattern.test(trimmed));
  });
  return filtered.join('\n').trim();
}

// Salary text arrives as free-form strings: "₹1.2 LPA - ₹2 LPA",
// "₹5,00,000 - ₹8,00,000 per annum", "₹40,000 / month". Numbers alone are
// meaningless without the unit, so this normalises everything to INR per year.
// Shared page <title> for a job — used by JobDetailPage (client) and by the
// prerender plugin (build) so the head never changes on hydration.
export function buildJobTitle(job) {
  if (!job) return 'Job Details | RafflesJobs';
  const locs = Array.isArray(job.locations) && job.locations.length > 0
    ? job.locations
    : (job.location ? job.location.split(/[|,]/).map((s) => s.trim()).filter(Boolean) : []);
  const companyPart = job.company ? ` | ${job.company}` : '';
  if (locs.length >= 3) {
    return `${job.title} Jobs${companyPart} | RafflesJobs`;
  }
  const locStr = locs.length > 0 ? ` in ${locs.join(', ')}` : '';
  return `${job.title} Job${locStr}${companyPart} | RafflesJobs`;
}

// Shared meta description for a job (see buildJobTitle).
export function buildJobDescription(job) {
  if (!job) return undefined;
  const companyPart = job.company ? ` at ${job.company}` : '';
  const locs = Array.isArray(job.locations) && job.locations.length > 0
    ? (job.locations.length >= 3 ? ` across multiple locations (${job.locations.slice(0, 3).join(', ')} & more)` : ` in ${job.locations.join(', ')}`)
    : (job.location ? ` in ${job.location}` : '');

  const details = [];
  if (job.salary) details.push('salary');
  if (job.experienceYears || job.experienceLevel) details.push('experience');
  if (job.minEducation) details.push('eligibility');
  if (Array.isArray(job.preferredLanguages) && job.preferredLanguages.length > 0) details.push('languages');
  if (job.shift) details.push('shift');
  if (Array.isArray(job.skills) && job.skills.length > 0) details.push('skills');
  details.push('job responsibilities');

  return `Apply for ${job.title}${companyPart}${locs}. View ${details.join(', ')} and application details on RafflesJobs.`;
}

export function parseSalaryRange(text) {
  // Return null when no numbers are found so callers can distinguish
  // "no salary info" from a real range — a fabricated 10-20 LPA default
  // would corrupt salary filters and sorting.
  const raw = String(text || '').trim();
  if (!raw) return null;

  const numbers = raw.match(/\d[\d,]*(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return null;

  const lower = raw.toLowerCase();
  const toNumber = (value) => parseFloat(value.replace(/,/g, ''));

  let multiplier = 1;
  if (/\bcrore|\bcr\b/.test(lower)) multiplier = 10000000;
  else if (/\blpa\b|\blakh/.test(lower)) multiplier = 100000;
  else if (/\bmonth|\/\s*mo\b|\bpm\b/.test(lower)) multiplier = 12;

  const min = toNumber(numbers[0]) * multiplier;
  const max = numbers.length > 1 ? toNumber(numbers[1]) * multiplier : min;

  if (Number.isNaN(min)) return null;

  return {
    min: max > 0 && min > max ? max : min,
    max: max > 0 && min > max ? min : max,
  };
}

export const formatBackendJob = (job) => {
  const range = parseSalaryRange(job.salary);
  const salaryMin = range ? range.min : 0;
  const salaryMax = range ? range.max : 0;

  const createdDate = new Date(job.createdAt || Date.now());
  const diffDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const postedAgo = diffDays === 0 ? "Just now" : `${diffDays}d ago`;

  const workMode = job.jobType === "Remote" ? "Remote" : "On-site";

  const logoBg = LOGO_GRADIENTS[(job.title ? job.title.length : 0) % LOGO_GRADIENTS.length];

  const formattedSkills = (Array.isArray(job.skills) && job.skills.length > 0)
    ? job.skills
    : (Array.isArray(job.requirements) && job.requirements.length > 0)
      ? job.requirements.slice(0, 5)
      : ["Full Time", "Hiring Now"];

  const formattedExperience = job.experienceYears || job.experienceLevel || "1 - 3 Yrs";

  const locations = Array.isArray(job.locations) && job.locations.length > 0
    ? job.locations
    : (job.location ? job.location.split(/[|,]/).map((s) => s.trim()).filter(Boolean) : []);
  const primaryLocation = locations[0] || job.location || "Remote";

  const isExpired = Boolean(
    job.status === "closed" ||
    (job.expiresAt && !isNaN(new Date(job.expiresAt).getTime()) && new Date(job.expiresAt) < new Date())
  );

  return {
    id: job._id || job.id,
    _id: job._id || job.id,
    slug: job.slug || "",
    path: job.slug ? `/jobs/${job.slug}` : "",
    title: job.title,
    company: job.company || (job.creator?.username ? job.creator.username : "Verified Hiring Partner"),
    companyLogo: job.companyLogo || "",
    aboutCompany: job.aboutCompany || "",
    category: job.category || "",
    minEducation: job.minEducation || "Bachelor's Degree",
    location: job.location || "Remote",
    locations: locations,
    primaryLocation: primaryLocation,
    workMode: workMode,
    type: job.jobType || "Full-time",
    jobType: job.jobType || "Full-time",
    experienceLevel: job.experienceLevel || "Mid Level",
    experienceYears: job.experienceYears || "1 - 3 Years",
    experience: formattedExperience,
    salary: job.salary || "Competitive",
    salaryMin: salaryMin,
    salaryMax: salaryMax,
    incentives: job.incentives || "",
    allowances: job.allowances || "",
    shift: job.shift || "",
    weekOff: job.weekOff || "",
    employmentRole: job.employmentRole || "On-Roll",
    expiresAt: job.expiresAt || job.applicationDeadline || null,
    isExpired: isExpired,
    status: isExpired ? "closed" : (job.status || "active"),
    skills: formattedSkills,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    description: job.description || "",
    cleanDescription: cleanJobDescription(job.description),
    postedAgo: postedAgo,
    postedDate: job.createdAt || new Date().toISOString(),
    logoBg: logoBg,
    badgeColor: "bg-blue-50 text-[#2563EB] border-blue-200",
    isBackend: true,
    screeningQuestions: Array.isArray(job.screeningQuestions) ? job.screeningQuestions : [],
    numberOfOpenings: job.numberOfOpenings != null ? job.numberOfOpenings : null,
    preferredLanguages: Array.isArray(job.preferredLanguages) ? job.preferredLanguages : []
  };
};
