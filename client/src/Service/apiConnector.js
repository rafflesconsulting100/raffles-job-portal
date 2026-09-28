import axios from "axios";

// withCredentials is required for the httpOnly session cookie the API sets;
// without it cross-origin requests silently drop the cookie and only the
// localStorage bearer token keeps the session alive.
export const axiosInstance = axios.create({ withCredentials: true });

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
