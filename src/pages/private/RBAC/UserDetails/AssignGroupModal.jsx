import { useEffect, useState } from "react";
import Modal from "../../../../components/common/Modal";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import { getQueues } from "../../../../api/apiRequests";

const MOCK_GROUPS = [
  { queueId: "q1", queueName: "HR Support" },
  { queueId: "q2", queueName: "HR NA Feedback" },
  { queueId: "q3", queueName: "HR LA PRY Benefits" },
  { queueId: "q4", queueName: "HR APAC Support" },
  { queueId: "q5", queueName: "HR Payroll Queries" },
];

const AssignGroupModal = ({ open, onClose, onAssign, departmentId, assignedGroupIds = [] }) => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open || !departmentId) return;

    let active = true;
    setLoading(true);
    getQueues({ departmentId })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.length ? response.data : MOCK_GROUPS;
        setGroupOptions(
          records
            .map((record) => ({ label: record.queueName, value: record.queueId }))
            .filter((option) => !assignedGroupIds.includes(option.value)),
        );
      })
      .catch(() => {
        if (!active) return;
        setGroupOptions(
          MOCK_GROUPS
            .map((record) => ({ label: record.queueName, value: record.queueId }))
            .filter((option) => !assignedGroupIds.includes(option.value)),
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
    const selectedGroups = groupOptions
      .filter((option) => selected.includes(option.value))
      .map((option) => ({ id: option.value, name: option.label, queueCount: 0 }));
    onAssign?.(selectedGroups);
    setSelected([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign Group"
      maxWidth="xs"
      onCancel={handleClose}
      onConfirm={handleAssign}
      confirmLabel="Assign"
      confirmColor="success"
      confirmDisabled={selected.length === 0}
    >
      <FormMultiSelect
        label="Select Group to Assign"
        placeholder={loading ? "Loading groups..." : "Select groups"}
        value={selected}
        onChange={setSelected}
        options={groupOptions}
      />
    </Modal>
  );
};

export default AssignGroupModal;
