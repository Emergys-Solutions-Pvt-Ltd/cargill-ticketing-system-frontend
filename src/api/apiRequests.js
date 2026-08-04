import { apiService } from "./apiService";

export const getDepartments = (payload = {}) =>
  apiService.post("/v1/rbac/get-departments", payload);

export const getDepartmentUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-department-users", payload);

export const getUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-users", payload);
