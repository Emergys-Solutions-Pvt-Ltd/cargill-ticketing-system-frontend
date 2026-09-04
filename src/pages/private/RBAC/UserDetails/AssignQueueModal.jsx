import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import FormSelect from "../../../../components/common/FormSelect";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import { getGroups, getQueues } from "../../../../api/apiRequests";

const MOCK_GROUPS = [
  { groupId: "1", groupName: "HR Support" },
  { groupId: "2", groupName: "HR NA Feedback" },
];

const MOCK_QUEUES = [
  { queueId: "1", queueName: "HR Support Queue" },
  { queueId: "2", queueName: "Payroll Queue" },
];

const AssignQueueModal = ({
  open,
  onClose,
  onAssign,
  superUserId, // the user's "reports to" super user — groups come from their assigned groups
  assignedQueueIds = [],
  loading: assigning = false,
}) => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");

  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [selectedQueues, setSelectedQueues] = useState([]);

  // Step 1 — groups available to this super user
  useEffect(() => {
    if (!open || !superUserId) return;

    let active = true;
    setGroupsLoading(true);
    getGroups({ superUserId: Number(superUserId) })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.groups?.length ? response.data.groups : MOCK_GROUPS;
        setGroupOptions(records.map((record) => ({ label: record.groupName, value: record.groupId })));
      })
      .catch(() => {
        if (!active) return;
        setGroupOptions(MOCK_GROUPS.map((record) => ({ label: record.groupName, value: record.groupId })));
      })
      .finally(() => {
        if (active) setGroupsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, superUserId]);

  // Step 2 — queues within the selected group
  useEffect(() => {
    if (!selectedGroup) {
      setQueueOptions([]);
      return;
    }

    let active = true;
    setQueuesLoading(true);
    getQueues({ groupId: selectedGroup })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.queues?.length ? response.data.queues : MOCK_QUEUES;
        setQueueOptions(
          records
            .map((record) => ({ label: record.queueName, value: record.queueId }))
            .filter((option) => !assignedQueueIds.includes(option.value)),
        );
      })
      .catch(() => {
        if (!active) return;
        setQueueOptions(
          MOCK_QUEUES.map((record) => ({ label: record.queueName, value: record.queueId })).filter(
            (option) => !assignedQueueIds.includes(option.value),
          ),
        );
      })
      .finally(() => {
        if (active) setQueuesLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    setSelectedQueues([]);
  };

  const handleClose = () => {
    setSelectedGroup("");
    setSelectedQueues([]);
    onClose?.();
  };

  const handleAssign = () => {
    const selectedQueueObjs = queueOptions
      .filter((option) => selectedQueues.includes(option.value))
      .map((option) => ({ id: option.value, name: option.label }));
    onAssign?.(selectedQueueObjs);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign Queue"
      onCancel={handleClose}
      onConfirm={handleAssign}
      confirmLabel="Assign"
      confirmColor="success"
      confirmDisabled={selectedQueues.length === 0}
      confirmLoading={assigning}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "260px" }}>
        <FormSelect
          label="Select Group"
          placeholder={groupsLoading ? "Loading groups..." : "Select group"}
          value={selectedGroup}
          onChange={handleGroupChange}
          options={groupOptions}
        />
        <FormMultiSelect
          label="Select Queue to Assign"
          placeholder={
            !selectedGroup
              ? "Select group first"
              : queuesLoading
                ? "Loading queues..."
                : "Select queues"
          }
          value={selectedQueues}
          onChange={setSelectedQueues}
          options={queueOptions}
        />
      </Box>
    </Modal>
  );
};

export default AssignQueueModal;