import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import FormMultiSelect from "../../../../components/common/FormMultiSelect";
import { getGroups } from "../../../../api/apiRequests";
import { IS_HR } from "../../../../utils/constants";

const MOCK_GROUPS = [
  { groupId: "1", groupName: "HR Support", queuesAssigned: 3 },
  { groupId: "2", groupName: "HR NA Feedback", queuesAssigned: 2 },
  { groupId: "3", groupName: "HR LA PRY Benefits", queuesAssigned: 4 },
  { groupId: "4", groupName: "HR APAC Support", queuesAssigned: 3 },
  { groupId: "5", groupName: "HR Payroll Queries", queuesAssigned: 1 },
];

const AssignGroupModal = ({
  open,
  onClose,
  onAssign,
  departmentId,
  assignedGroupIds = [],
  loading: assigning = false,
}) => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const effectiveDepartmentId = IS_HR ? 1 : departmentId;

  useEffect(() => {
    if (!open || (!IS_HR && !effectiveDepartmentId)) return;

    let active = true;
    setLoading(true);
    getGroups({ departmentId: effectiveDepartmentId })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.groups?.length
          ? response.data.groups
          : MOCK_GROUPS;
        setGroupOptions(
          records
            .map((record) => ({
              label: record.groupName,
              value: record.groupId,
              queueCount: record.queuesAssigned ?? 0,
            }))
            .filter((option) => !assignedGroupIds.includes(option.value)),
        );
      })
      .catch(() => {
        if (!active) return;
        setGroupOptions(
          MOCK_GROUPS.map((record) => ({
            label: record.groupName,
            value: record.groupId,
            queueCount: record.queuesAssigned ?? 0,
          })).filter((option) => !assignedGroupIds.includes(option.value)),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, effectiveDepartmentId]);

  const handleClose = () => {
    setSelected([]);
    onClose?.();
  };

  const handleAssign = () => {
    const selectedGroups = groupOptions
      .filter((option) => selected.includes(option.value))
      .map((option) => ({
        id: option.value,
        name: option.label,
        queueCount: option.queueCount,
      }));
    onAssign?.(selectedGroups);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign Group"
      onCancel={handleClose}
      onConfirm={handleAssign}
      confirmLabel="Assign"
      confirmColor="success"
      confirmDisabled={selected.length === 0}
      confirmLoading={assigning}
    >
      <Box sx={{ height: "200px" }}>
        <FormMultiSelect
          label="Select Group to Assign"
          placeholder={loading ? "Loading groups..." : "Select groups"}
          value={selected}
          onChange={setSelected}
          options={groupOptions}
        />
      </Box>
    </Modal>
  );
};

export default AssignGroupModal;
