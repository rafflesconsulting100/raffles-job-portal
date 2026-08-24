import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { SENDOTP_API, REGISTER_API, LOGIN_API } = endpoints;

export const sendOtp = async (email) => {
  try {
    const response = await apiConnector("POST", SENDOTP_API, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.");
  }
};

export const register = async (username, email, password, role, otp) => {
  try {
    const response = await apiConnector("POST", REGISTER_API, {
      username,
      email,
      password,
      role,
      otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.");
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
    throw new Error(error.response?.data?.message || "Connection error. Please check your backend server status.");
  }
};
