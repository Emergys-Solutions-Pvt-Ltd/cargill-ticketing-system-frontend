import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import { getQueues, getDepartmentSupervisors } from "../../../api/apiRequests";

const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Supervisor", value: "supervisor" },
  { label: "Department Admin", value: "department_admin" },
];

const MOCK_DEPARTMENT_SUPERVISORS = [
  {
    departmentId: "1",
    departmentName: "Human Resources",
    supervisors: [
      { userId: "3", userName: "Mike Wilson" },
      { userId: "4", userName: "Kevin Brown" },
    ],
  },
  {
    departmentId: "2",
    departmentName: "Finance",
    supervisors: [
      { userId: "11", userName: "Emma Clark" },
      { userId: "12", userName: "Brian Lewis" },
    ],
  },
  {
    departmentId: "3",
    departmentName: "Information Technology",
    supervisors: [
      { userId: "20", userName: "Daniel Scott" },
      { userId: "21", userName: "Peter White" },
    ],
  },
  {
    departmentId: "4",
    departmentName: "Operations",
    supervisors: [
      { userId: "29", userName: "Jason Reed" },
      { userId: "30", userName: "Ryan Cooper" },
    ],
  },
  {
    departmentId: "5",
    departmentName: "Customer Support",
    supervisors: [
      { userId: "38", userName: "Lisa Green" },
      { userId: "39", userName: "Olivia Moore" },
    ],
  },
];

const MOCK_QUEUES = [
  { queueId: "q1", queueName: "HR Support" },
  { queueId: "q2", queueName: "HR NA Feedback" },
  { queueId: "q3", queueName: "HR LA PRY Benefits" },
  { queueId: "q4", queueName: "HR APAC Support" },
  { queueId: "q5", queueName: "HR Payroll Queries" },
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
  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [departmentSupervisors, setDepartmentSupervisors] = useState([]);
  const [supervisorsLoading, setSupervisorsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setSupervisorsLoading(true);
    getDepartmentSupervisors()
      .then((response) => {
        if (!active) return;
        setDepartmentSupervisors(response?.data?.length ? response.data : MOCK_DEPARTMENT_SUPERVISORS);
      })
      .catch(() => {
        if (!active) return;
        setDepartmentSupervisors(MOCK_DEPARTMENT_SUPERVISORS);
      })
      .finally(() => {
        if (active) setSupervisorsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const departmentOptions = departmentSupervisors.map((dept) => ({
    label: dept.departmentName,
    value: dept.departmentId,
  }));

  const selectedDepartment = departmentSupervisors.find(
    (dept) => dept.departmentId === form.department,
  );
  const supervisorOptions = (selectedDepartment?.supervisors || []).map((supervisor) => ({
    label: supervisor.userName,
    value: supervisor.userId,
  }));

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
    setForm(DEFAULT_FORM);
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "department" ? { queues: [], supervisor: "" } : {}),
    }));
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
            placeholder={supervisorsLoading ? "Loading departments..." : "Select department"}
            value={form.department}
            onChange={handleFieldChange("department")}
            options={departmentOptions}
          />
          <FormSelect
            label="Supervisor"
            placeholder={form.department ? "Select supervisor" : "Select department first"}
            value={form.supervisor}
            onChange={handleFieldChange("supervisor")}
            options={supervisorOptions}
          />
        </Box>

        <FormMultiSelect
          label="Assign Queue"
          placeholder={queuesLoading ? "Loading queues..." : "Select queues"}
          value={form.queues}
          onChange={handleQueuesChange}
          options={queueOptions}
        />
      </Box>
    </Modal>
  );
};

export default AddUserModal;
