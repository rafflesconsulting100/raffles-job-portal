// API origin. A missing VITE_API_BASE_URL used to silently produce URLs like
// "undefined/auth/login", so the build now falls back to the local dev server
// and warns loudly instead of failing at request time.
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (!configuredBaseUrl && import.meta.env.PROD) {
  console.error('[api] VITE_API_BASE_URL is not set — API requests will fail in this build.');
}
const BASE_URL = configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  REGISTER_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  GOOGLE_LOGIN_API: BASE_URL + "/auth/job-seeker/google/login",
  GOOGLE_REGISTER_API: BASE_URL + "/auth/job-seeker/google/register",

  // EMPLOYER & JOB ENDPOINTS
  EMPLOYER_STATS_API: BASE_URL + "/applications/stats",
  GET_EMPLOYER_JOBS_API: BASE_URL + "/jobs/my-jobs",
  GET_ALL_JOBS_API: BASE_URL + "/jobs",
  GET_JOB_BY_SLUG_API: (slug) => `${BASE_URL}/jobs/slug/${encodeURIComponent(slug)}`,
  CREATE_JOB_API: BASE_URL + "/jobs",
  UPDATE_JOB_API: (id) => `${BASE_URL}/jobs/${id}`,
  DELETE_JOB_API: (id) => `${BASE_URL}/jobs/${id}`,
  GET_JOB_APPLICANTS_API: (jobId) => `${BASE_URL}/applications/job/${jobId}`,
  UPDATE_APPLICATION_STATUS_API: (id) => `${BASE_URL}/applications/${id}/status`,
  APPLY_JOB_API: (jobId) => `${BASE_URL}/applications/apply/${jobId}`,
  GET_STUDENT_DATABASE_API: BASE_URL + "/applications/student-database",

  // PUBLIC ENDPOINTS
  CONTACT_API: BASE_URL + "/contact",

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
};