import { apiService } from "./apiService";

// Apis for RBAC

export const getDepartments = (payload = {}) =>
  apiService.post("/v1/rbac/get-departments", payload);

export const getUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-users", payload);

export const getDepartmentUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-department-users", payload);

export const toggleUserStatus = (payload = {}) =>
  apiService.post("/v1/rbac/toggle-user-status", payload);

export const getQueues = (payload = {}) =>
  apiService.post("/v1/rbac/get-queues", payload);

export const getGroups = (payload = {}) =>
  apiService.post("/v1/rbac/get-groups", payload, { params: { pageSize: 30 } });

export const getDepartmentSupervisors = () =>
  apiService.get("/v1/rbac/get-department-supervisors");
