import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import Loader from "../../../../components/common/Loader";
import { getQueues } from "../../../../api/apiRequests";

const MOCK_GROUP_QUEUES = [
  { id: 1, name: "HR Support" },
  { id: 2, name: "HR NA Feedback" },
  { id: 3, name: "HR LA PRY Benefits" },
  { id: 4, name: "HR LA PDT Hypercare" },
  { id: 5, name: "HR EMEA Comp & Mobility" },
  { id: 6, name: "HR Finance APAC Reporting" },
  { id: 7, name: "HR Marketing EMEA Brand" },
];

const ViewGroupModal = ({ open, onClose, group }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !group?.id) return;

    let active = true;
    setLoading(true);
    getQueues({ groupId: Number(group.id) })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.length ? response.data : MOCK_GROUP_QUEUES;
        setQueues(records.map((record) => ({ id: record.queueId ?? record.id, name: record.queueName ?? record.name })));
      })
      .catch(() => {
        if (!active) return;
        setQueues(MOCK_GROUP_QUEUES);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, group?.id]);

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
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
            maxHeight: 360,
            overflowY: "auto",
            pr: 1,
          }}
        >
          {queues.map((queue) => (
            <Box
              key={queue.id}
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
              <Box component="img" src={GroupsIcon} alt="" sx={{ width: 28, height: 28, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                {queue.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Modal>
  );
};

export default ViewGroupModal;
