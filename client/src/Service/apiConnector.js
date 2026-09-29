import axios from "axios";
import { clearSessionMemory, clearToken, getToken } from "../Utils/memoryStore";

// withCredentials is required for the httpOnly session cookie the API sets;
// without it cross-origin requests silently drop the cookie and only the
// localStorage bearer token keeps the session alive.
export const axiosInstance = axios.create({ withCredentials: true });

// Endpoints where a 401 means "wrong credentials", not "session expired" —
// redirecting there would wipe the form the user is still typing into.
const CREDENTIAL_ENDPOINT =
  /\/(auth\/(login|logout|register|send-otp|job-seeker\/google\/(login|register))|admin\/login)(\?|$)/;

/**
 * Drop the local half of the session (localStorage + in-memory cache) and
 * notify listeners. The httpOnly cookie can only be cleared by the server —
 * call the logout API for that.
 */
export const clearClientSession = () => {
  clearToken();
  localStorage.removeItem("user");
  clearSessionMemory();
  window.dispatchEvent(new Event("auth-change"));
};

// Expired/invalid sessions used to fail silently: every dashboard kept
// rendering with a stale localStorage user while every request 401'd, leaving
// the account permanently broken until a manual cache clear. Now a 401 tears
// the session down and sends the user back to /login exactly once.
let redirecting = false;
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const hasSession = Boolean(getToken());

    if (
      status === 401 &&
      hasSession &&
      !CREDENTIAL_ENDPOINT.test(url) &&
      !window.location.pathname.startsWith("/login") &&
      !redirecting
    ) {
      redirecting = true;
      clearClientSession();
      sessionStorage.setItem("sessionExpired", "1");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
