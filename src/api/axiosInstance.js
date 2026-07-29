import axios from "axios";
import { localStorageService } from "../utils/localStorage";
import { createApiError } from "./apiError";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";
const TIMEOUT = 30000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ----------------------------------------------------
// Request interceptor
// ----------------------------------------------------
// Attaches the auth token from localStorage to every request, unless the
// caller explicitly opts out via `{ skipAuth: true }` in the request config.
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.skipAuth) {
      const user = localStorageService.get("auth_user");
      const token = user?.token || user?.accessToken || user?.jwt;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Let the browser set the multipart boundary header automatically
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------
// Response interceptor
// ----------------------------------------------------
// Normalizes every failure (server error, no response, request setup error)
// into a consistent error shape, and forces a logout on 401 so stale sessions can't linger.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, statusText, data } = error.response;

      if (status === 401) {
        localStorageService.remove("auth_user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(createApiError(status, statusText, data, data?.message || data?.error));
    }

    if (error.request) {
      return Promise.reject(createApiError(0, "Network Error", null, "No response received from server"));
    }

    return Promise.reject(createApiError(0, "Request Error", null, error.message));
  }
);

export default axiosInstance;
