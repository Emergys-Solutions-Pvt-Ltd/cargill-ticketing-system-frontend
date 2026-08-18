import { apiService } from "./apiService";
import mockTickets from "../mocks/ticketData";

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
