import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export const SECTION_ICON_MAP = {
  description: DescriptionOutlinedIcon,
  event: EventOutlinedIcon,
  assignment: AssignmentOutlinedIcon,
  shield: ShieldOutlinedIcon,
  link: LinkOutlinedIcon,
  list: ListAltOutlinedIcon,
  person: PersonOutlineOutlinedIcon,
};

// env flag — set VITE_APP_MODE=hr or nonhr in .env
export const IS_HR = import.meta.env.VITE_APP_MODE === "hr";

// ---------- HR variants (current) ----------
const HR_SERVICE_REQUEST_SECTIONS = [
  {
    key: "clientDetails",
    title: "Hr- Global-Console-Client Details",
    icon: "description",
  },
  {
    key: "incidentDetails",
    title: "HR Global Console- Incident Details",
    icon: "event",
  },
  {
    key: "statusAndPriority",
    title: "Hr- Global-Console-Status and Priority",
    icon: "shield",
  },
  { key: "dateAndTimeDetails", title: "Date and Time Details", icon: "event" },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
];

const HR_TASK_REQUEST_SECTIONS = [
  { key: "clientDetails", title: "Console Client Details HR", icon: "person" },
  { key: "taskDetails", title: "Console-Task Details HR", icon: "description" },
  {
    key: "statusAndPriority",
    title: "Status and Priority Details",
    icon: "shield",
  },
  { key: "dateAndTimeDetails", title: "Date and Time Details", icon: "event" },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
];

// ---------- Non-HR variants (from screenshots) ----------
const NONHR_SERVICE_REQUEST_SECTIONS = [
  {
    key: "clientDetails",
    title: "Console-Client Details",
    icon: "description",
  },
  { key: "incidentDetails", title: "Console-Incident Details", icon: "event" },
  { key: "closureCategories", title: "Closure Categories", icon: "list" },
  {
    key: "statusAndPriority",
    title: "Console-Status and Priority",
    icon: "shield",
  },
  {
    key: "dateAndTimeDetails",
    title: "Console-Date and Time Details",
    icon: "event",
  },
  {
    key: "serviceAndCiDetails",
    title: "Console-Service and CI Details",
    icon: "person",
  },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
  { key: "reopenDetails", title: "Console Reopen Details", icon: "link" },
];

const NONHR_TASK_REQUEST_SECTIONS = [
  {
    key: "clientDetails",
    title: "Console Client Details Procurement",
    icon: "person",
  },
  {
    key: "taskDetails",
    title: "Console-Task Details Procurement",
    icon: "description",
  },
  {
    key: "statusAndPriority",
    title: "Status and Priority Details",
    icon: "shield",
  },
  { key: "dateAndTimeDetails", title: "Date and Time Details", icon: "event" },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
];

const HR_INCIDENT_REQUEST_SECTIONS = [
  {
    key: "clientDetails",
    title: "Hr-Global-Console-Client Details",
    icon: "description",
  },
  {
    key: "incidentDetails",
    title: "Hr-Global-Console-Incident Details",
    icon: "event",
  },
  {
    key: "statusAndPriority",
    title: "Hr-Global-Console-Status and Priority",
    icon: "shield",
  },
  { key: "dateAndTimeDetails", title: "Date and Time Details", icon: "event" },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
];

const NONHR_INCIDENT_REQUEST_SECTIONS = [
  {
    key: "clientDetails",
    title: "Global-Console-Client Details",
    icon: "description",
  },
  {
    key: "incidentDetails",
    title: "Global-Console- Incident Details",
    icon: "event",
  },
  {
    key: "statusAndPriority",
    title: "Global-Console-Status and Priority",
    icon: "shield",
  },
  { key: "dateAndTimeDetails", title: "Date and Time Details", icon: "event" },
  { key: "assignmentDetails", title: "Assignment Details", icon: "assignment" },
];

export const INCIDENT_REQUEST_SECTIONS = IS_HR
  ? HR_INCIDENT_REQUEST_SECTIONS
  : NONHR_INCIDENT_REQUEST_SECTIONS;

export const SERVICE_REQUEST_SECTIONS = IS_HR
  ? HR_SERVICE_REQUEST_SECTIONS
  : NONHR_SERVICE_REQUEST_SECTIONS;

export const TASK_REQUEST_SECTIONS = IS_HR
  ? HR_TASK_REQUEST_SECTIONS
  : NONHR_TASK_REQUEST_SECTIONS;

// ---------- Details tab (same across HR/non-HR per screenshots — Action History, Notes & Attachments, Approval History, Linked Tasks, Incident History, Linked Incidents) ----------
export const DETAILS_SECTIONS = [
  { key: "actionHistory", title: "Action History", icon: "list" },
  {
    key: "notesAndAttachments",
    title: "Notes & Attachments",
    icon: "description",
  },
  { key: "approvalHistory", title: "Approval History", icon: "shield" },
  { key: "linkedTasks", title: "Linked Tasks", icon: "assignment" },
  { key: "incidentHistory", title: "Incident History", icon: "event" },
  { key: "linkedIncidents", title: "Linked Incidents", icon: "link" },
];

export const TASK_DETAILS_SECTIONS = [
  { key: "actionHistory", title: "Action History", icon: "list" },
  {
    key: "notesAndAttachments",
    title: "Notes & Attachments",
    icon: "description",
  },
  { key: "approvalHistory", title: "Approval History", icon: "shield" },
  { key: "linkedTasks", title: "Linked Tasks", icon: "link" },
  { key: "incidentHistory", title: "Incident History", icon: "event" },
  { key: "linkedIncidents", title: "Linked Incidents", icon: "assignment" },
];
