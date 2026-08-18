import { apiService } from "./apiService";

// Apis for RBAC

export const getDepartments = (payload = {}) =>
  apiService.post("/v1/rbac/get-departments", payload);

export const getUsers = (payload = {}) =>
  apiService.post("/v1/rbac/get-users", payload);

export const addUser = (payload = {}) =>
  apiService.post("/v1/rbac/add-user", payload);

export const editUser = (payload = {}) =>
  apiService.post("/v1/rbac/edit-user", payload);

export const toggleUserStatus = (payload = {}) =>
  apiService.post("/v1/rbac/toggle-user-status", payload);

export const getQueues = (payload = {}) =>
  apiService.post("/v1/rbac/get-queues", payload);

export const getGroups = (payload = {}) =>
  apiService.post("/v1/rbac/get-groups", payload);

export const addGroup = (payload = {}) =>
  apiService.post("/v1/rbac/add-group", payload);

export const editGroup = (payload = {}) =>
  apiService.post("/v1/rbac/edit-group", payload);

export const addQueuesToGroup = (payload = {}) =>
  apiService.post("/v1/rbac/add-queues-to-group", payload);

export const removeQueuesFromGroup = (payload = {}) =>
  apiService.post("/v1/rbac/remove-queues-from-group", payload);

export const assignGroupToUser = (payload = {}) =>
  apiService.post("/v1/rbac/assign-group-to-user", payload);

export const getDepartmentSupervisors = () =>
  apiService.get("/v1/rbac/get-department-supervisors");

export const getUserDetails = (payload = {}) =>
  apiService.post("/v1/rbac/get-user-details", payload);
