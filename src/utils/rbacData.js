export const getStoredUsers = () => {
  const data = localStorage.getItem("rbac_users_v4");
  if (data) return JSON.parse(data);
  const defaultUsers = [
    { id: 1, email: "admin@cargill.com", role: "Org Admin", status: "Active" },
    { id: 2, email: "hr_admin@cargill.com", role: "HR Depart Admin", status: "Active" },
    { id: 3, email: "finance_admin@cargill.com", role: "Finance Depart Admin", status: "Active" },
    { id: 4, email: "user@cargill.com", role: "User", status: "Active" },
  ];
  localStorage.setItem("rbac_users_v4", JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const setStoredUsers = (users) => {
  localStorage.setItem("rbac_users_v4", JSON.stringify(users));
};

export const getStoredRoles = () => {
  const data = localStorage.getItem("rbac_roles_v4");
  if (data) return JSON.parse(data);
  const defaultRoles = [
    {
      name: "Org Admin",
      permissions: ["manage_org", "manage_users", "manage_dept", "view_dept_analytics", "create_ticket", "edit_ticket", "comment_ticket", "preview_file", "download_file"],
      isSystem: true,
      level: 1
    },
    {
      name: "HR Depart Admin",
      permissions: ["manage_dept", "view_dept_analytics", "create_ticket", "edit_ticket", "comment_ticket", "preview_file", "download_file"],
      isSystem: true,
      level: 2
    },
    {
      name: "Finance Depart Admin",
      permissions: ["manage_dept", "view_dept_analytics", "create_ticket", "edit_ticket", "comment_ticket", "preview_file", "download_file"],
      isSystem: true,
      level: 2
    },
    {
      name: "User",
      permissions: ["create_ticket", "edit_ticket", "comment_ticket", "preview_file", "download_file"],
      isSystem: true,
      level: 3
    }
  ];
  localStorage.setItem("rbac_roles_v4", JSON.stringify(defaultRoles));
  return defaultRoles;
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
