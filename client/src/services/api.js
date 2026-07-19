import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = new Error(
      error.response?.data?.message || error.message || "Request failed"
    );

    apiError.status = error.response?.status;
    apiError.data = error.response?.data;

    return Promise.reject(apiError);
  }
);

export default api;
