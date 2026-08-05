import { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import FormTextField from "../../../../components/common/FormTextField";
import SearchIcon from "../../../../assets/icons/search.svg";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ChangeDepartmentAdminModal = ({
  open,
  onClose,
  onConfirm,
  currentAdmin,
  loading = false,
}) => {
  const [search, setSearch] = useState("");

  const handleClose = () => {
    setSearch("");
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.(search);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Department Admin"
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel="Change Admin"
      confirmColor="success"
      confirmDisabled={!search.trim()}
      confirmLoading={loading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2,
            borderRadius: "8px",
            border: "1px solid #DDD6FE",
            backgroundColor: "#F5F3FF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: "#EDE9FE",
                color: "#6D28D9",
              }}
            >
              {getInitials(currentAdmin?.name)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
                {currentAdmin?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {currentAdmin?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
              Current Role
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
              {currentAdmin?.role || "Department Admin"}
            </Typography>
          </Box>
        </Box>

        <FormTextField
          label="New Department Admin"
          required
          placeholder="Search by name or email"
          icon={SearchIcon}
          iconPosition="end"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
    </Modal>
  );
};

export default ChangeDepartmentAdminModal;
