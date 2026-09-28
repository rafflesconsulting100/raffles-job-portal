import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { SENDOTP_API, REGISTER_API, LOGIN_API, GET_PROFILE_API, GOOGLE_LOGIN_API, GOOGLE_REGISTER_API } = endpoints;

export const sendOtp = async (email) => {
  try {
    const response = await apiConnector("POST", SENDOTP_API, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.", { cause: error });
  }
};

export const register = async (username, email, password, role, otp, extras = {}) => {
  try {
    const response = await apiConnector("POST", REGISTER_API, {
      username,
      companyName: extras.companyName || (role === 'Employer' ? username : ''),
      email,
      password,
      role,
      otp,
      confirmPassword: extras.confirmPassword,
      mobileNumber: extras.mobileNumber,
      acceptedTerms: extras.acceptedTerms,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.", { cause: error });
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.", { cause: error });
  }
};

export const getProfile = async (token) => {
  try {
    const response = await apiConnector("GET", GET_PROFILE_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user profile", { cause: error });
  }
};

export const googleLogin = async (idToken) => {
  try {
    const response = await apiConnector("POST", GOOGLE_LOGIN_API, {
      idToken,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google Login failed. Please try again.", { cause: error });
  }
};

export const googleRegister = async (idToken) => {
  try {
    const response = await apiConnector("POST", GOOGLE_REGISTER_API, {
      idToken,
      acceptedTerms: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google Registration failed. Please try again.", { cause: error });
  }
};

