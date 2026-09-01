import { Tab, Tabs } from "@mui/material";
import { IS_HR } from "../../utils/constants"; // adjust path to match actual constants.js location

const HR_TAB_CONFIG = {
  Service: ["Service Request Form", "Details", "Submitted Form"],
  Incident: ["Incident Form", "Details"],
  Task: ["Task Form", "Details"],
};

const NONHR_TAB_CONFIG = {
  Service: ["Service Request Form", "Details", "Submitted Form", "SLA"],
  Incident: ["Incident Form", "Details", "SLA"],
  Task: ["Task Form", "Details"],
};

const tabConfig = IS_HR ? HR_TAB_CONFIG : NONHR_TAB_CONFIG;

const RequestTabsNav = ({ ticketType = "Service", value, onChange }) => {
  const labels = tabConfig[ticketType] || tabConfig.Service;

  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        minHeight: 48,
        borderBottom: "1px solid #e5e7eb",
        "& .MuiTabs-indicator": {
          backgroundColor: "#16834b",
          height: 2,
        },
        "& .MuiTab-root": {
          minHeight: 48,
          height: 48,
          minWidth: "auto",
          px: 1.5,
          py: 0,
          textTransform: "none",
          fontSize: "14px",
          fontWeight: 400,
          color: "#6b7280",
        },
        "& .Mui-selected": {
          color: "#00843D !important",
          fontWeight: 600,
        },
        bgcolor: "#F8F8F8",
      }}
    >
      {labels.map((label) => (
        <Tab key={label} label={label} />
      ))}
    </Tabs>
  );
};

export default RequestTabsNav;
