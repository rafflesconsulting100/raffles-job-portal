import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  GET_MY_APPLICATIONS_API,
  WITHDRAW_APPLICATION_API,
  GET_SAVED_JOBS_API,
  TOGGLE_SAVE_JOB_API,
  GET_PROFILE_API,
  UPDATE_PROFILE_API,
  GET_NOTIFICATIONS_API,
  MARK_READ_NOTIFICATION_API,
  MARK_ALL_READ_NOTIFICATIONS_API,
} = endpoints;

const getAuthHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : null;
};

// Fetch candidate's submitted job applications
export const fetchCandidateApplications = async (token) => {
  try {
    const response = await apiConnector("GET", GET_MY_APPLICATIONS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch candidate applications");
  }
};

// Withdraw a job application
export const withdrawCandidateApplication = async (applicationId, token) => {
  try {
    const response = await apiConnector("DELETE", WITHDRAW_APPLICATION_API(applicationId), null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to withdraw job application");
  }
};

// Fetch saved jobs for seeker
export const fetchSavedJobs = async (token) => {
  try {
    const response = await apiConnector("GET", GET_SAVED_JOBS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch saved jobs");
  }
};

// Toggle save / unsave job
export const toggleSaveJobBackend = async (jobId, token) => {
  try {
    const response = await apiConnector("POST", TOGGLE_SAVE_JOB_API(jobId), null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to toggle saved status for job");
  }
};

// Fetch user profile
export const fetchUserProfile = async (token) => {
  try {
    const response = await apiConnector("GET", GET_PROFILE_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user profile");
  }
};

// Update user profile (supports text & multipart form-data for resume/avatar)
export const updateUserProfile = async (formData, token) => {
  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile details");
  }
};

// Fetch notifications
export const fetchNotifications = async (token) => {
  try {
    const response = await apiConnector("GET", GET_NOTIFICATIONS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch notifications");
  }
};

// Mark single notification as read
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await apiConnector("PATCH", MARK_READ_NOTIFICATION_API(notificationId), null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark notification as read");
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (token) => {
  try {
    const response = await apiConnector("PATCH", MARK_ALL_READ_NOTIFICATIONS_API, null, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
  }
};
