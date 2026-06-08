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

export const getStoredTickets = () => {
  const data = localStorage.getItem("service_now_tickets_v1");
  if (data) return JSON.parse(data);
  const defaultTickets = [
    {
      id: "REQ0001234",
      title: "Request to initiate dynamic scan on SXR QA Environment",
      status: "Closed",
      created: "4 months ago",
      updated: "4 minutes ago",
      priority: "High",
      assignee: "John Doe",
      department: "Security Operations",
      category: "Security Assessment",
      urgency: "Medium",
      impact: "Medium",
      comments: [
        {
          id: 1,
          author: "Ashish Shende",
          avatar: "A",
          time: "10 mins ago",
          text: "I have uploaded the initial text guidelines, architectural diagram, and financial audit spreadsheets for review.",
          attachments: [
            { name: "scan_requirements.txt", size: "1.2 KB", type: "txt" },
            { name: "architecture_diagram.pdf", size: "2.4 MB", type: "pdf" },
            { name: "financial_report.xlsx", size: "850 KB", type: "xlsx" },
            { name: "project_schedule.xls", size: "1.5 MB", type: "xls" }
          ]
        }
      ]
    },
    {
      id: "INC0010045",
      title: "Access request for Production Database",
      status: "In Progress",
      created: "2 weeks ago",
      updated: "1 hour ago",
      priority: "Critical",
      assignee: "Alice Smith",
      department: "IT Infrastructure",
      category: "Access Management",
      urgency: "High",
      impact: "High",
      comments: []
    },
    {
      id: "REQ0001235",
      title: "Software installation: Adobe Creative Cloud",
      status: "Pending",
      created: "1 day ago",
      updated: "10 minutes ago",
      priority: "Medium",
      assignee: "Bob Wilson",
      department: "IT Support",
      category: "Software Request",
      urgency: "Medium",
      impact: "Low",
      comments: []
    },
    {
      id: "INC0010046",
      title: "Laptop replacement request",
      status: "New",
      created: "3 days ago",
      updated: "2 hours ago",
      priority: "Low",
      assignee: "Sarah Johnson",
      department: "HR Services",
      category: "Hardware",
      urgency: "Low",
      impact: "Low",
      comments: []
    }
  ];
  localStorage.setItem("service_now_tickets_v1", JSON.stringify(defaultTickets));
  return defaultTickets;
};

export const setStoredTickets = (tickets) => {
  localStorage.setItem("service_now_tickets_v1", JSON.stringify(tickets));
};

