import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Modal from "../../../components/common/Modal";
import FormTextField from "../../../components/common/FormTextField";

const DEFAULT_FORM = {
  name: "",
  description: "",
};

const EditGroupModal = ({ open, onClose, onSubmit, group, loading = false, existingGroupNames = [] }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({ name: group?.name || "", description: group?.description || "" });
    setNameError("");
  }, [open, group]);

  const handleClose = () => {
    setNameError("");
    onClose?.();
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name") setNameError("");
  };

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
      title="Edit Group"
      onCancel={handleClose}
      onConfirm={handleSubmit}
      confirmLabel="Save Changes"
      confirmColor="success"
      confirmLoading={loading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
      </Box>
    </Modal>
  );
};

export default EditGroupModal;
