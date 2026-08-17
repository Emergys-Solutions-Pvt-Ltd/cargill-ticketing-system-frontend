import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, CircularProgress } from "@mui/material";

const AVATAR_COLORS = [
  { bgcolor: "#E0F2FE", color: "#0369A1" },
  { bgcolor: "#EDE9FE", color: "#6D28D9" },
  { bgcolor: "#FFEDD5", color: "#C2410C" },
  { bgcolor: "#CFFAFE", color: "#0E7490" },
  { bgcolor: "#FEE2E2", color: "#DC2626" },
  { bgcolor: "#FCE7F3", color: "#BE185D" },
  { bgcolor: "#DBEAFE", color: "#1D4ED8" },
  { bgcolor: "#DCFCE7", color: "#15803D" },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DirectReportItem = ({ report, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 2,
      py: 1.25,
      borderRadius: "8px",
      border: "1px solid",
      borderColor: "divider",
      cursor: "pointer",
      transition: "border-color 0.15s ease, background-color 0.15s ease",
      "&:hover": {
        borderColor: "#1B7F37",
        backgroundColor: "#F3FAF7",
      },
    }}
  >
    <Avatar
      sx={{
        width: 32,
        height: 32,
        fontSize: "0.75rem",
        fontWeight: 600,
        flexShrink: 0,
        ...AVATAR_COLORS[report.id % AVATAR_COLORS.length],
      }}
    >
      {getInitials(report.name)}
    </Avatar>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        {report.name}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          display: "block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {report.email}
      </Typography>
    </Box>
  </Box>
);

// Users who report directly to this Super User. Shown alongside InheritedGroupsCard
// in place of the regular AssignedGroupsCard on the Super User variant of UserDetails.
const DirectReportsCard = ({ reports = [], loading = false }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary", mb: 3, flexShrink: 0 }}>
        Direct Reports ({reports.length})
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : reports.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No direct reports yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flexGrow: 1,
            minHeight: 0,
            maxHeight: 320,
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {reports.map((report) => (
            <DirectReportItem
              key={report.id}
              report={report}
              onClick={() => navigate(`/rbac/users/${report.id}`, { state: { user: report } })}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DirectReportsCard;
