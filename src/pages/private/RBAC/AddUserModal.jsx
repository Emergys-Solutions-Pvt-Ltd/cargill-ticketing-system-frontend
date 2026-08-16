import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import { getQueues, getDepartmentSupervisors } from "../../../api/apiRequests";

const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Super User", value: "super_user" },
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
  role: "",
  name: "",
  email: "",
  mobile: "",
  department: "",
  supervisor: "",
  workLocation: "",
  queues: [],
};

const normalizeRole = (role = "") =>
  role.toLowerCase().includes("super") ? "super_user" : "user";

const EDIT_COMPARE_FIELDS = ["role", "name", "email", "mobile", "department", "supervisor", "workLocation"];

const formFromUser = (user) => ({
  role: normalizeRole(user.role),
  name: user.name || "",
  email: user.email || "",
  mobile: user.mobile || user.phoneNo || "",
  department: user.departmentId != null ? String(user.departmentId) : "",
  supervisor: "",
  workLocation: user.workLocation || "",
  queues: [],
  reportsToName:
    user.reportsTo && user.reportsTo !== "-"
      ? user.reportsTo
      : user.supervisor && user.supervisor !== "Unassigned"
        ? user.supervisor
        : "",
});

const AddUserModal = ({ open, onClose, onSubmit, user, loading = false }) => {
  const isEditMode = Boolean(user);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState(null);
  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [departmentSupervisors, setDepartmentSupervisors] = useState([]);
  const [supervisorsLoading, setSupervisorsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const nextForm = isEditMode ? formFromUser(user) : DEFAULT_FORM;
    setForm(nextForm);
    setInitialForm(isEditMode ? nextForm : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

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

  // Once supervisor options for the pre-filled department are available, resolve
  // the edited user's "reports to" name into the matching option value.
  useEffect(() => {
    if (!isEditMode || !form.reportsToName || form.supervisor) return;
    const match = supervisorOptions.find((option) => option.label === form.reportsToName);
    if (match) {
      setForm((prev) => ({ ...prev, supervisor: match.value }));
      setInitialForm((prev) => (prev ? { ...prev, supervisor: match.value } : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisorOptions, isEditMode]);

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

  const isFormUnchanged =
    isEditMode && initialForm
      ? EDIT_COMPARE_FIELDS.every((key) => form[key] === initialForm[key])
      : false;

  const handleClose = () => {
    setForm(DEFAULT_FORM);
    setInitialForm(null);
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

  const gridFields = [
    {
      key: "role",
      node: (
        <FormSelect
          label="User Role"
          value={form.role}
          onChange={handleFieldChange("role")}
          options={USER_ROLE_OPTIONS}
        />
      ),
    },
    {
      key: "name",
      node: (
        <FormTextField
          label="User Name"
          placeholder="Enter"
          value={form.name}
          onChange={handleFieldChange("name")}
        />
      ),
    },
    {
      key: "email",
      node: (
        <FormTextField
          label="Email"
          placeholder="Enter"
          value={form.email}
          onChange={handleFieldChange("email")}
          disabled={isEditMode}
        />
      ),
    },
    {
      key: "mobile",
      node: (
        <FormTextField
          label={
            <>
              Mobile Number{" "}
              <Box component="span" sx={{ fontStyle: "italic", fontWeight: 400, color: "text.secondary" }}>
                (optional)
              </Box>
            </>
          }
          placeholder="Enter"
          value={form.mobile}
          onChange={handleFieldChange("mobile")}
        />
      ),
    },
  ];

  if (form.role) {
    gridFields.push({
      key: "department",
      node: (
        <FormSelect
          label="Department"
          placeholder={supervisorsLoading ? "Loading departments..." : "Select department"}
          value={form.department}
          onChange={handleFieldChange("department")}
          options={departmentOptions}
          disabled={isEditMode}
        />
      ),
    });
  }

  if (form.role === "user") {
    gridFields.push({
      key: "reportsTo",
      node: (
        <FormSelect
          label="Reports To"
          placeholder={form.department ? "Select" : "Select department first"}
          value={form.supervisor}
          onChange={handleFieldChange("supervisor")}
          options={supervisorOptions}
        />
      ),
    });
  }

  if (isEditMode) {
    gridFields.push({
      key: "workLocation",
      node: (
        <FormTextField
          label="Work Location"
          placeholder="Enter"
          value={form.workLocation}
          onChange={handleFieldChange("workLocation")}
        />
      ),
    });
  }

  const isLastFieldFullWidth = gridFields.length % 2 !== 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit User" : "Add New User"}
      onCancel={handleClose}
      onConfirm={handleSubmit}
      confirmLabel={isEditMode ? "Save Changes" : "Add"}
      confirmColor="success"
      confirmDisabled={isFormUnchanged}
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
          {gridFields.map((field, index) => (
            <Box
              key={field.key}
              sx={{
                gridColumn: isLastFieldFullWidth && index === gridFields.length - 1 ? "1 / -1" : "auto",
              }}
            >
              {field.node}
            </Box>
          ))}
        </Box>

        {!isEditMode && form.role === "user" && (
          <FormMultiSelect
            label="Assign Group"
            placeholder={queuesLoading ? "Loading groups..." : "Select groups"}
            value={form.queues}
            onChange={handleQueuesChange}
            options={queueOptions}
          />
        )}
      </Box>
    </Modal>
  );
};

export default AddUserModal;
