// Mock section payloads for RequestDetails "Service Request Form" tab.
// Each section carries its own render `type` so the component doesn't
// need to know in advance whether a section is a field grid or a table.
//
// type: "fields" -> rendered via FormSectionGrid
// type: "table"  -> rendered via DetailTable

export const hrRequestDetailSections = [
  {
    key: "hr-client-details",
    title: "HR-Global-Console-Client Details",
    icon: "description",
    defaultExpanded: true,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Contact", value: "John Doe" },
      { label: "Employee", value: "Samuel Tarley" },
      { label: "Requestor", value: "John Doe" },
      { label: "Self-Service Requestor", value: "John Doe" },
    ],
  },
  {
    key: "hr-incident-details",
    title: "HR Global Console- Incident Details",
    icon: "list",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Incident", value: "INC0001238" },
      { label: "Category", value: "Access Request" },
      { label: "Sub-Category", value: "Database Access" },
      { label: "Impact", value: "Medium" },
    ],
  },
  {
    key: "hr-status-priority",
    title: "HR- Global-Console-Status and Priority",
    icon: "shield",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Status", value: "Pending" },
      { label: "Priority", value: "Medium" },
    ],
  },
  {
    key: "date-time-details",
    title: "Date and Time Details",
    icon: "event",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Start Date", value: "Jan 17, 2026" },
      { label: "Start Time", value: "09:21 AM" },
      { label: "End Date", value: "Jan 24, 2026" },
      { label: "End Time", value: "05:00 PM" },
    ],
  },
  {
    key: "assignment-details",
    title: "Assignment Details",
    icon: "assignment",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Assignment Group", value: "Enterprise Services" },
      { label: "Assigned To", value: "Alex Morgan" },
    ],
  },
  {
    key: "related-records",
    title: "Related Records",
    icon: "link",
    defaultExpanded: false,
    // example of a table-format section
    type: "table",
    columns: ["Title", "Type", "Date"],
    rows: [
      {
        Title: "Security Scan Checklist",
        Type: "Document",
        Date: "Jan 17, 2026",
      },
      { Title: "Access Approval", Type: "Record", Date: "Jan 18, 2026" },
    ],
  },
];

export const nonHrRequestDetailSections = [
  {
    key: "client-details",
    title: "Client Details",
    icon: "description",
    defaultExpanded: true,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Contact", value: "Jane Smith" },
      { label: "Requestor", value: "Jane Smith" },
    ],
  },
  {
    key: "incident-details",
    title: "Incident Details",
    icon: "list",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Incident", value: "TSK0001236" },
      { label: "Category", value: "Termination Template" },
    ],
  },
  {
    key: "status-priority",
    title: "Status and Priority",
    icon: "shield",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Status", value: "In Progress" },
      { label: "Priority", value: "High" },
    ],
  },
  {
    key: "date-time-details",
    title: "Date and Time Details",
    icon: "event",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [
      { label: "Start Date", value: "Jan 10, 2026" },
      { label: "End Date", value: "Jan 12, 2026" },
    ],
  },
  {
    key: "assignment-details",
    title: "Assignment Details",
    icon: "assignment",
    defaultExpanded: false,
    type: "fields",
    gridSize: 3,
    fields: [{ label: "Assigned To", value: "Unassigned" }],
  },
];

// --- Details tab (table-heavy: attachments / related items) ---
// rows use PascalCase keys matching `columns` header text, same
// convention DetailTable already expects (see tab 1's original usage).
export const hrDetailsTabSections = [
  {
    key: "attachments",
    title: "Attachments",
    icon: "description",
    defaultExpanded: true,
    type: "table",
    columns: ["Title", "Uploaded By", "Date"],
    rows: [
      {
        Title: "Security Scan Requirements Checklist",
        "Uploaded By": "Alex Morgan",
        Date: "Jan 17, 2026",
      },
      {
        Title: "RBAC Access Matrix",
        "Uploaded By": "Alex Morgan",
        Date: "Jan 18, 2026",
      },
    ],
  },
  {
    key: "approval-history",
    title: "Approval History",
    icon: "shield",
    defaultExpanded: false,
    type: "table",
    columns: ["Approver", "Status", "Date"],
    rows: [
      { Approver: "Samuel Tarley", Status: "Approved", Date: "Jan 16, 2026" },
      { Approver: "John Doe", Status: "Pending", Date: "Jan 17, 2026" },
    ],
  },
];

export const nonHrDetailsTabSections = [
  {
    key: "attachments",
    title: "Attachments",
    icon: "description",
    defaultExpanded: true,
    type: "table",
    columns: ["Title", "Uploaded By", "Date"],
    rows: [
      {
        Title: "Termination Template",
        "Uploaded By": "Jane Smith",
        Date: "Jan 10, 2026",
      },
    ],
  },
];

// --- Submitted Form tab ---
// Matches SubmittedFormView's actual prop contract:
// { formTitle, topFields: [{label,value}], sections: [{title, description, fields:[{label,value}]}] }
export const hrSubmittedForm = {
  formTitle: "Request to initiate dynamic scan on SXR QA Environment",
  topFields: [
    { label: "Request Type", value: "Dynamic Scan" },
    { label: "Environment", value: "SXR QA" },
    { label: "Submitted By", value: "John Doe" },
    { label: "Submitted On", value: "Jan 17, 2026" },
  ],
  sections: [
    {
      title: "Justification",
      description: "Reason provided by the requestor for this scan.",
      fields: [
        {
          label: "Business Justification",
          value: "Required for quarterly security compliance audit.",
        },
      ],
    },
    {
      title: "Scope",
      fields: [
        { label: "Target System", value: "SXR QA API Gateway" },
        { label: "Scan Depth", value: "Full" },
      ],
    },
  ],
};

export const nonHrSubmittedForm = {
  formTitle: "Termination Template Request",
  topFields: [
    { label: "Request Type", value: "Termination" },
    { label: "Submitted By", value: "Jane Smith" },
    { label: "Submitted On", value: "Jan 10, 2026" },
  ],
  sections: [
    {
      title: "Details",
      fields: [{ label: "Reason", value: "Contract end" }],
    },
  ],
};
