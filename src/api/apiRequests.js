import { apiService } from "./apiService";

export const getDepartments = (payload = {}) =>
  apiService.post("/v1/rbac/get-departments", payload);
