import axiosInstance from "./axiosInstance";

const request = async (config) => {
  const response = await axiosInstance(config);
  return response.data;
};

/**
 * Convenience shorthand methods for common HTTP verbs.
 * Pass `{ skipAuth: true }` in `config` to omit the Authorization header,
 * or any other axios request config (e.g. `signal`, `params`, `headers`).
 */
export const apiService = {
  get(url, params, config = {}) {
    return request({ ...config, url, params, method: "GET" });
  },

  post(url, data, config = {}) {
    return request({ ...config, url, data, method: "POST" });
  },

  put(url, data, config = {}) {
    return request({ ...config, url, data, method: "PUT" });
  },

  patch(url, data, config = {}) {
    return request({ ...config, url, data, method: "PATCH" });
  },

  delete(url, config = {}) {
    return request({ ...config, url, method: "DELETE" });
  },

  /**
   * Uploads a FormData payload (file uploads, multipart forms).
   */
  upload(url, formData, config = {}) {
    return request({
      ...config,
      url,
      data: formData,
      method: "POST",
      headers: { ...config.headers, "Content-Type": "multipart/form-data" },
    });
  },

  request,
};

export default apiService;
