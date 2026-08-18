import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import FormTextField from "../../../../components/common/FormTextField";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import { getQueues } from "../../../../api/apiRequests";

const MOCK_QUEUES = [
  { queueId: "q1", queueName: "HR Support" },
  { queueId: "q2", queueName: "HR NA Feedback" },
  { queueId: "q3", queueName: "HR LA PRY Benefits" },
  { queueId: "q4", queueName: "HR APAC Support" },
  { queueId: "q5", queueName: "HR Payroll Queries" },
];

const AddQueueModal = ({ open, onClose, onAdd, groupName, departmentId, assignedQueueIds = [], loading: adding = false }) => {
  const [queueOptions, setQueueOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    getQueues({ departmentId })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.length ? response.data : MOCK_QUEUES;
        setQueueOptions(
          records
            .map((record) => ({ label: record.queueName, value: record.queueId }))
            .filter((option) => !assignedQueueIds.includes(option.value)),
        );
      })
      .catch(() => {
        if (!active) return;
        setQueueOptions(
          MOCK_QUEUES
            .map((record) => ({ label: record.queueName, value: record.queueId }))
            .filter((option) => !assignedQueueIds.includes(option.value)),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, departmentId]);

  const handleClose = () => {
    setSelected([]);
    onClose?.();
  };

  const handleAdd = () => {
    const selectedQueues = queueOptions
      .filter((option) => selected.includes(option.value))
      .map((option) => ({ id: option.value, name: option.label }));
    onAdd?.(selectedQueues);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Queue to group"
      onCancel={handleClose}
      onConfirm={handleAdd}
      confirmLabel="Add"
      confirmColor="success"
      confirmDisabled={selected.length === 0}
      confirmLoading={adding}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "200px" }}>
        <FormTextField label="Group Name" value={groupName} disabled />
        <FormMultiSelect
          label="Assign Queues"
          placeholder={loading ? "Loading queues..." : "Select queues"}
          value={selected}
          onChange={setSelected}
          options={queueOptions}
        />
      </Box>
    </Modal>
  );
};

export default AddQueueModal;
