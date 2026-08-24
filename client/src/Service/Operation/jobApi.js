import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { GET_ALL_JOBS_API, APPLY_JOB_API } = endpoints;

export const fetchAllJobs = async (params = {}) => {
  try {
    const response = await apiConnector("GET", GET_ALL_JOBS_API, null, null, params);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch jobs from backend:", error);
    return { success: false, jobs: [] };
  }
};

export const applyToJobBackend = async (jobId, formData, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector("POST", APPLY_JOB_API(jobId), formData, headers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit job application");
  }
};

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

  const logoGradients = [
    "from-blue-600 to-indigo-700 text-white",
    "from-purple-600 to-indigo-600 text-white",
    "from-emerald-500 to-teal-700 text-white",
    "from-rose-500 to-red-600 text-white",
    "from-cyan-500 to-blue-600 text-white",
  ];
  const logoBg = logoGradients[(job.title ? job.title.length : 0) % logoGradients.length];

  const formattedSkills = (Array.isArray(job.skills) && job.skills.length > 0)
    ? job.skills
    : (Array.isArray(job.requirements) && job.requirements.length > 0)
    ? job.requirements.slice(0, 5)
    : ["Full Time", "Hiring Now"];

  const formattedExperience = job.experienceYears || job.experienceLevel || "1 - 3 Yrs";

  return {
    id: job._id || job.id,
    _id: job._id || job.id,
    title: job.title,
    company: job.company || (job.creator?.username ? job.creator.username : "Verified Hiring Partner"),
    companyLogo: job.companyLogo || "",
    aboutCompany: job.aboutCompany || "",
    category: job.category || "Software Engineering",
    minEducation: job.minEducation || "Bachelor's Degree",
    location: job.location || "Remote",
    workMode: workMode,
    type: job.jobType || "Full-time",
    jobType: job.jobType || "Full-Time",
    experienceLevel: job.experienceLevel || "Mid Level",
    experienceYears: job.experienceYears || "1 - 3 Years",
    experience: formattedExperience,
    salary: job.salary || "Competitive",
    salaryMin: salaryMin,
    salaryMax: salaryMax,
    skills: formattedSkills,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    description: job.description || "",
    postedAgo: postedAgo,
    postedDate: job.createdAt || new Date().toISOString(),
    logoBg: logoBg,
    badgeColor: "bg-blue-50 text-[#2563EB] border-blue-200",
    isBackend: true,
    screeningQuestions: Array.isArray(job.screeningQuestions) ? job.screeningQuestions : []
  };
};
