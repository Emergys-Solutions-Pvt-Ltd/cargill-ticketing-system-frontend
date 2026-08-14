import { Box, Typography, IconButton, CircularProgress, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import TrashIcon from "../../../../assets/icons/trash.svg";

const GroupItem = ({ group }) => (
  <Box
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", whiteSpace: "nowrap" }}>
        {group.queueCount} queues
      </Typography>
      <IconButton size="small" aria-label={`Remove ${group.name}`}>
        <img src={TrashIcon} alt="" width={16} height={16} />
      </IconButton>
    </Box>
  </Box>
);

const AssignedGroupsCard = ({ groups = [], loading = false, onAssignGroup }) => {
  const leftColumn = groups.filter((_, index) => index % 2 === 0);
  const rightColumn = groups.filter((_, index) => index % 2 === 1);

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          Assigned Groups
        </Typography>
        <Box
          onClick={onAssignGroup}
          sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", cursor: "pointer" }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Assign Group
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : groups.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No groups assigned yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "stretch", gap: 2 }}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
            {leftColumn.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </Box>

          {rightColumn.length > 0 && (
            <>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "divider" }} />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
                {rightColumn.map((group) => (
                  <GroupItem key={group.id} group={group} />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AssignedGroupsCard;
