import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import { getGroups, getDepartments, getUsers } from "../../../api/apiRequests";

const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Super User", value: "super_user" },
];

const MOCK_DEPARTMENTS = [
  { departmentId: "1", departmentName: "Human Resources" },
  { departmentId: "2", departmentName: "Finance" },
  { departmentId: "3", departmentName: "Information Technology" },
  { departmentId: "4", departmentName: "Operations" },
  { departmentId: "5", departmentName: "Customer Support" },
];

const MOCK_SUPERUSERS = [
  { userId: "3", userName: "Mike Wilson", roleCode: "SUPERUSER" },
  { userId: "4", userName: "Kevin Brown", roleCode: "SUPERUSER" },
  { userId: "11", userName: "Emma Clark", roleCode: "SUPERUSER" },
  { userId: "12", userName: "Brian Lewis", roleCode: "SUPERUSER" },
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
  reportsTo: "",
  workLocation: "",
  groups: [],
};

const normalizeRole = (role = "") =>
  role.toLowerCase().includes("super") ? "super_user" : "user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{10}$/;

const DEFAULT_ERRORS = { email: "", mobile: "" };

const EDIT_COMPARE_FIELDS = ["role", "name", "email", "mobile", "department", "reportsTo", "workLocation"];

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
    if (form.reportsTo) payload.reportsToUserId = Number(form.reportsTo);
    if (form.groups.length) payload.assignedGroupIds = form.groups.map(Number);
  }

  return payload;
};

// Builds the /v1/rbac/edit-user request body from the modal's internal form state.
// Email/department are locked in edit mode so they're intentionally left out here.
export const buildEditUserPayload = (form, userId) => {
  const payload = {
    userId: Number(userId),
    roleCode: form.role === "super_user" ? "SUPERUSER" : "USER",
    userName: form.name.trim(),
    phoneNo: form.mobile.trim(),
    workLocation: form.workLocation.trim(),
  };

  if (form.role === "user" && form.reportsTo) {
    payload.reportsToUserId = Number(form.reportsTo);
  }

  return payload;
};

const formFromUser = (user) => ({
  role: normalizeRole(user.role),
  name: user.name || "",
  email: user.email || "",
  mobile: user.mobile || user.phoneNo || "",
  department: user.departmentId != null ? String(user.departmentId) : "",
  reportsTo: "",
  workLocation: user.workLocation || "",
  groups: [],
  // "-" and "Unassigned" are the two "no value" placeholders used by the different
  // tables that can pass a `user` row into this modal.
  reportsToName:
    user.reportsTo && user.reportsTo !== "-" && user.reportsTo !== "Unassigned"
      ? user.reportsTo
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
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [reportsToOptions, setReportsToOptions] = useState([]);
  const [reportsToLoading, setReportsToLoading] = useState(false);
  const [errors, setErrors] = useState(DEFAULT_ERRORS);

  useEffect(() => {
    if (!open) return;
    const nextForm = isEditMode
      ? formFromUser(user)
      : { ...DEFAULT_FORM, department: isDepartmentLocked ? String(lockedDepartmentId) : "" };
    setForm(nextForm);
    setInitialForm(isEditMode ? nextForm : null);
    setErrors(DEFAULT_ERRORS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, isDepartmentLocked, lockedDepartmentId]);

  // Department is disabled/locked whenever it can't be changed (edit mode or a
  // locked-department context), so there's no need to hit the API for its options
  // there — the current department's own name/id is already known.
  useEffect(() => {
    if (!open || isEditMode || isDepartmentLocked) return;

    let active = true;
    setDepartmentsLoading(true);
    getDepartments()
      .then((response) => {
        if (!active) return;
        setDepartments(response?.data?.length ? response.data : MOCK_DEPARTMENTS);
      })
      .catch(() => {
        if (!active) return;
        setDepartments(MOCK_DEPARTMENTS);
      })
      .finally(() => {
        if (active) setDepartmentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, isEditMode, isDepartmentLocked]);

  const departmentOptions = isDepartmentLocked
    ? [{ label: lockedDepartmentName, value: String(lockedDepartmentId) }]
    : isEditMode
      ? [{ label: user?.department || "", value: form.department }]
      : departments.map((dept) => ({
          label: dept.departmentName,
          value: dept.departmentId,
        }));

  // "Reports To" only renders for role "user" (Super Users don't report to anyone),
  // so skip fetching it otherwise. Lists this department's Super Users, fetched
  // whenever the selected department changes.
  useEffect(() => {
    if (form.role !== "user" || !form.department) {
      setReportsToOptions([]);
      return;
    }

    let active = true;
    setReportsToLoading(true);
    getUsers({ departmentId: form.department })
      .then((response) => {
        if (!active) return;
        const records = response?.data?.users?.length ? response.data.users : MOCK_SUPERUSERS;
        const superUsers = records.filter((record) => record.roleCode === "SUPERUSER");
        setReportsToOptions(superUsers.map((record) => ({ label: record.userName, value: record.userId })));
      })
      .catch(() => {
        if (!active) return;
        setReportsToOptions(MOCK_SUPERUSERS.map((record) => ({ label: record.userName, value: record.userId })));
      })
      .finally(() => {
        if (active) setReportsToLoading(false);
      });
    return () => {
      active = false;
    };
  }, [form.department, form.role]);

  // Once Reports To options for the pre-filled department are available, resolve
  // the edited user's "reports to" name into the matching option value.
  useEffect(() => {
    if (!isEditMode || !form.reportsToName || form.reportsTo) return;
    const match = reportsToOptions.find((option) => option.label === form.reportsToName);
    if (match) {
      setForm((prev) => ({ ...prev, reportsTo: match.value }));
      setInitialForm((prev) => (prev ? { ...prev, reportsTo: match.value } : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsToOptions, isEditMode]);

  // Assign Group is never rendered in edit mode, or for role "super_user", so
  // skip fetching its options in either case.
  useEffect(() => {
    if (isEditMode || form.role !== "user" || !form.department) {
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
  }, [form.department, form.role, isEditMode]);

  const isFormUnchanged =
    isEditMode && initialForm
      ? EDIT_COMPARE_FIELDS.every((key) => form[key] === initialForm[key])
      : false;

  // Every field is required except Mobile Number — for role "user" that also means
  // Reports To and Assign Group (the two fields only shown for that role).
  const isRequiredFieldsFilled = Boolean(
    form.role &&
      form.name.trim() &&
      form.email.trim() &&
      form.department &&
      (form.role !== "user" || (form.reportsTo && form.groups.length > 0)),
  );

  const isConfirmDisabled = isEditMode ? isFormUnchanged : !isRequiredFieldsFilled;

  const handleClose = () => {
    setForm({ ...DEFAULT_FORM, department: isDepartmentLocked ? String(lockedDepartmentId) : "" });
    setInitialForm(null);
    setErrors(DEFAULT_ERRORS);
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    // Mobile only ever accepts digits, so strip anything else as it's typed rather
    // than waiting for submit-time validation to catch it.
    const value = field === "mobile" ? event.target.value.replace(/\D/g, "") : event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "department" ? { groups: [], reportsTo: "" } : {}),
    }));
    if (field === "email" || field === "mobile") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleGroupsChange = (value) => {
    setForm((prev) => ({ ...prev, groups: value }));
  };

  // Runs before the API call — if either check fails, the errors are shown inline
  // and onSubmit (which triggers the add/edit API call) is never invoked.
  const validate = () => {
    const nextErrors = { ...DEFAULT_ERRORS };

    if (!isEditMode && !EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.mobile.trim() && !MOBILE_REGEX.test(form.mobile.trim())) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.mobile;
  };

  const handleSubmit = () => {
    if (!validate()) return;
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
          error={Boolean(errors.email)}
          helperText={
            errors.email && (
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                {errors.email}
              </Box>
            )
          }
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
          inputProps={{ inputMode: "numeric", maxLength: 10 }}
          error={Boolean(errors.mobile)}
          helperText={
            errors.mobile && (
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                {errors.mobile}
              </Box>
            )
          }
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
          placeholder={departmentsLoading ? "Loading departments..." : "Select department"}
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
          placeholder={
            !form.department
              ? "Select department first"
              : reportsToLoading
                ? "Loading super users..."
                : "Select"
          }
          value={form.reportsTo}
          onChange={handleFieldChange("reportsTo")}
          options={reportsToOptions}
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
