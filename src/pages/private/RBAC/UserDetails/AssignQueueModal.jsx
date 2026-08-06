import { useEffect, useState } from "react";
import Modal from "../../../../components/common/Modal";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import { getQueues } from "../../../../api/apiRequests";

const MOCK_QUEUES = [
  { queueId: "q1", queueName: "HR Support" },
  { queueId: "q2", queueName: "HR NA Feedback" },
  { queueId: "q3", queueName: "HR LA PRY Benefits" },
  { queueId: "q4", queueName: "HR APAC Support" },
  { queueId: "q5", queueName: "HR Payroll Queries" },
];

const AssignQueueModal = ({ open, onClose, onAssign, departmentId, assignedQueueIds = [] }) => {
  const [queueOptions, setQueueOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open || !departmentId) return;

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

  const handleAssign = () => {
    const selectedQueues = queueOptions
      .filter((option) => selected.includes(option.value))
      .map((option) => ({ id: option.value, name: option.label }));
    onAssign?.(selectedQueues);
    setSelected([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign Queue"
      maxWidth="xs"
      onCancel={handleClose}
      onConfirm={handleAssign}
      confirmLabel="Assign"
      confirmColor="success"
      confirmDisabled={selected.length === 0}
    >
      <FormMultiSelect
        label="Queues"
        placeholder={loading ? "Loading queues..." : "Select queues"}
        value={selected}
        onChange={setSelected}
        options={queueOptions}
      />
    </Modal>
  );
};

export default AssignQueueModal;
