const LABEL_MAP = {
  contact: "Contact",
  employee: "Employee",
  requestor: "Requestor",
  selfServiceRequestor: "Self-Service Requestor",
  fromEmailAddress: "From Email Address",
  template: "Template",
  requestDefinition: "Request Definition",
  categoryLevel1: "Category Level 1",
  categoryLevel2: "Category Level 2",
  categoryLevel3: "Category Level 3",
  categoryMoreInfo: "Category More Info",
  shortDescription: "Short Description",
  reopenReason: "Reopen Reason",
  description: "Description",
  resolution: "Resolution",
  totalWorkTimeMinutes: "Total Work Time",
  transactionCount: "Transaction Count",
  emailSentTo: "Email Sent To",
  incidentType: "Incident Type",
  allTasksClosedController: "All Tasks Closed Controller",
  incidentSource: "Incident Source",
  followUp: "Follow Up",
  escalatedIssue: "Escalated Issue",
  impact: "Impact",
  urgency: "Urgency",
  priority: "Priority",
  status: "Status",
  firstCallResolution: "First Call Resolution",
  closureCategory: "Closure Category",
  resolvedDate: "Resolved Date",
  dueDate: "Due Date",
  closedDate: "Closed Date",
  respondedDate: "Responded Date",
  queue: "Queue",
  staff: "Staff",
};

export const formatLabel = (key) => LABEL_MAP[key] || key;

export const objectToFields = (obj = {}) =>
  Object.entries(obj).map(([key, value]) => ({
    key,
    label: formatLabel(key),
    value,
  }));

const STATUS_COLORS = {
  new: { bg: "#e6f4ea", text: "#137333", border: "#ceead6" },
  open: { bg: "#e6f4ea", text: "#137333", border: "#ceead6" },
  "in progress": { bg: "#e8f0fe", text: "#1a73e8", border: "#d2e3fc" },
  pending: { bg: "#fef7e0", text: "#b06000", border: "#feebd0" },
  "on hold": { bg: "#fef7e0", text: "#b06000", border: "#feebd0" },
  resolved: { bg: "#e2f1e8", text: "#0f9d58", border: "#c6ecdb" },
  closed: { bg: "#f1f3f4", text: "#5f6368", border: "#dadce0" },
};
const DEFAULT_STATUS_COLOR = {
  bg: "#f1f3f4",
  text: "#5f6368",
  border: "#dadce0",
};

export const getStatusColor = (status) =>
  STATUS_COLORS[status?.toLowerCase()] || DEFAULT_STATUS_COLOR;
