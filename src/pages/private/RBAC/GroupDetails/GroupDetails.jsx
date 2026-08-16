import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BackNavigation from "../../../../components/common/BackNavigation";
import EntityHeaderCard from "../../../../components/common/EntityHeaderCard";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import TrashIcon from "../../../../assets/icons/trash.svg";
import AddQueueModal from "./AddQueueModal";
import DeleteQueueModal from "./DeleteQueueModal";

const DEFAULT_GROUP = {
  name: "Technical Support",
  description: "Handles general customer inquiries and first-level issue resolution.",
  assignedUsers: 62,
};

// TODO: replace with the real "queues in group" API once available
const DEFAULT_QUEUES = [
  { id: 1, name: "HR Support" },
  { id: 2, name: "HR NA Feedback" },
  { id: 3, name: "HR LA PRY Benefits" },
  { id: 4, name: "HR LA PDT Hypercare" },
  { id: 5, name: "HR EMEA Comp & Mobility" },
  { id: 6, name: "HR EMEA Comp & Mobility" },
  { id: 7, name: "HR Finance APAC Reporting" },
  { id: 8, name: "HR Marketing EMEA Brand" },
  { id: 9, name: "HR Engineering NA Platform" },
  { id: 10, name: "HR Sales LATAM Enterprise" },
  { id: 11, name: "HR Legal Global Compliance" },
  { id: 12, name: "HR Product EMEA Growth" },
];

const GroupDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const group = { ...DEFAULT_GROUP, ...(location.state?.group || {}) };
  const [queues, setQueues] = useState(DEFAULT_QUEUES);
  const [addQueueOpen, setAddQueueOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const renderQueueRow = (queue) => (
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
        <Box component="img" src={GroupsIcon} alt="" sx={{ width: 24, height: 24, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
          {queue.name}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={() => setDeleteTarget(queue)}
        aria-label={`Remove ${queue.name}`}
      >
        <img src={TrashIcon} alt="" width={16} height={16} />
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <BackNavigation label="Back to List of Groups" onClick={() => navigate(-1)} />

      <EntityHeaderCard
        icon={GroupsIcon}
        title={group.name}
        description={group.description}
        stats={[
          { label: "Queues", value: queues.length },
          { label: "Assigned to Users", value: group.assignedUsers },
        ]}
      />

      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          minHeight: 0,
          p: 3,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
            Queues ({queues.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setAddQueueOpen(true)}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
          >
            Add Queue
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            columnGap: 2,
            rowGap: 1.5,
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {queues.map((queue) => renderQueueRow(queue))}
        </Box>
      </Box>

      <AddQueueModal
        open={addQueueOpen}
        onClose={() => setAddQueueOpen(false)}
        groupName={group.name}
        departmentId={group.departmentId}
        assignedQueueIds={queues.map((queue) => queue.id)}
        onAdd={(newQueues) => {
          setQueues((prev) => [...prev, ...newQueues]);
          setAddQueueOpen(false);
        }}
      />

      <DeleteQueueModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setQueues((prev) => prev.filter((queue) => queue.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
        queueName={deleteTarget?.name}
      />
    </Box>
  );
};

export default GroupDetails;
