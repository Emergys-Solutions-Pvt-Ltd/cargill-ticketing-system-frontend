import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import GroupsIcon from "../../../../assets/icons/groups.svg";
import { getQueues } from "../../../../api/apiRequests";

const MOCK_QUEUES = [
  { queueId: "1", queueName: "HR Support Queue" },
  { queueId: "2", queueName: "Payroll Queue" },
  { queueId: "3", queueName: "Benefits Queue" },
  { queueId: "4", queueName: "Onboarding Queue" },
  { queueId: "5", queueName: "Compliance Queue" },
];

/**
 * Modal to add queues to a specific group.
 * Unlike AssignQueueModal, the group is pre-selected (passed as `group` prop),
 * so there is no group-picker step.
 *
 * Props:
 *  open     – boolean
 *  onClose  – () => void
 *  group    – { id, name } of the target group
 *  userId   – number — used to fetch queues already assigned to this user in the group (shown as pre-ticked)
 *  loading  – boolean — submission in-flight
 *  onAssign – (selectedQueues: { id, name }[]) => void
 */
const AddQueueToGroupModal = ({ open, onClose, group, userId, loading: assigning = false, onAssign }) => {
  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [selectedQueues, setSelectedQueues] = useState([]);
  const [alreadyAssignedIds, setAlreadyAssignedIds] = useState([]);

  // Clear selection and already-assigned list whenever modal closes
  useEffect(() => {
    if (!open) {
      setSelectedQueues([]);
      setAlreadyAssignedIds([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !group?.id) return;

    let active = true;
    setQueuesLoading(true);

    // Run both fetches in parallel:
    // 1. All queues for this group (the full option list)
    // 2. Queues already assigned to this user in this group (to pre-tick and disable)
    Promise.all([
      getQueues({ groupId: Number(group.id) }),
      userId ? getQueues({ groupId: Number(group.id), userId: Number(userId) }) : Promise.resolve(null),
    ])
      .then(([allRes, assignedRes]) => {
        if (!active) return;

        const allRecords = allRes?.data?.length ? allRes.data : MOCK_QUEUES;
        setQueueOptions(
          allRecords.map((r) => ({ label: r.queueName ?? r.name, value: String(r.queueId ?? r.id) }))
        );

        if (assignedRes?.data?.length) {
          setAlreadyAssignedIds(assignedRes.data.map((r) => String(r.queueId ?? r.id)));
        }
      })
      .catch(() => {
        if (!active) return;
        setQueueOptions(MOCK_QUEUES.map((r) => ({ label: r.queueName, value: r.queueId })));
      })
      .finally(() => {
        if (active) setQueuesLoading(false);
      });

    return () => { active = false; };
  }, [open, group?.id, userId]);

  const handleClose = () => {
    setSelectedQueues([]);
    onClose?.();
  };

  const handleAssign = () => {
    const selected = queueOptions
      .filter((o) => selectedQueues.includes(o.value))
      .map((o) => ({ id: o.value, name: o.label }));
    // Parent's onAssign is responsible for closing the modal;
    // selectedQueues will be cleared by the open-change useEffect.
    onAssign?.(selected);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        <>
          Add Queues to Group{" "}
          <Box component="span" sx={{ fontStyle: "italic", fontWeight: 600, color: "text.secondary" }}>
            ({group?.name})
          </Box>
        </>
      }
      onCancel={handleClose}
      onConfirm={handleAssign}
      confirmLabel="Add"
      confirmColor="success"
      confirmDisabled={selectedQueues.length === 0}
      confirmLoading={assigning}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Group badge */}
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
            backgroundColor: "#F3FAF7",
          }}
        >
          <Box component="img" src={GroupsIcon} alt="" sx={{ width: 24, height: 24 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            {group?.name}
          </Typography>
        </Box>

        <Box sx={{ height: "180px" }}>
          <FormMultiSelect
            label="Select Queues to Add"
            placeholder={queuesLoading ? "Loading queues..." : "Select queues"}
            value={selectedQueues}
            onChange={setSelectedQueues}
            options={queueOptions}
            disabledValues={alreadyAssignedIds}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default AddQueueToGroupModal;
