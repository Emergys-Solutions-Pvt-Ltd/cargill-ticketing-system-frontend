import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export const requestFormSections = [
  {
    title: "Hr- Global-Console-Client Details",
    icon: DescriptionOutlinedIcon,
    defaultExpanded: true,
    fields: (request) => [
      { label: "Contact", value: request.contact || "John Doe" },
      { label: "Employee", value: request.employee || "Samuel Tarley" },
      { label: "Requestor", value: request.requester || "John Doe" },
      {
        label: "Self-Service Requestor",
        value: request.selfServiceRequester || request.requester || "John Doe",
      },
    ],
  },
  {
    title: "HR Global Console- Incident Details",
    icon: DescriptionOutlinedIcon,
    gridSize: { md: 6 }, // 2-col layout instead of 4-col
    fields: (request) => [
      { label: "Incident", value: request.incident || "-" },
      {
        label: "Description",
        value: request.description || request.title || "-",
      },
    ],
  },
  {
    title: "Hr- Global-Console-Status and Priority",
    icon: ShieldOutlinedIcon,
    fields: (request) => [
      { label: "Status", value: request.status || "Pending" },
      { label: "Priority", value: request.priority || "Medium" },
      { label: "Category", value: request.category || "-" },
      { label: "Department", value: request.department || "-" },
    ],
  },
  {
    title: "Date and Time Details",
    icon: EventOutlinedIcon,
    fields: (request) => [
      { label: "Created", value: request.created || "-" },
      { label: "Updated", value: request.updated || "-" },
      { label: "Start Date", value: request.startDate || "-" },
      { label: "Start Time", value: request.startTime || "-" },
      { label: "End Date", value: request.endDate || "-" },
      { label: "End Time", value: request.endTime || "-" },
    ],
  },
  {
    title: "Assignment Details",
    icon: AssignmentOutlinedIcon,
    fields: (request) => [
      { label: "Assignee", value: request.assignee || "-" },
      { label: "Assigned To", value: request.assignedTo || "-" },
      { label: "Assignment Group", value: request.assignmentGroup || "-" },
      { label: "Department", value: request.department || "-" },
    ],
  },
];

export const submittedFormData = {
  formTitle: "SDME Intake Form (RF + MyHR)",
  topFields: [
    { label: "Verified", value: "Yes" },
    { label: "Requested By", value: "Nicole Salgado Madriz" },
    { label: "Quantity", value: "1" },
    { label: "Date Expected", value: "08/01/2025 2:06 AM" },
  ],
  sections: [
    {
      title: "Customer & Contact",
      description:
        "The contact person below is the person HR will contact for questions and to whom the resolution of the request will be communicated",
      fields: [{ label: "Name of the Requestor", value: "Nicole Salgado" }],
    },
    {
      description:
        "Follow up is normally done through Cargill email. Please confirm if you have a Cargill email address or prefer to be contacted a different way.",
      fields: [
        {
          label: "My preferred method of contact is",
          value:
            "Yes, I have Cargill email and choose this option to be contacted.",
        },
      ],
    },
    {
      title: "Change Request Details",
      description:
        'Create a personalized description to help you locate this ticket in "MyHR Requests"',
      fields: [],
    },
    {
      title: "Customer & Contact",
      description:
        "The contact person below is the person HR will contact for questions and to whom the resolution of the request will be communicated",
      fields: [{ label: "Name of the Requestor", value: "Nicole Salgado" }],
    },
    {
      description:
        "Follow up is normally done through Cargill email. Please confirm if you have a Cargill email address or prefer to be contacted a different way.",
      fields: [
        {
          label: "My preferred method of contact is",
          value:
            "Yes, I have Cargill email and choose this option to be contacted.",
        },
      ],
    },
    {
      title: "Change Request Details",
      description:
        'Create a personalized description to help you locate this ticket in "MyHR Requests"',
      fields: [],
    },
  ],
};

export const detailsTabSections = [
  {
    title: "Action History",
    icon: ListAltOutlinedIcon,
    defaultExpanded: true,
    columns: [
      "Incident History Id",
      "Date & Time",
      "Sender",
      "Description",
      "Duration",
      "Note",
    ],
    rows: () => [
      {
        "Incident History Id": "20505883_3",
        "Date & Time": "02/07/2025 10:04 am",
        Sender: "Akshay Patil",
        Description: "Notes",
        Duration: "00:00",
        Note: "akshay_p@crgl_thirdparty.com 02/07/2025 10:04 am",
      },
      {
        "Incident History Id": "20505883_3",
        "Date & Time": "11/07/2025 10:04 am",
        Sender: "Akshay Patil",
        Description: "Notes",
        Duration: "00:00",
        Note: "akshay_p@crgl_thirdparty.com 02/07/2025 10:04 am",
      },
      {
        "Incident History Id": "20505883_3",
        "Date & Time": "23/07/2025 10:04 am",
        Sender: "Akshay Patil",
        Description: "Notes",
        Duration: "00:00",
        Note: "akshay_p@crgl_thirdparty.com 02/07/2025 10:04 am",
      },
    ],
  },
  {
    title: "Notes & Attachments",
    icon: LinkOutlinedIcon,
    columns: ["Title", "Type", "Created By", "Last Modified", "Action"],
    rows: () => [
      {
        Title: "scan_requirements.txt",
        Type: "File",
        "Created By": "Nicole Salgado Madriz",
        "Last Modified": "02/07/2025 10:04 am",
      },
      {
        Title: "design_specifications.docx",
        Type: "File",
        "Created By": "Nicole Salgado Madriz",
        "Last Modified": "11/07/2025 10:04 am",
      },
      {
        Title: "final_report.pptx.jpg",
        Type: "Image",
        "Created By": "Nicole Salgado Madriz",
        "Last Modified": "23/07/2025 10:04 am",
      },
    ],
  },
  {
    title: "Approval History",
    icon: LinkOutlinedIcon,
    defaultExpanded: true,
    columns: [
      "Approval Process",
      "Approval Status",
      "Approval Step Name",
      "Approval Step Status",
      "Step Approved Date",
      "Approved By",
      "Comments",
      "Overall Status",
      "Approval Process",
      "Approval Status",
      "Approval Step Name",
      "Approval Step Status",
      "Step Approved Date",
      "Approved By",
      "Comments",
      "Overall Status",
    ],
    rows: () => [
      {
        "Approval Process": "Security Review",
        "Approval Status": "Approved",
        "Approval Step Name": "L1 Approval",
        "Approval Step Status": "Complete",
        "Step Approved Date": "03/07/2025",
        "Approved By": "Samuel Tarley",
        Comments: "Looks good",
        "Overall Status": "In Progress",
      },
      {
        "Approval Process": "Security Review",
        "Approval Status": "Pending",
        "Approval Step Name": "L2 Approval",
        "Approval Step Status": "Pending",
        "Step Approved Date": "-",
        "Approved By": "-",
        Comments: "-",
        "Overall Status": "In Progress",
      },
    ],
  },
];
