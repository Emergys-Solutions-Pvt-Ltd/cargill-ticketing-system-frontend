import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import Loader from "../../../../components/common/Loader";

const QueueItem = ({ queue, onRemoveQueue }) => (
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
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <Box component="img" src={GroupsIcon} alt="" sx={{ width: 28, height: 28, flexShrink: 0 }} />
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {queue.name}
      </Typography>
    </Box>
    <IconButton size="small" onClick={() => onRemoveQueue?.(queue)}>
      <DeleteOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
    </IconButton>
  </Box>
);

const AssignedQueuesCard = ({ queues = [], loading = false, onAssignQueue, onRemoveQueue }) => {
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          Assigned Queues ({queues.length})
        </Typography>
        <IconButton
          size="small"
          onClick={onAssignQueue}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: "6px", color: "#1B7F37" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Loader size={24} />
        </Box>
      ) : queues.length === 0 ? (
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
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            No queues assigned yet.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", maxWidth: 260 }}>
            Assign queues to this user to get started.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", pr: 0.5 }}>
          {queues.map((queue) => (
            <QueueItem key={queue.id} queue={queue} onRemoveQueue={onRemoveQueue} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AssignedQueuesCard;