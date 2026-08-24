import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  ADMIN_STATS_API,
  ADMIN_EMPLOYERS_API,
  TOGGLE_EMPLOYER_ACCESS_API,
  ADMIN_JOBS_API,
  UPDATE_ADMIN_JOB_STATUS_API,
  DELETE_ADMIN_JOB_API,
  ADMIN_USERS_API,
  UPDATE_USER_ROLE_API,
  DELETE_USER_API,
  SEED_ADMIN_API,
} = endpoints;

export const fetchAdminStats = async (token) => {
  try {
    const response = await apiConnector("GET", ADMIN_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin stats");
  }
};

export const fetchAdminEmployers = async (token) => {
  try {
    const response = await apiConnector("GET", ADMIN_EMPLOYERS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch employers list");
  }
};

export const toggleEmployerAccess = async (employerId, accessPayload, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      TOGGLE_EMPLOYER_ACCESS_API(employerId),
      accessPayload,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update employer access");
  }
};

export const fetchAdminJobs = async (token) => {
  try {
    const response = await apiConnector("GET", ADMIN_JOBS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch job postings");
  }
};

export const updateAdminJobStatus = async (jobId, status, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_ADMIN_JOB_STATUS_API(jobId),
      { status },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update job status");
  }
};

export const deleteAdminJob = async (jobId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_ADMIN_JOB_API(jobId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete job");
  }
};

export const fetchAdminUsers = async (token) => {
  try {
    const response = await apiConnector("GET", ADMIN_USERS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUserRole = async (userId, role, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_ROLE_API(userId),
      { role },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user role");
  }
};

export const deleteUserByAdmin = async (userId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_USER_API(userId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const seedAdminAccount = async (token) => {
  try {
    const response = await apiConnector("POST", SEED_ADMIN_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to enable admin access");
  }
};
