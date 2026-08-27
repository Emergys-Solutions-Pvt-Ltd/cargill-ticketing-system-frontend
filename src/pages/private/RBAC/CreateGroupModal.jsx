import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import InfoIcon from "../../../assets/icons/info.svg";
import { getDepartments, getQueues } from "../../../api/apiRequests";

const MOCK_DEPARTMENTS = [
  { departmentId: 1, departmentName: "Human Resources" },
  { departmentId: 2, departmentName: "IT Support" },
  { departmentId: 3, departmentName: "Security Operations" },
  { departmentId: 4, departmentName: "IT Infrastructure" },
];

const MOCK_QUEUES = [
  { queueId: "q1", queueName: "HR Support" },
  { queueId: "q2", queueName: "HR NA Feedback" },
  { queueId: "q3", queueName: "HR LA PRY Benefits" },
  { queueId: "q4", queueName: "HR APAC Support" },
  { queueId: "q5", queueName: "HR Payroll Queries" },
];

const DEFAULT_FORM = {
  name: "",
  description: "",
  department: "",
  queues: [],
};

// Builds the /v1/rbac/add-group request body from the modal's internal form state.
export const buildCreateGroupPayload = (form) => ({
  groupName: form.name.trim(),
  groupDescription: form.description.trim(),
  departmentId: String(form.department),
  assignedQueueIds: form.queues.map(Number),
});

const CreateGroupModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  existingGroupNames = [],
  lockedDepartmentId,
  lockedDepartmentName,
}) => {
  const isDepartmentLocked = lockedDepartmentId !== undefined && lockedDepartmentId !== null;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [nameError, setNameError] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ ...DEFAULT_FORM, department: isDepartmentLocked ? lockedDepartmentId : "" });
    setNameError("");

    if (isDepartmentLocked) {
      setDepartmentOptions([{ label: lockedDepartmentName, value: lockedDepartmentId }]);
      return;
    }

    let active = true;
    setDepartmentsLoading(true);
    getDepartments()
      .then((response) => {
        if (!active) return;
        const records = response?.data?.length ? response.data : MOCK_DEPARTMENTS;
        setDepartmentOptions(records.map((dept) => ({ label: dept.departmentName, value: dept.departmentId })));
      })
      .catch(() => {
        if (!active) return;
        setDepartmentOptions(MOCK_DEPARTMENTS.map((dept) => ({ label: dept.departmentName, value: dept.departmentId })));
      })
      .finally(() => {
        if (active) setDepartmentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, isDepartmentLocked, lockedDepartmentId, lockedDepartmentName]);

  useEffect(() => {
    if (!form.department) {
      setQueueOptions([]);
      return;
    }

    let active = true;
    setQueuesLoading(true);
    getQueues({ departmentId: form.department })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.length ? response.data : MOCK_QUEUES;
        setQueueOptions(records.map((record) => ({ label: record.queueName, value: record.queueId })));
      })
      .catch(() => {
        if (!active) return;
        setQueueOptions(MOCK_QUEUES.map((record) => ({ label: record.queueName, value: record.queueId })));
      })
      .finally(() => {
        if (active) setQueuesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [form.department]);

  const handleClose = () => {
    setForm({ ...DEFAULT_FORM, department: isDepartmentLocked ? lockedDepartmentId : "" });
    setNameError("");
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "department" ? { queues: [] } : {}),
    }));
    if (field === "name") setNameError("");
  };

  const handleQueuesChange = (value) => {
    setForm((prev) => ({ ...prev, queues: value }));
  };

  const isRequiredFieldsFilled = Boolean(
    form.name.trim() && form.description.trim() && form.department && form.queues.length > 0,
  );

  const handleSubmit = () => {
    const isDuplicate = existingGroupNames.some(
      (name) => name.trim().toLowerCase() === form.name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setNameError("This group name is already in use. Please enter a different name.");
      return;
    }
    onSubmit?.(form);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Group"
      onCancel={handleClose}
      onConfirm={handleSubmit}
      confirmLabel="Create"
      confirmColor="success"
      confirmDisabled={!isRequiredFieldsFilled}
      confirmLoading={loading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 1.5,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "#FF5A1F",
            backgroundColor: "#FFF8F1",
          }}
        >
          <Box component="img" src={InfoIcon} alt="" sx={{ width: 20, height: 20, flexShrink: 0, mt: 0.25 }} />
          <Typography variant="body2" sx={{ color: "#CA6500" }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Note:
            </Box>{" "}
            <Box component="span" sx={{ fontWeight: 500 }}>
              Once a group is created, it cannot be deleted. Please make sure the group details are
              correct before creating it.
            </Box>
          </Typography>
        </Box>

        <FormTextField
          label="Group Name"
          placeholder="Enter"
          value={form.name}
          onChange={handleFieldChange("name")}
          error={Boolean(nameError)}
          helperText={
            nameError && (
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                {nameError}
              </Box>
            )
          }
        />
        <FormTextField
          label="Description"
          placeholder="Enter"
          value={form.description}
          onChange={handleFieldChange("description")}
        />
        <FormSelect
          label="Department"
          placeholder={departmentsLoading ? "Loading departments..." : "Select department"}
          value={form.department}
          onChange={handleFieldChange("department")}
          options={departmentOptions}
          disabled={isDepartmentLocked}
        />
        <FormMultiSelect
          label="Assign Queues"
          placeholder={queuesLoading ? "Loading queues..." : "Select queues"}
          value={form.queues}
          onChange={handleQueuesChange}
          options={queueOptions}
        />
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
