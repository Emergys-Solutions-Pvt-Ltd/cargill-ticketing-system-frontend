import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import { getGroups, getDepartmentSupervisors } from "../../../api/apiRequests";

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

const MOCK_GROUPS_FOR_ASSIGNMENT = [
  { groupId: "1", groupName: "HR Support" },
  { groupId: "2", groupName: "HR NA Feedback" },
  { groupId: "3", groupName: "HR LA PRY Benefits" },
  { groupId: "4", groupName: "HR APAC Support" },
  { groupId: "5", groupName: "HR Payroll Queries" },
];

const DEFAULT_FORM = {
  role: "",
  name: "",
  email: "",
  mobile: "",
  department: "",
  supervisor: "",
  workLocation: "",
  groups: [],
};

const normalizeRole = (role = "") =>
  role.toLowerCase().includes("super") ? "super_user" : "user";

const EDIT_COMPARE_FIELDS = ["role", "name", "email", "mobile", "department", "supervisor", "workLocation"];

// Builds the /v1/rbac/add-user request body from the modal's internal form state.
export const buildAddUserPayload = (form) => {
  const payload = {
    roleCode: form.role === "super_user" ? "SUPERUSER" : "USER",
    userName: form.name.trim(),
    email: form.email.trim(),
    phoneNo: form.mobile.trim(),
    departmentId: Number(form.department),
  };

  if (form.role === "user") {
    if (form.supervisor) payload.reportsToUserId = Number(form.supervisor);
    if (form.groups.length) payload.assignedGroupIds = form.groups.map(Number);
  }

  return payload;
};

const formFromUser = (user) => ({
  role: normalizeRole(user.role),
  name: user.name || "",
  email: user.email || "",
  mobile: user.mobile || user.phoneNo || "",
  department: user.departmentId != null ? String(user.departmentId) : "",
  supervisor: "",
  workLocation: user.workLocation || "",
  groups: [],
  reportsToName:
    user.reportsTo && user.reportsTo !== "-"
      ? user.reportsTo
      : user.supervisor && user.supervisor !== "Unassigned"
        ? user.supervisor
        : "",
});

const AddUserModal = ({
  open,
  onClose,
  onSubmit,
  user,
  loading = false,
  lockedDepartmentId,
  lockedDepartmentName,
}) => {
  const isEditMode = Boolean(user);
  const isDepartmentLocked = !isEditMode && lockedDepartmentId !== undefined && lockedDepartmentId !== null;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [departmentSupervisors, setDepartmentSupervisors] = useState([]);
  const [supervisorsLoading, setSupervisorsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const nextForm = isEditMode
      ? formFromUser(user)
      : { ...DEFAULT_FORM, department: isDepartmentLocked ? String(lockedDepartmentId) : "" };
    setForm(nextForm);
    setInitialForm(isEditMode ? nextForm : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, isDepartmentLocked, lockedDepartmentId]);

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

  const departmentOptions = isDepartmentLocked
    ? [{ label: lockedDepartmentName, value: String(lockedDepartmentId) }]
    : departmentSupervisors.map((dept) => ({
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
      setGroupOptions([]);
      return;
    }

    let active = true;
    setGroupsLoading(true);
    getGroups({ departmentId: form.department })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.groups?.length ? response.data.groups : MOCK_GROUPS_FOR_ASSIGNMENT;
        setGroupOptions(records.map((record) => ({ label: record.groupName, value: record.groupId })));
      })
      .catch(() => {
        if (!active) return;
        setGroupOptions(MOCK_GROUPS_FOR_ASSIGNMENT.map((record) => ({ label: record.groupName, value: record.groupId })));
      })
      .finally(() => {
        if (active) setGroupsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [form.department]);

  const isFormUnchanged =
    isEditMode && initialForm
      ? EDIT_COMPARE_FIELDS.every((key) => form[key] === initialForm[key])
      : false;

  const isRequiredFieldsFilled = Boolean(
    form.role && form.name.trim() && form.email.trim() && form.department,
  );

  const isConfirmDisabled = isEditMode ? isFormUnchanged : !isRequiredFieldsFilled;

  const handleClose = () => {
    setForm({ ...DEFAULT_FORM, department: isDepartmentLocked ? String(lockedDepartmentId) : "" });
    setInitialForm(null);
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "department" ? { groups: [], supervisor: "" } : {}),
    }));
  };

  const handleGroupsChange = (value) => {
    setForm((prev) => ({ ...prev, groups: value }));
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
          disabled={isEditMode || isDepartmentLocked}
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
      confirmDisabled={isConfirmDisabled}
      confirmLoading={loading}
      confirmButtonSx={isEditMode ? { width: "150px" } : undefined}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "350px", overflowY: "auto" }}>
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
            placeholder={groupsLoading ? "Loading groups..." : "Select groups"}
            value={form.groups}
            onChange={handleGroupsChange}
            options={groupOptions}
          />
        )}
      </Box>
    </Modal>
  );
};

export default AddUserModal;
