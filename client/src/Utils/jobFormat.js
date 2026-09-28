
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

export const formatBackendJob = (job) => {
  let salaryMin = 1000000;
  let salaryMax = 2000000;
  if (job.salary) {
    const numbers = job.salary.match(/\d+[\d,.]*/g);
    if (numbers && numbers.length >= 2) {
      const isLakh = job.salary.toLowerCase().includes("lakh");
      salaryMin = parseFloat(numbers[0].replace(/,/g, "")) * (isLakh ? 100000 : 1);
      salaryMax = parseFloat(numbers[1].replace(/,/g, "")) * (isLakh ? 100000 : 1);
    } else if (numbers && numbers.length === 1) {
      const isLakh = job.salary.toLowerCase().includes("lakh");
      salaryMin = parseFloat(numbers[0].replace(/,/g, "")) * (isLakh ? 100000 : 1);
      salaryMax = salaryMin;
    }
  }

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
    jobType: job.jobType || "Full-Time",
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
