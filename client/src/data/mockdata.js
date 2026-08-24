export const mockJobs = [
  {
    id: "job-1",
    title: "Senior Full Stack Developer",
    company: "Google",
    logoBg: "bg-blue-600",
    location: "Bangalore, India",
    experience: "5-8 Yrs",
    experienceLevel: "Senior Level",
    salary: "18,00,000 - 24,00,000",
    salaryMin: 1800000,
    salaryMax: 2400000,
    jobType: "Full-Time",
    workMode: "Hybrid",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "AWS"],
    description: "Looking for an experienced Full Stack Developer to lead the design and development of our new cloud application features.",
    category: "Software Engineering",
    minEducation: "Bachelor's Degree",
    aboutCompany: "Google's mission is to organize the world's information and make it universally accessible and useful. We build products that help people, create opportunities, and empower communities."
  },
];

export const filterOptions = {
  categories: ["All", "Software Engineering", "Data Science", "Design", "Marketing", "Finance", "HR", "Management"],
  experienceLevels: ["All", "Entry Level", "Mid Level", "Senior Level"],
  workModes: ["All", "Hybrid", "On-site"],
  jobTypes: ["All", "Full-Time", "Part-Time", "Contract",],
  datePosted: [
    { label: "Any Time", value: "all" },
    { label: "Last 24 Hours", value: "1" },
    { label: "Last 3 Days", value: "3" },
    { label: "Last 7 Days", value: "7" }
  ]
};
