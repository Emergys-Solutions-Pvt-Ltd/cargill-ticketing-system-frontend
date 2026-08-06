import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import TrashIcon from "../../../../assets/icons/trash.svg";

const AssignedQueuesCard = ({ queues = [], loading = false, onAssignQueue, onRemoveQueue }) => {
  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          Assigned Queues
        </Typography>
        <Box
          onClick={onAssignQueue}
          sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", cursor: "pointer" }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Assign Queue
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : queues.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No queues assigned yet.
          </Typography>
        ) : (
          queues.map((queue) => (
            <Box
              key={queue.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.25,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    backgroundColor: "#DEF7EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LayersOutlinedIcon sx={{ fontSize: 16, color: "#0E9F6E" }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                  {queue.name}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => onRemoveQueue?.(queue)} aria-label={`Remove ${queue.name}`}>
                <img src={TrashIcon} alt="" width={16} height={16} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default AssignedQueuesCard;
