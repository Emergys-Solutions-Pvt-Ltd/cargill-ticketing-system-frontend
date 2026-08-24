// mocks/ticketServiceRequestData.js

export const mockServiceRequestForm = {
  clientDetails: {
    contact: "John Doe",
    employee: "EMP001",
    requestor: "Jane Smith",
    selfServiceRequestor: "Jane Smith",
    fromEmailAddress: "jane.smith@example.com",
  },

  incidentDetails: {
    template: "Service Request",
    requestDefinition: "General Service Request",
    categoryLevel1: "IT",
    categoryLevel2: "Hardware",
    categoryLevel3: "Laptop",
    categoryMoreInfo: "Laptop replacement request",
    shortDescription: "Laptop replacement required",
    reopenReason: "",
    description: "User requires a replacement laptop.",
    resolution: "Replacement laptop assigned to user.",
    totalWorkTimeMinutes: 45,
    transactionCount: 3,
    emailSentTo: "jane.smith@example.com",
    incidentType: "Service Request",
    allTasksClosedController: true,
    incidentSource: "Portal",
    followUp: false,
    escalatedIssue: false,
  },

  statusAndPriority: {
    impact: "Medium",
    urgency: "Medium",
    priority: "P2",
    status: "Resolved",
    firstCallResolution: true,
    closureCategory: "Resolved",
  },

  dateAndTimeDetails: {
    resolvedDate: "2026-08-24T10:30:00Z",
    dueDate: "2026-08-24T12:00:00Z",
    closedDate: "2026-08-24T11:00:00Z",
    respondedDate: "2026-08-24T09:15:00Z",
  },

  assignmentDetails: {
    queue: "IT Support",
    staff: "Support Agent",
  },
};