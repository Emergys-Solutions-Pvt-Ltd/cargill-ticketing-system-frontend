import { localStorageService } from "./localStorage";

// Seed initial data if not present
const seedFileActions = () => {
  const seedData = {
    "scan_requirements.txt": {
      previews: [
        { userName: "Alice Smith", role: "IT Infrastructure", timeAgo: "2 hours ago" },
        { userName: "Bob Wilson", role: "IT Support", timeAgo: "1 day ago" }
      ],
      downloads: [
        { userName: "Alice Smith", role: "IT Infrastructure", timeAgo: "1 hour ago" }
      ]
    },
    "architecture_diagram.pdf": {
      previews: [
        { userName: "Security Team", role: "Security Operations", timeAgo: "10 mins ago" },
        { userName: "Alice Smith", role: "IT Infrastructure", timeAgo: "4 hours ago" },
        { userName: "Bob Wilson", role: "IT Support", timeAgo: "1 day ago" }
      ],
      downloads: [
        { userName: "Security Team", role: "Security Operations", timeAgo: "5 mins ago" },
        { userName: "Bob Wilson", role: "IT Support", timeAgo: "12 hours ago" }
      ]
    },
    "financial_report.xlsx": {
      previews: [
        { userName: "Finance Admin", role: "Finance Depart Admin", timeAgo: "2 hours ago" }
      ],
      downloads: []
    },
    "project_schedule.xls": {
      previews: [
        { userName: "Finance Admin", role: "Finance Depart Admin", timeAgo: "3 hours ago" }
      ],
      downloads: [
        { userName: "Finance Admin", role: "Finance Depart Admin", timeAgo: "3 hours ago" }
      ]
    },
    "preliminary_audit.pptx": {
      previews: [
        { userName: "Security Team", role: "Security Operations", timeAgo: "1 day ago" }
      ],
      downloads: []
    },
    "network_topography.png": {
      previews: [
        { userName: "Systems Admin", role: "IT Infrastructure", timeAgo: "2 days ago" },
        { userName: "Alice Smith", role: "IT Infrastructure", timeAgo: "2 days ago" }
      ],
      downloads: [
        { userName: "Systems Admin", role: "IT Infrastructure", timeAgo: "2 days ago" }
      ]
    },
    "security_report.html": {
      previews: [
        { userName: "Developer Team", role: "Developer", timeAgo: "1 day ago" }
      ],
      downloads: [
        { userName: "Developer Team", role: "Developer", timeAgo: "1 day ago" }
      ]
    },
    "screen_recording.mp4": {
      previews: [
        { userName: "Developer Team", role: "Developer", timeAgo: "2 days ago" },
        { userName: "Security Team", role: "Security Operations", timeAgo: "1 day ago" }
      ],
      downloads: []
    }
  };

  localStorageService.set("file_actions_v1", seedData);
};

export const getFileActions = (fileName) => {
  if (!localStorageService.has("file_actions_v1")) {
    seedFileActions();
  }
  const allActions = localStorageService.get("file_actions_v1") || {};
  return allActions[fileName] || { previews: [], downloads: [] };
};

export const recordFileAction = (fileName, actionType, user) => {
  if (!localStorageService.has("file_actions_v1")) {
    seedFileActions();
  }
  const allActions = localStorageService.get("file_actions_v1") || {};
  if (!allActions[fileName]) {
    allActions[fileName] = { previews: [], downloads: [] };
  }

  const listKey = actionType === "preview" ? "previews" : "downloads";
  const currentList = allActions[fileName][listKey] || [];

  // Helper to format email to display name
  const getDisplayName = (u) => {
    if (!u || !u.email) return "Guest User";
    const namePart = u.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const userName = getDisplayName(user);
  const userRole = user?.role || "User";

  const existingIndex = currentList.findIndex(item => item.userName === userName);
  if (existingIndex > -1) {
    currentList.splice(existingIndex, 1);
  }
  currentList.unshift({
    userName,
    role: userRole,
    timeAgo: "Just now"
  });

  allActions[fileName][listKey] = currentList;
  localStorageService.set("file_actions_v1", allActions);
  return allActions[fileName];
};

const seedTicketViews = () => {
  const seedData = {
    "REQ0001234": [
      { userName: "John Doe", role: "IT Support", timeAgo: "2 hours ago" },
      { userName: "Alice Smith", role: "IT Infrastructure", timeAgo: "1 day ago" },
      { userName: "Sarah Johnson", role: "HR Services", timeAgo: "2 days ago" }
    ],
    "INC0010045": [
      { userName: "Bob Wilson", role: "IT Support", timeAgo: "4 hours ago" },
      { userName: "Admin User", role: "Org Admin", timeAgo: "1 day ago" }
    ]
  };
  localStorageService.set("ticket_views_v1", seedData);
};

export const getTicketViews = (ticketId) => {
  if (!localStorageService.has("ticket_views_v1")) {
    seedTicketViews();
  }
  const allViews = localStorageService.get("ticket_views_v1") || {};
  return allViews[ticketId] || [];
};

export const recordTicketView = (ticketId, user) => {
  if (!localStorageService.has("ticket_views_v1")) {
    seedTicketViews();
  }
  const allViews = localStorageService.get("ticket_views_v1") || {};
  if (!allViews[ticketId]) {
    allViews[ticketId] = [];
  }

  const currentList = allViews[ticketId];

  // Helper to format email to display name
  const getDisplayName = (u) => {
    if (!u || !u.email) return "Guest User";
    const namePart = u.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const userName = getDisplayName(user);
  const userRole = user?.role || "User";

  const existingIndex = currentList.findIndex(item => item.userName === userName);
  if (existingIndex > -1) {
    currentList.splice(existingIndex, 1);
  }
  currentList.unshift({
    userName,
    role: userRole,
    timeAgo: "Just now"
  });

  allViews[ticketId] = currentList;
  localStorageService.set("ticket_views_v1", allViews);
  return currentList;
};
