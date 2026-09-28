import { CATEGORY_FILTER_OPTIONS } from '../Utils/seoConfig';

export const mockJobs = [
];

export const filterOptions = {
  // Kept in sync with the categories offered in the job posting form and with
  // the real categories stored on Job documents (SEO: /jobs/<category> pages).
  categories: CATEGORY_FILTER_OPTIONS,

  experienceLevels: [
    "All",
    "Entry Level",
    "Mid Level",
    "Senior Level"
  ],

  workModes: [
    "All",
    "Hybrid",
    "On-site",
  ],

  jobTypes: [
    "All",
    "Full-Time",
    "Part-Time",
    "Contract",
  ],

  datePosted: [
    { label: "Any Time", value: "all" },
    { label: "Last 24 Hours", value: "1" },
    { label: "Last 3 Days", value: "3" },
    { label: "Last 7 Days", value: "7" }
  ]
};
