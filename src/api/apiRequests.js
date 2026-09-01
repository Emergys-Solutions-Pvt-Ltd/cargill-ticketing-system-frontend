import { apiService } from "./apiService";
import mockTickets from "../mocks/ticketData";
import {
  hrRequestDetailSections,
  nonHrRequestDetailSections,
  hrDetailsTabSections,
  nonHrDetailsTabSections,
  hrSubmittedForm,
  nonHrSubmittedForm,
} from "../mocks/requestDetailsData";
import { mockServiceRequestForm } from "../mocks/ticketServiceRequestData";
import { mockServiceRequestDetails } from "../mocks/serviceRequestDetailsData";

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

export const removeGroupsFromUser = (payload = {}) =>
  apiService.post("/v1/rbac/remove-groups-from-user", payload);

export const getUserDetails = (payload = {}) =>
  apiService.post("/v1/rbac/get-user-details", payload);

export const getTicketData = (payload = {}) => {
  const { page = 1, pageSize = 10 } = payload;

  // Simulate network + real API's response shape
  console.log("Fetching tickets with payload:", payload);
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

  // Real version, uncomment when backend ready:
  // return apiService.post("/v1/tickets/get-data", payload);
};

export const getServiceRequestForm = (payload = {}) => {
  const { ticketId } = payload;

  console.log("Fetching service request form with payload:", payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Service request form fetched successfully.",
        data: {
          ticketId,
          ...mockServiceRequestForm,
        },
      });
    }, 300);
  });

  // Real API version:
  // return apiService.post("/v1/tickets/get-service-request-form", payload);
};

export const getServiceRequestDetails = (payload = {}) => {
  const { ticketId } = payload;

  console.log("Fetching service request details with payload:", payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Service request details fetched successfully.",
        data: {
          ticketId,
          ...mockServiceRequestDetails,
        },
      });
    }, 300);
  });

  // Real API:
  // return apiService.post(
  //   "/v1/tickets/get-service-request-details",
  //   payload
  // );
};

const MOCK_TASK_FORM_DETAILS = {
  clientDetails: {
    contact: "John Doe",
    incidentStaffEmail: "john.12@xyz.com",
  },
  taskDetails: {
    template: "Termination Template-EMEA",
    taskCategoryMoreInfo: "Termination",
    taskDescription:
      "Pay rate updated for Brenda Carla Gonzalez ‎(b492848)‎ as follows-\nEffective Jun 17, 2025 pay rate updated to 23.65\nEffective Dec 08, 2025 pay rate updated to 25.5\n\nPlease assist with back pay Pay rate updated for Brenda Carla Gonzalez ‎(b492848)‎ as follows-\nEffective Jun 17, 2025 pay rate updated to 23.65\nEffective Dec 08, 2025 pay rate updated to 25.5\n\nPlease assist with back pay",
    resolution: "-",
    incidentServiceRequest: "-",
    transactionCount: 1,
  },
  statusAndPriority: {
    impact: "High",
    urgency: "High",
    priority: "-",
    status: "Opened",
    followUp: "No",
    firstCallResolution: "No",
  },
  dateAndTimeDetails: {
    openDate: "08/02/2025 10:04 am",
    dueDate: "12/02/2025",
    scheduleStart: "07/02/2025 08:04 AM",
    schedulEnd: "-",
    closeDate: "-",
  },
  assignmentDetails: {
    queue: "HR Support (Akshay)",
    staff: "BOT CS Termination",
  },
};

const MOCK_TASK_DETAILS = {
  actionHistory: [
    {
      "Incident History Id": "20505893_3",
      "Date & Time": "02/07/2025 10:04 am",
      Sender: "Akshay Patil",
      Description: "Notes",
      Duration: "00:00",
      Note: "akshay_p@crgll_thrdparty.com 02/07/2025 10:04 am",
    },
    {
      "Incident History Id": "20505893_3",
      "Date & Time": "11/07/2025 10:04 am",
      Sender: "Akshay Patil",
      Description: "Notes",
      Duration: "00:00",
      Note: "akshay_p@crgll_thrdparty.com 02/07/2025 10:04 am",
    },
    {
      "Incident History Id": "20505893_3",
      "Date & Time": "23/07/2025 10:04 am",
      Sender: "Akshay Patil",
      Description: "Notes",
      Duration: "00:00",
      Note: "akshay_p@crgll_thrdparty.com 02/07/2025 10:04 am",
    },
  ],
  notesAndAttachments: [
    {
      Title: "scan_requirements.txt",
      Type: "File",
      "Created By": "Nicole Salgado Mediz",
      "Last Modified": "02/07/2025 10:04 am",
    },
    {
      Title: "design_specifications.docx",
      Type: "File",
      "Created By": "Nicole Salgado Mediz",
      "Last Modified": "11/07/2025 10:04 am",
    },
    {
      Title: "final_report.pptx.jpg",
      Type: "Image",
      "Created By": "Nicole Salgado Mediz",
      "Last Modified": "23/07/2025 10:04 am",
    },
  ],
  linkedTasks: [
    {
      "Task Id": "TSK0001247",
      Status: "In Progress",
      Description: "Termination Template-EMEA",
      Queue: "HR Support (Akshay)",
      "Due Date": "02/07/2025 12:04 am",
      Staff: "John Doe",
    },
  ],
  linkedIncidents: [{ "Incidents Id": "INC0001897" }],
};

export const getTaskFormDetails = async (payload) => {
  // TODO: swap to real call once backend confirmed working
  // return api.post("/get-task-form", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, data: MOCK_TASK_FORM_DETAILS };
};

export const getTaskDetails = async (payload) => {
  // TODO: swap to real call once backend confirmed working
  // return api.post("/get-task-details", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, data: MOCK_TASK_DETAILS };
};

const MOCK_SUBMITTED_FORM = [
  { type: "header", title: "Customer & Contact" },
  {
    type: "header",
    title:
      "The contact person below is the person HR will contact for questions and to whom the resolution of the request will be communicated",
  },
  { type: "field", label: "Name of Contact Person", value: "Tina Merry" },
  {
    type: "header",
    title:
      "Follow up is normally done through Cargill email.  Please confirm if you have a Cargill email address or prefer to be contacted a different way.",
  },
  {
    type: "field",
    label: "My method of contact is",
    value: "Yes, I have Cargill email and choose this option to be contacted.",
  },
  { type: "header", title: "Request Details" },
  {
    type: "header",
    title:
      "Note. Make sure you don't include any personal information or confidential details.   This description will be used to provide you and the MyHR Support team visibility on the main purpose of your request in case you want to access this request later.",
  },
  { type: "field", label: "Brief Summary", value: "Brenda Gonzalez" },
  { type: "field", label: "Employee Location Country", value: "United States" },
  {
    type: "field",
    label: "Type of Request",
    value: "Kronos Pay Correction (Hourly)",
  },
  {
    type: "field",
    label: "Transaction Type",
    value: "Single Employee Transaction",
  },
  {
    type: "header",
    title:
      "Requests for Time and Pay Corrections are to be submitted by a supervisor.",
  },
  { type: "field", label: "Employee Name", value: "None" },
  { type: "field", label: "Employee / Person ID", value: "30032920" },
  { type: "field", label: "Over/Under Paid", value: "Underpaid" },
  { type: "header", title: "Kronos Pay Correction (Hourly)" },
  { type: "field", label: "PTO/Vacation(Pay Correction)", value: "false" },
  { type: "field", label: "-", value: "None" },
  { type: "field", label: "Statutory Holiday(Pay Correction)", value: "false" },
  { type: "field", label: "-", value: "None" },
];

export const getSubmittedForm = async (payload) => {
  // TODO: swap to real call
  // return api.post("/get-submitted-form", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, data: MOCK_SUBMITTED_FORM };
};

const MOCK_SLA_DATA = [
  {
    "Target Title": "CBS Global Re...",
    "Target Type": "Resolution...",
    "Time Remaining": "- 190 day(s) 09...",
    "Target End Date": "10/27/2023 8...",
    Agreement: "CBS Global Ta...",
    "Start Date": "8/2/2025 12:5...",
    "Elapsed Time": "250 day(s) 09:30 HH:...",
    Clock: "Running",
    State: "In-progress",
    Status: "Missed",
  },
  {
    "Target Title": "CBS Global Re...",
    "Target Type": "Resolution...",
    "Time Remaining": "- 190 day(s) 09...",
    "Target End Date": "10/27/2023 8...",
    Agreement: "CBS Global Ta...",
    "Start Date": "8/2/2025 12:5...",
    "Elapsed Time": "250 day(s) 09:30 HH:...",
    Clock: "Running",
    State: "In-progress",
    Status: "Missed",
  },
  {
    "Target Title": "CBS Global Re...",
    "Target Type": "Resolution...",
    "Time Remaining": "- 190 day(s) 09...",
    "Target End Date": "10/27/2023 8...",
    Agreement: "CBS Global Ta...",
    "Start Date": "8/2/2025 12:5...",
    "Elapsed Time": "250 day(s) 09:30 HH:...",
    Clock: "Running",
    State: "In-progress",
    Status: "Cancelled",
  },
];

export const getSlaData = async (payload) => {
  // TODO: swap to real call
  // return api.post("/get-sla", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, data: MOCK_SLA_DATA };
};

/**
 * Fetches a pre-signed download URL for a given attachment.
 *
 * Real API: GET /v1/tickets/download
 * Body: { relativePath: string }
 * Response: { success: true, message: string, data: { url: string } }
 */
export const downloadFile = async (payload = {}) => {
  const { relativePath } = payload;

  console.log("[mock] relativePath from row:", relativePath);
  await new Promise((r) => setTimeout(r, 400));
  console.log(`${window.location.origin}/mock/sample.pdf`, "---------------");
  return {
    success: true,
    message: "File url generated successfully.",
    data: {
      url: `${window.location.origin}/mock/sample.pdf`,
      fileName: "sample.pdf",
    },
  };
};
