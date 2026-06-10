import { localStorageService } from "./localStorage";

/**
 * Custom Error class for handling network/API errors.
 */
export class ApiError extends Error {
  constructor(status, statusText, data, message) {
    super(message || statusText || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Base URL for API requests. Can be configured via environment variables
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

// Interceptor registries
const requestInterceptors = [];
const responseInterceptors = [];

/**
 * Serializes query parameters object to a query string.
 * @param {object} params
 * @returns {string}
 */
const serializeParams = (params) => {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const formattedValue = typeof value === "object" ? JSON.stringify(value) : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(formattedValue)}`;
    })
    .join("&");
  return query ? `?${query}` : "";
};

/**
 * Core request function wrapping the browser fetch API.
 * Supports interceptors for request and response modification.
 * @param {string} endpoint - API endpoint (relative path or absolute URL).
 * @param {object} options - Fetch options.
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  // Setup config starting point
  let config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  };

  // Execute request interceptors sequentially
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  const { params, headers, body, ...customOptions } = config;

  // Determine full URL (absolute vs relative)
  const isAbsoluteUrl = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const url = `${isAbsoluteUrl ? "" : BASE_URL}${endpoint}${serializeParams(params)}`;

  const combinedHeaders = { ...headers };

  // If the body is FormData, let the browser set the boundary headers automatically
  if (body instanceof FormData) {
    delete combinedHeaders["Content-Type"];
  }

  const finalConfig = {
    ...customOptions,
    headers: combinedHeaders,
  };

  if (body) {
    finalConfig.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(url, finalConfig);

    // Execute response interceptors sequentially
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    // Determine return value representation based on headers
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, data, data?.message || data?.error);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle offline status, DNS failures, CORS or other low-level network errors
    throw new ApiError(0, "Network Error", null, error.message || "Network request failed");
  }
}

// ----------------------------------------------------
// Default Request Interceptor
// ----------------------------------------------------
// Automatically checks localStorage for the auth token and adds it to headers
requestInterceptors.push((config) => {
  // If skipAuth is explicitly requested, do not attach the header
  if (config.skipAuth) {
    return config;
  }

  const user = localStorageService.get("auth_user");
  if (user) {
    const token = user.token || user.accessToken || user.jwt;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

/**
 * Convenient shorthand methods for common HTTP verbs.
 */
export const networkService = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "POST", body });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PUT", body });
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PATCH", body });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
  },

  request,

  /**
   * API to register custom request/response interceptors.
   */
  interceptors: {
    request: {
      use(fn) {
        requestInterceptors.push(fn);
        return () => {
          const index = requestInterceptors.indexOf(fn);
          if (index !== -1) requestInterceptors.splice(index, 1);
        };
      }
    },
    response: {
      use(fn) {
        responseInterceptors.push(fn);
        return () => {
          const index = responseInterceptors.indexOf(fn);
          if (index !== -1) responseInterceptors.splice(index, 1);
        };
      }
    }
  }
};
