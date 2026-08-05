import { useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";

const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Supervisor", value: "supervisor" },
  { label: "Department Admin", value: "department_admin" },
];

const DEPARTMENT_OPTIONS = [
  { label: "Human Resources", value: "human_resources" },
  { label: "IT Support", value: "it_support" },
  { label: "Security Operations", value: "security_operations" },
  { label: "IT Infrastructure", value: "it_infrastructure" },
];

const SUPERVISOR_OPTIONS = [
  { label: "John Smith", value: "john_smith" },
  { label: "Sarah Lee", value: "sarah_lee" },
  { label: "Michael Brown", value: "michael_brown" },
  { label: "Emily Davis", value: "emily_davis" },
  { label: "David Wilson", value: "david_wilson" },
  { label: "Amanda Lewis", value: "amanda_lewis" },
];

const QUEUE_OPTIONS = [
  { label: "HR Support", value: "hr_support" },
  { label: "HR NA Feedback", value: "hr_na_feedback" },
  { label: "HR LA PRY Benefits", value: "hr_la_pry_benefits" },
  { label: "HR APAC Support", value: "hr_apac_support" },
  { label: "HR Payroll Queries", value: "hr_payroll_queries" },
];

const DEFAULT_FORM = {
  role: "user",
  name: "",
  email: "",
  mobile: "",
  department: "",
  supervisor: "",
  queues: [],
};

const AddUserModal = ({ open, onClose, onSubmit, loading = false }) => {
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleClose = () => {
    setForm(DEFAULT_FORM);
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleQueuesChange = (value) => {
    setForm((prev) => ({ ...prev, queues: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add New User"
      onCancel={handleClose}
      onConfirm={handleSubmit}
      confirmLabel="Add"
      confirmColor="success"
      confirmLoading={loading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: 3,
            rowGap: 3,
          }}
        >
          <FormSelect
            label="User Role"
            value={form.role}
            onChange={handleFieldChange("role")}
            options={USER_ROLE_OPTIONS}
          />
          <FormTextField
            label="User Name"
            placeholder="Enter user name"
            value={form.name}
            onChange={handleFieldChange("name")}
          />
          <FormTextField
            label="Email"
            placeholder="user@cargill.com"
            value={form.email}
            onChange={handleFieldChange("email")}
          />
          <FormTextField
            label="Mobile Number"
            placeholder="+1 (415) 555-0138"
            value={form.mobile}
            onChange={handleFieldChange("mobile")}
          />
          <FormSelect
            label="Department"
            placeholder="Select department"
            value={form.department}
            onChange={handleFieldChange("department")}
            options={DEPARTMENT_OPTIONS}
          />
          <FormSelect
            label="Supervisor"
            placeholder="Select supervisor"
            value={form.supervisor}
            onChange={handleFieldChange("supervisor")}
            options={SUPERVISOR_OPTIONS}
          />
        </Box>

        <FormMultiSelect
          label="Assign Queue"
          placeholder="Select queues"
          value={form.queues}
          onChange={handleQueuesChange}
          options={QUEUE_OPTIONS}
        />
      </Box>
    </Modal>
  );
};

export default AddUserModal;
