import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  EMPLOYER_STATS_API,
  GET_EMPLOYER_JOBS_API,
  CREATE_JOB_API,
  UPDATE_JOB_API,
  DELETE_JOB_API,
  GET_JOB_APPLICANTS_API,
  UPDATE_APPLICATION_STATUS_API,
} = endpoints;

const getAuthHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : null;
};

// Fetch Dashboard Metrics Stats
export const fetchEmployerStats = async (token) => {
  try {
    const response = await apiConnector("GET", EMPLOYER_STATS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch employer stats");
  }
};

// Fetch all jobs created by employer
export const fetchEmployerJobs = async (token) => {
  try {
    const response = await apiConnector("GET", GET_EMPLOYER_JOBS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch employer jobs");
  }
};

// Create a new job posting
export const createEmployerJob = async (jobData, token) => {
  try {
    const response = await apiConnector("POST", CREATE_JOB_API, jobData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to post new job");
  }
};

// Update an existing job posting
export const updateEmployerJob = async (jobId, jobData, token) => {
  try {
    const response = await apiConnector("PUT", UPDATE_JOB_API(jobId), jobData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update job posting");
  }
};

// Delete a job posting
export const deleteEmployerJob = async (jobId, token) => {
  try {
    const response = await apiConnector("DELETE", DELETE_JOB_API(jobId), null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete job posting");
  }
};

// Get applicants for a specific job posting
export const fetchJobApplicants = async (jobId, token) => {
  try {
    const response = await apiConnector("GET", GET_JOB_APPLICANTS_API(jobId), null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch job applicants");
  }
};

// Update status of an application ('accepted' or 'rejected')
export const updateCandidateStatus = async (applicationId, status, token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      UPDATE_APPLICATION_STATUS_API(applicationId),
      { status },
      getAuthHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update application status");
  }
};
