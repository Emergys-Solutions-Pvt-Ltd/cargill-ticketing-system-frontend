const getMockData = async () => {
  const response = await fetch("/mockData.json");
  return response.json();
};

export const initMockData = async () => {
  try {
    const mockData = await getMockData();
    if (!localStorage.getItem("rbac_users_v4") && mockData.users) {
      localStorage.setItem("rbac_users_v4", JSON.stringify(mockData.users));
    }
    if (!localStorage.getItem("rbac_roles_v4") && mockData.roles) {
      localStorage.setItem("rbac_roles_v4", JSON.stringify(mockData.roles));
    }
    if (!localStorage.getItem("service_now_tickets_v1") && mockData.tickets) {
      localStorage.setItem("service_now_tickets_v1", JSON.stringify(mockData.tickets));
    }
  } catch (error) {
    console.error("Failed to initialize mock data:", error);
  }
};

export const getStoredUsers = () => {
  const data = localStorage.getItem("rbac_users_v4");
  if (data) return JSON.parse(data);
  return [];
};

export const setStoredUsers = (users) => {
  localStorage.setItem("rbac_users_v4", JSON.stringify(users));
};

export const getStoredRoles = () => {
  const data = localStorage.getItem("rbac_roles_v4");
  if (data) return JSON.parse(data);
  return [];
};

export const setStoredRoles = (roles) => {
  localStorage.setItem("rbac_roles_v4", JSON.stringify(roles));
};

export const systemPermissions = [
  // Level 1: Organization
  { id: "manage_org", label: "Manage Organization", desc: "Allows managing organization configuration and departments", level: 1 },
  { id: "manage_users", label: "Manage Users", desc: "Allows managing all organization user accounts and role assignments", level: 1 },

  // Level 2: Department
  { id: "manage_dept", label: "Manage Department Settings", desc: "Allows managing department-specific settings, templates, and team members", level: 2 },
  { id: "view_dept_analytics", label: "View Dept Analytics", desc: "Access department-level metrics, ticket volume, and resolution reports", level: 2 },

  // Level 3: Tickets
  { id: "create_ticket", label: "Create Ticket", desc: "Allows raising new customer support tickets", level: 3 },
  { id: "edit_ticket", label: "Update Ticket", desc: "Allows updating details and status of tickets", level: 3 },
  { id: "comment_ticket", label: "Comment on Ticket", desc: "Allows posting text comments and attaching files to ticket activity timelines", level: 3 },
  { id: "preview_file", label: "Preview File", desc: "Allows launching rich client-side document previews", level: 3 },
  { id: "download_file", label: "Download File", desc: "Allows downloading documents attached to ticket comments", level: 3 },
];

export const getStoredTickets = () => {
  const data = localStorage.getItem("service_now_tickets_v1");
  if (data) return JSON.parse(data);
  return [];
};

export const getStoredTicketsAsync = async () => {
  const data = localStorage.getItem("service_now_tickets_v1");
  if (data) return JSON.parse(data);

  try {
    const mockData = await getMockData();
    const defaultTickets = mockData.tickets || [];
    localStorage.setItem("service_now_tickets_v1", JSON.stringify(defaultTickets));
    return defaultTickets;
  } catch (error) {
    console.error("Failed to fetch default tickets from mockData.json:", error);
    return [];
  }
};

export const setStoredTickets = (tickets) => {
  localStorage.setItem("service_now_tickets_v1", JSON.stringify(tickets));
};

