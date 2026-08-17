import { Box, Typography, CircularProgress } from "@mui/material";
import GroupsIcon from "../../../../assets/icons/groups.svg";

const InheritedGroupItem = ({ group, onViewGroup }) => (
  <Box
    onClick={() => onViewGroup?.(group)}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1.5,
      px: 2,
      py: 1.25,
      borderRadius: "8px",
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: "transparent",
      cursor: "pointer",
      transition: "border-color 0.15s ease, background-color 0.15s ease",
      "&:hover": {
        borderColor: "#1B7F37",
        backgroundColor: "#F3FAF7",
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <Box component="img" src={GroupsIcon} alt="" sx={{ width: 28, height: 28, flexShrink: 0 }} />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {group.name}
      </Typography>
    </Box>
    <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", whiteSpace: "nowrap", flexShrink: 0 }}>
      {group.queueCount} queues
    </Typography>
  </Box>
);

// Read-only counterpart to AssignedGroupsCard for Super Users: groups here come from
// department/queue inheritance rather than a direct assignment, so there's no
// Assign/Remove action, just a list that opens ViewGroupModal on click.
const InheritedGroupsCard = ({ groups = [], loading = false, onViewGroup }) => {
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
        Inherited Groups
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : groups.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No inherited groups yet.
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
          {groups.map((group) => (
            <InheritedGroupItem key={group.id} group={group} onViewGroup={onViewGroup} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default InheritedGroupsCard;
