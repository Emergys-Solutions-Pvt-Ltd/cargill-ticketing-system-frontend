import { apiService } from "./apiService";

export const getDepartments = (payload = {}) =>
  apiService.post("/v1/rbac/get-departments", payload);

export const getDepartmentUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-department-users", payload);

export const getUsers = () => apiService.get("/v1/rbac/get-users");

export const toggleUserStatus = (payload = {}) =>
  apiService.post("/v1/rbac/toggle-user-status", payload);

export const getQueues = (payload = {}) =>
  apiService.post("/v1/rbac/get-queues", payload);

export const getDepartmentSupervisors = () =>
  apiService.get("/v1/rbac/get-department-supervisors");
