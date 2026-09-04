import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import TrashIcon from "../../../../assets/icons/trash.svg";
import Loader from "../../../../components/common/Loader";
import { getQueues, removeQueuesFromUser } from "../../../../api/apiRequests";

const ViewGroupModal = ({ open, onClose, group, userId, onRemoveQueue }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!open || !group?.id) return;

    let active = true;

    const fetchQueues = async () => {
      setLoading(true);
      try {
        const response = await getQueues({ groupId: Number(group.id) });
        if (!active) return;
        const records = response?.data || [];
        setQueues(
          records.map((record) => ({
            id: record.queueId ?? record.id,
            name: record.queueName ?? record.name,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch group queues:", error);
        if (active) setQueues([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQueues();
    return () => {
      active = false;
    };
  }, [open, group?.id]);

  const handleRemoveQueue = async (queue) => {
    setRemovingId(queue.id);
    try {
      await removeQueuesFromUser({
        userId: Number(userId),
        queueIds: [Number(queue.id)],
      });
      setQueues((prev) => prev.filter((q) => q.id !== queue.id));
      // Notify parent so it can sync its own state if needed
      onRemoveQueue?.(queue);
    } catch (error) {
      console.error("Failed to remove queue:", error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          View Group{" "}
          <Box component="span" sx={{ fontStyle: "italic", fontWeight: 600, color: "text.secondary" }}>
            ({group?.name})
          </Box>
        </>
      }
      maxWidth="sm"
      footer={
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "4px",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          Close
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Loader size={24} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            maxHeight: 360,
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {queues.map((queue) => (
            <Box
              key={queue.id}
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
                  sx={{ fontWeight: 500, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {queue.name}
                </Typography>
              </Box>

              {onRemoveQueue && (
                <IconButton
                  size="small"
                  disabled={removingId === queue.id}
                  onClick={() => handleRemoveQueue(queue)}
                  aria-label={`Remove ${queue.name}`}
                  sx={{ flexShrink: 0 }}
                >
                  {removingId === queue.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <img src={TrashIcon} alt="" width={16} height={16} />
                  )}
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Modal>
  );
};

export default ViewGroupModal;