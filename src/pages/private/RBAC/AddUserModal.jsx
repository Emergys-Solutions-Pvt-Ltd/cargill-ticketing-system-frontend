import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";
import FormSelect from "../../../components/common/FormSelect";
import FormMultiSelect from "../../../components/common/FormMultiSelect";
import {
  getGroups,
  getDepartments,
  getUsers,
  getQueues,
} from "../../../api/apiRequests";
import { IS_HR } from "../../../utils/constants";

const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Super User", value: "super_user" },
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
  queues: [],
};

const normalizeRole = (role = "") =>
  role.toLowerCase().includes("super") ? "super_user" : "user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{10}$/;

const DEFAULT_ERRORS = { email: "", mobile: "" };

const EDIT_COMPARE_FIELDS = [
  "name",
  "email",
  "mobile",
  "department",
  "reportsTo",
  "workLocation",
];

// Builds the /v1/rbac/add-user request body from the modal's internal form state.
export const buildAddUserPayload = (form) => {
  const payload = {
    roleCode: form.role === "super_user" ? "SUPERUSER" : "USER",
    userName: form.name.trim(),
    email: form.email.trim(),
    phoneNo: form.mobile.trim(),
    departmentId: IS_HR ? 1 : Number(form.department),
  };

  if (form.groups.length) payload.assignedGroupIds = form.groups.map(Number);

  if (form.role === "user") {
    if (form.reportsTo) payload.reportsToUserId = Number(form.reportsTo);
    if (form.queues.length) payload.assignedQueueIds = form.queues.map(Number);
  }

  return payload;
};

// Builds the /v1/rbac/edit-user request body from the modal's internal form state.
// Email/department are locked in edit mode so they're intentionally left out here.
export const buildEditUserPayload = (form, userId) => {
  const payload = {
    userId: Number(userId),
    userName: form.name.trim(),
    phoneNo: form.mobile.trim(),
    workLocation: form.workLocation.trim(),
  };

  if (form.reportsTo) {
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
  queues: [],
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
  const isDepartmentLocked =
    !isEditMode &&
    lockedDepartmentId !== undefined &&
    lockedDepartmentId !== null;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [queueOptions, setQueueOptions] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [reportsToOptions, setReportsToOptions] = useState([]);
  const [reportsToLoading, setReportsToLoading] = useState(false);
  const [errors, setErrors] = useState(DEFAULT_ERRORS);

  useEffect(() => {
    if (!open) return;
    const nextForm = isEditMode
      ? formFromUser(user)
      : {
          ...DEFAULT_FORM,
          department: IS_HR
            ? "1"
            : isDepartmentLocked
              ? String(lockedDepartmentId)
              : "",
        };
    setForm(nextForm);
    setInitialForm(isEditMode ? nextForm : null);
    setErrors(DEFAULT_ERRORS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, isDepartmentLocked, lockedDepartmentId]);

  useEffect(() => {
    if (!open || isEditMode || isDepartmentLocked || IS_HR) return;

    let active = true;

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const response = await getDepartments();
        if (!active) return;
        setDepartments(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        if (active) setDepartments([]);
      } finally {
        if (active) setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
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

  useEffect(() => {
    if (form.role !== "user" || (!IS_HR && !form.department)) {
      setReportsToOptions([]);
      return;
    }

    let active = true;

    const fetchReportsTo = async () => {
      setReportsToLoading(true);
      try {
        const response = await getUsers(
          IS_HR ? {} : { departmentId: form.department },
        );
        if (!active) return;
        const records = response?.data?.users || [];
        const superUsers = records.filter(
          (record) => record.roleCode === "SUPERUSER",
        );
        setReportsToOptions(
          superUsers.map((record) => ({
            label: record.userName,
            value: record.userId,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch reports-to options:", error);
        if (active) setReportsToOptions([]);
      } finally {
        if (active) setReportsToLoading(false);
      }
    };

    fetchReportsTo();
    return () => {
      active = false;
    };
  }, [form.department, form.role]);

  useEffect(() => {
    if (!isEditMode || !form.reportsToName || form.reportsTo) return;
    const match = reportsToOptions.find(
      (option) => option.label === form.reportsToName,
    );
    if (match) {
      setForm((prev) => ({ ...prev, reportsTo: match.value }));
      setInitialForm((prev) =>
        prev ? { ...prev, reportsTo: match.value } : prev,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsToOptions, isEditMode]);

  // Assign Group renders for both "user" and "super_user" roles, never in edit mode.
  // Fetches all groups, unscoped — no longer filtered by Reports To.
  useEffect(() => {
    if (isEditMode) {
      setGroupOptions([]);
      return;
    }
    if (form.role !== "user" && form.role !== "super_user") {
      setGroupOptions([]);
      return;
    }

    let active = true;

    const fetchGroups = async () => {
      setGroupsLoading(true);
      try {
        const response = await getGroups({});
        if (!active) return;
        const records = response?.data?.groups || [];
        setGroupOptions(
          records.map((record) => ({
            label: record.groupName,
            value: String(record.groupId),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        if (active) setGroupOptions([]);
      } finally {
        if (active) setGroupsLoading(false);
      }
    };

    fetchGroups();
    return () => {
      active = false;
    };
  }, [form.role, isEditMode]);

  // Assign Queue only renders for role "user", never in edit mode.
  useEffect(() => {
    if (isEditMode || form.role !== "user" || form.groups.length === 0) {
      setQueueOptions([]);
      return;
    }

    let active = true;

    const fetchQueues = async () => {
      setQueuesLoading(true);
      try {
        const response = await getQueues({ groupIds: form.groups.map(Number) });
        if (!active) return;
        const records = response?.data?.queues || [];
        setQueueOptions(
          records.map((record) => ({
            label: record.queueName,
            value: record.queueId,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch queues:", error);
        if (active) setQueueOptions([]);
      } finally {
        if (active) setQueuesLoading(false);
      }
    };

    fetchQueues();
    return () => {
      active = false;
    };
  }, [form.role, form.groups, isEditMode]);

  const isFormUnchanged =
    isEditMode && initialForm
      ? EDIT_COMPARE_FIELDS.every((key) => form[key] === initialForm[key])
      : false;

  const isRequiredFieldsFilled = Boolean(
    form.role &&
    form.name.trim() &&
    form.email.trim() &&
    (IS_HR || form.department) &&
    (form.role !== "user" ||
      (form.groups.length > 0 && form.queues.length > 0)) &&
    (form.role !== "super_user" || form.groups.length > 0),
  );

  const isConfirmDisabled = isEditMode
    ? isFormUnchanged
    : !isRequiredFieldsFilled;

  const handleClose = () => {
    setForm({
      ...DEFAULT_FORM,
      department: IS_HR
        ? "1"
        : isDepartmentLocked
          ? String(lockedDepartmentId)
          : "",
    });
    setInitialForm(null);
    setErrors(DEFAULT_ERRORS);
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    const value =
      field === "mobile"
        ? event.target.value.replace(/\D/g, "")
        : event.target.value;

    if (field === "role") {
      setForm((prev) => ({
        ...DEFAULT_FORM,
        department: prev.department,
        role: value,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "reportsTo" ? { groups: [], queues: [] } : {}),
    }));
    if (field === "email" || field === "mobile") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleGroupsChange = (value) => {
    console.log(value, "groups selected");

    setForm((prev) => ({
      ...prev,
      groups: Array.isArray(value) ? value : [value],
      queues: [],
    }));
  };

  const handleQueuesChange = (value) => {
    setForm((prev) => ({ ...prev, queues: value }));
  };

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
    ...(isEditMode
      ? []
      : [
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
        ]),
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
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
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
              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "text.secondary",
                }}
              >
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
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                {errors.mobile}
              </Box>
            )
          }
        />
      ),
    },
  ];

  if (form.role && !IS_HR) {
    gridFields.push({
      key: "department",
      node: (
        <FormSelect
          label="Department"
          placeholder={
            departmentsLoading ? "Loading departments..." : "Select department"
          }
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
            !IS_HR && !form.department
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          height: "350px",
          overflowY: "auto",
        }}
      >
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
                gridColumn:
                  isLastFieldFullWidth && index === gridFields.length - 1
                    ? "1 / -1"
                    : "auto",
              }}
            >
              {field.node}
            </Box>
          ))}
        </Box>

        {!isEditMode && form.role === "user" && (
          <FormSelect
            label="Assign Group"
            placeholder={groupsLoading ? "Loading groups..." : "Select group"}
            value={form.groups[0] || ""}
            onChange={(event) => handleGroupsChange(event.target.value)}
            options={groupOptions}
          />
        )}

        {!isEditMode && form.role === "super_user" && (
          <FormMultiSelect
            label="Assign Group"
            placeholder={groupsLoading ? "Loading groups..." : "Select groups"}
            value={form.groups}
            onChange={handleGroupsChange}
            options={groupOptions}
          />
        )}

        {!isEditMode && form.role === "user" && (
          <FormMultiSelect
            label="Assign Queue"
            placeholder={queuesLoading ? "Loading queues..." : "Select queues"}
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
