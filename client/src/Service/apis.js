//const BASE_URL = "http://localhost:5000/api"; 
 const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  REGISTER_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
  GET_ME_API: BASE_URL + "/auth/me",

  // EMPLOYER & JOB ENDPOINTS
  EMPLOYER_STATS_API: BASE_URL + "/applications/stats",
  GET_EMPLOYER_JOBS_API: BASE_URL + "/jobs/my-jobs",
  GET_ALL_JOBS_API: BASE_URL + "/jobs",
  CREATE_JOB_API: BASE_URL + "/jobs",
  UPDATE_JOB_API: (id) => `${BASE_URL}/jobs/${id}`,
  DELETE_JOB_API: (id) => `${BASE_URL}/jobs/${id}`,
  GET_JOB_APPLICANTS_API: (jobId) => `${BASE_URL}/applications/job/${jobId}`,
  UPDATE_APPLICATION_STATUS_API: (id) => `${BASE_URL}/applications/${id}/status`,
  APPLY_JOB_API: (jobId) => `${BASE_URL}/applications/apply/${jobId}`,
  GET_STUDENT_DATABASE_API: BASE_URL + "/applications/student-database",

  // JOB SEEKER & PROFILE ENDPOINTS
  GET_MY_APPLICATIONS_API: BASE_URL + "/applications/my-applications",
  WITHDRAW_APPLICATION_API: (id) => `${BASE_URL}/applications/${id}`,
  GET_SAVED_JOBS_API: BASE_URL + "/jobs/saved",
  TOGGLE_SAVE_JOB_API: (id) => `${BASE_URL}/jobs/${id}/save`,
  GET_PROFILE_API: BASE_URL + "/auth/profile",
  UPDATE_PROFILE_API: BASE_URL + "/auth/profile",
  GET_NOTIFICATIONS_API: BASE_URL + "/notifications",
  MARK_READ_NOTIFICATION_API: (id) => `${BASE_URL}/notifications/${id}/read`,
  MARK_ALL_READ_NOTIFICATIONS_API: BASE_URL + "/notifications/read-all",

  // ADMIN ENDPOINTS
  ADMIN_LOGIN_API: BASE_URL + "/admin/login",
  ADMIN_STATS_API: BASE_URL + "/admin/stats",
  ADMIN_EMPLOYERS_API: BASE_URL + "/admin/employers",
  TOGGLE_EMPLOYER_ACCESS_API: (id) => `${BASE_URL}/admin/employers/${id}/access`,
  ADMIN_JOBS_API: BASE_URL + "/admin/jobs",
  UPDATE_ADMIN_JOB_STATUS_API: (id) => `${BASE_URL}/admin/jobs/${id}/status`,
  DELETE_ADMIN_JOB_API: (id) => `${BASE_URL}/admin/jobs/${id}`,
  ADMIN_USERS_API: BASE_URL + "/admin/users",
  UPDATE_USER_ROLE_API: (id) => `${BASE_URL}/admin/users/${id}/role`,
  DELETE_USER_API: (id) => `${BASE_URL}/admin/users/${id}`,
  SEED_ADMIN_API: BASE_URL + "/admin/seed",
};