import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { CONTACT_API } = endpoints;

export const submitContactForm = async (payload) => {
  try {
    const response = await apiConnector("POST", CONTACT_API, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "We could not send your message. Please try again or email us directly.",
      { cause: error }
    );
  }
};
