import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

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

const DirectReportItem = ({ report }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 2,
      py: 1.25,
      borderRadius: "8px",
      border: "1px solid",
      borderColor: "divider",
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
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 1.5,
            py: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#E6F4EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonAddAlt1OutlinedIcon sx={{ fontSize: 28, color: "#1B7F37" }} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            No direct reports yet.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", maxWidth: 280 }}>
            This Super User currently has no users reporting to them. Add users to start building
            their reporting team.
          </Typography>
        </Box>
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
            <DirectReportItem key={report.id} report={report} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DirectReportsCard;
