// src/services/api.js
import axios from "axios";

// Base API URL (from Vite environment variables)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // VERY important for HttpOnly JWT cookies
});

// Automatically remove Content-Type for FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Universal error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error?.message ||
      "Network Error";

    return Promise.reject({
      status: error?.response?.status,
      message,
    });
  }
);

export default api;
