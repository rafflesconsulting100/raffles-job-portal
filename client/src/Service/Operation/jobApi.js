import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { GET_ALL_JOBS_API, APPLY_JOB_API, GET_JOB_BY_SLUG_API } = endpoints;

export const fetchAllJobs = async (params = {}) => {
  try {
    const response = await apiConnector("GET", GET_ALL_JOBS_API, null, null, params);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch jobs from backend:", error);
    // `error: true` lets callers distinguish "fetch failed" from
    // "fetched successfully but the list is empty".
    return { success: false, jobs: [], error: true };
  }
};

// Public job page data: GET /api/jobs/slug/:slug (used by /jobs/<slug>)
export const fetchJobBySlug = async (slug) => {
  if (!slug) return { success: false, job: null };
  try {
    const response = await apiConnector("GET", GET_JOB_BY_SLUG_API(slug), null, null);
    return response.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error("Failed to fetch job by slug:", error);
    }
    return { success: false, job: null };
  }
};

export const applyToJobBackend = async (jobId, formData, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector("POST", APPLY_JOB_API(jobId), formData, headers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit job application", { cause: error });
  }
};

export { formatBackendJob } from "../../Utils/jobFormat";
