import { CATEGORY_FILTER_OPTIONS } from '../Utils/seoConfig';

export const mockJobs = [
];

export const filterOptions = {
  // Kept in sync with the categories offered in the job posting form and with
  // the real categories stored on Job documents (SEO: /jobs/<category> pages).
  categories: CATEGORY_FILTER_OPTIONS,

  // Labels must be substrings of the experienceLevel values written by the job
  // posting form ("Mid Level (2-5 Yrs)", "Junior Level (1-3 Yrs)", ...) or the
  // filter silently matches nothing.
  experienceLevels: [
    "All",
    "Entry Level",
    "Junior Level",
    "Mid Level",
    "Senior Level",
    "Lead / Principal",
    "Manager / Director",
    "Executive / VP"
  ],

  // Job documents only ever get "On-site" or "Remote" (see jobFormat.js) —
  // there is no Hybrid jobType, so a Hybrid checkbox could never match.
  workModes: [
    "All",
    "On-site",
    "Remote",
  ],

  // Same strings the server enum accepts (server/models/Job.js).
  jobTypes: [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Internship",
  ],

  datePosted: [
    { label: "Any Time", value: "all" },
    { label: "Last 24 Hours", value: "1" },
    { label: "Last 3 Days", value: "3" },
    { label: "Last 7 Days", value: "7" }
  ]
};
