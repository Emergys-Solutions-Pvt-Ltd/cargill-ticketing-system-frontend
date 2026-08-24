export const mockServiceRequestDetails = {
  actionHistory: [
    {
      Date: "08/02/2025 11:22 AM",
      User: "John Doe",
      Description: "Service request created",
      Action: "Ticket Created",
    },
    {
      Date: "08/02/2025 11:35 AM",
      User: "Akshay Dahake",
      Description: "Ticket assigned to HR Support",
      Action: "Assigned",
    },
  ],

  notesAndAttachments: [
    {
      Title: "Business Requirement",
      Type: "Note",
      AddedBy: "John Doe",
      Date: "08/02/2025 11:40 AM",
    },
    {
      Title: "Supporting Document.pdf",
      Type: "Attachment",
      AddedBy: "John Doe",
      Date: "08/02/2025 11:45 AM",
    },
  ],

  linkedTasks: [
    {
      Task: "Validate Employee Information",
      Status: "Completed",
      AssignedTo: "Akshay Dahake",
      DueDate: "08/02/2025",
    },
  ],

  linkedIncidents: [
    {
      Incident: "INC001234",
      Description: "Employee onboarding issue",
      Status: "Resolved",
      Priority: "Medium",
    },
  ],
};
