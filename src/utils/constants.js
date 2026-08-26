import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

export const SERVICE_REQUEST_SECTIONS = [
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

export const SECTION_ICON_MAP = {
  description: DescriptionOutlinedIcon,
  event: EventOutlinedIcon,
  assignment: AssignmentOutlinedIcon,
  shield: ShieldOutlinedIcon,
  link: LinkOutlinedIcon,
  list: ListAltOutlinedIcon,
};

export const DETAILS_SECTIONS = [
  {
    key: "actionHistory",
    title: "Action History",
    icon: "event",
  },
  {
    key: "notesAndAttachments",
    title: "Notes and Attachments",
    icon: "description",
  },
  {
    key: "linkedTasks",
    title: "Linked Tasks",
    icon: "assignment",
  },
  {
    key: "linkedIncidents",
    title: "Linked Incidents",
    icon: "link",
  },
];

export const TASK_DETAILS_SECTIONS = [
  { key: "actionHistory", title: "Action History", icon: "list" },
  {
    key: "notesAndAttachments",
    title: "Notes & Attachments",
    icon: "description",
  },
  // { key: "approvalHistory", title: "Approval History", icon: "shield" }, // backend not returning yet
  { key: "linkedTasks", title: "Linked Tasks", icon: "link" },
  // { key: "incidentHistory", title: "Incident History", icon: "event" }, // backend not returning yet
  { key: "linkedIncidents", title: "Linked Incidents", icon: "assignment" },
];

export const TASK_REQUEST_SECTIONS = [
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
