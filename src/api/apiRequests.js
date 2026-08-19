import { apiService } from "./apiService";
import mockTickets from "../mocks/ticketData";

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

export const getUserDetails = (payload = {}) =>
  apiService.post("/v1/rbac/get-user-details", payload);

export const getTicketData = (payload = {}) => {
  const { page = 1, pageSize = 10 } = payload;

  // Simulate network + real API's response shape
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageTickets = mockTickets.slice(start, end);
      const totalPages = Math.ceil(mockTickets.length / pageSize);

      resolve({
        success: true,
        message: "Tickets fetched successfully.",
        data: {
          tickets: pageTickets,
          pagination: {
            total: mockTickets.length,
            page,
            pageSize,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    }, 300); // fake latency
  });

  console.log("Fetching tickets with payload:", payload);

  // Real version, uncomment when backend ready:
  // return apiService.post("/v1/tickets/get-data", payload);
};
