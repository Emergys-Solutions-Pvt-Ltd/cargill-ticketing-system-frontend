export const createApiError = (status, statusText, data, message) => {
  const error = new Error(message || statusText || `Request failed with status ${status}`);
  error.name = "ApiError";
  error.status = status;
  error.statusText = statusText;
  error.data = data;
  return error;
};
