import { Tab, Tabs } from "@mui/material";

const tabConfig = {
  Service: ["Service Request Form", "Details", "Submitted Form"],
  Incident: ["Incident Form", "Details"],
  Tsk: ["Task Form", "Details"],
};

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