import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommonTable from "../../../../components/common/CommonTable";
import CommonChip from "../../../../components/common/CommonChip";
import DeactivateUserModal from "../DeactivateUserModal";
import AddUserModal from "../AddUserModal";
import EditUserModal from "../EditUserModal";
import { toggleUserStatus } from "../../../../api/apiRequests";
import { isActiveStatus } from "../../../../utils/format";

const AVATAR_COLORS = [
  { bgcolor: "#E0F2FE", color: "#0369A1" },
  { bgcolor: "#EDE9FE", color: "#6D28D9" },
  { bgcolor: "#FFEDD5", color: "#C2410C" },
  { bgcolor: "#CFFAFE", color: "#0E7490" },
  { bgcolor: "#FEE2E2", color: "#DC2626" },
  { bgcolor: "#FCE7F3", color: "#BE185D" },
  { bgcolor: "#DBEAFE", color: "#1D4ED8" },
  { bgcolor: "#DCFCE7", color: "#15803D" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const USER_TEMPLATES = [
  { name: "David Miller", email: "david.miller@cargill.com", role: "User", supervisor: "John Smith", queuesAssigned: 5, status: "Active", lastLogin: "2 hours ago" },
  { name: "Alex Johnson", email: "alex.johnson@cargill.com", role: "User", supervisor: "John Smith", queuesAssigned: 4, status: "Active", lastLogin: "1 day ago" },
  { name: "Rahul Patel", email: "rahul.patel@cargill.com", role: "User", supervisor: "Sarah Lee", queuesAssigned: 4, status: "Active", lastLogin: "3 hours ago" },
  { name: "Jennifer Garcia", email: "jennifer.garcia@cargill.com", role: "User", supervisor: "Sarah Lee", queuesAssigned: 3, status: "Active", lastLogin: "5 hours ago" },
  { name: "Michael Chen", email: "michael.chen@cargill.com", role: "User", supervisor: "Sarah Lee", queuesAssigned: 2, status: "Inactive", lastLogin: "5 days ago" },
  { name: "Lisa Anderson", email: "lisa.anderson@cargill.com", role: "User", supervisor: "Michael Brown", queuesAssigned: 2, status: "Active", lastLogin: "4 hours ago" },
];

const MOCK_USERS = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  ...USER_TEMPLATES[index % USER_TEMPLATES.length],
}));

const UserRowActions = ({ onEdit, onToggleStatus, isActive }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit?.();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onToggleStatus?.();
          }}
          sx={{ color: isActive ? "#F05252" : "primary.main" }}
        >
          {isActive ? "Deactivate" : "Activate"}
        </MenuItem>
      </Menu>
    </>
  );
};

const DepartmentUsersTab = ({ users = null, departmentId = null, loading = false }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState({});
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [prevUsers, setPrevUsers] = useState(users);
  if (users !== prevUsers) {
    setPrevUsers(users);
    setPage(0);
    setStatusOverrides({});
  }

  const userRows = (users ?? MOCK_USERS).map((row) =>
    statusOverrides[row.id] ? { ...row, status: statusOverrides[row.id] } : row,
  );

  const paginatedUsers = userRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const applyStatusChange = (row, nextIsActive) => {
    setStatusOverrides((prev) => ({ ...prev, [row.id]: nextIsActive ? "Active" : "Inactive" }));
  };

  const handleToggleStatus = (row) => {
    if (isActiveStatus(row.status)) {
      setDeactivateTarget(row);
      return;
    }

    toggleUserStatus({ userId: row.id, isActive: true }).then(() => applyStatusChange(row, true));
  };

  const userColumns = useMemo(
    () => [
      {
        key: "name",
        label: "USER NAME",
        render: (value, row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.75rem",
                fontWeight: 600,
                ...AVATAR_COLORS[row.id % AVATAR_COLORS.length],
              }}
            >
              {getInitials(value)}
            </Avatar>
            <Typography variant="body2" sx={{ color: "#1C64F2", fontWeight: 500 }}>
              {value}
            </Typography>
          </Box>
        ),
      },
      { key: "email", label: "EMAIL" },
      {
        key: "role",
        label: "ROLE",
        render: (value) => <CommonChip status={value} label={value} />,
      },
      { key: "supervisor", label: "REPORTS TO" },
      {
        key: "queuesAssigned",
        label: "QUEUES ASSIGNED",
        render: (value) => String(value).padStart(2, "0"),
      },
      {
        key: "status",
        label: "STATUS",
        render: (value) => <CommonChip status={value} label={value} />,
      },
      { key: "lastLogin", label: "LAST LOGIN" },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          List of Users
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAddUserOpen(true)}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          Add User
        </Button>
      </Box>

      <CommonTable
        sx={{ flexGrow: 1, minHeight: 0 }}
        columns={userColumns}
        rows={paginatedUsers}
        onRowClick={(row) => navigate(`/rbac/users/${row.id}`, { state: { user: { ...row, departmentId } } })}
        loading={loading}
        sortable
        emptyMessage="No users to display yet."
        ariaLabel="Department user list"
        actions={(row) => (
          <UserRowActions
            isActive={isActiveStatus(row.status)}
            onEdit={() => setEditTarget({ ...row, departmentId })}
            onToggleStatus={() => handleToggleStatus(row)}
          />
        )}
        pagination={{
          count: userRows.length,
          page,
          onPageChange: setPage,
          rowsPerPage,
          onRowsPerPageChange: (value) => {
            setRowsPerPage(value);
            setPage(0);
          },
        }}
      />

      <DeactivateUserModal
        open={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => {
          setStatusUpdating(true);
          toggleUserStatus({ userId: deactivateTarget.id, isActive: false })
            .then(() => applyStatusChange(deactivateTarget, false))
            .finally(() => {
              setStatusUpdating(false);
              setDeactivateTarget(null);
            });
        }}
        userName={deactivateTarget?.name}
        loading={statusUpdating}
      />

      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSubmit={() => {
          // TODO: call add user API
          setAddUserOpen(false);
        }}
      />

      <EditUserModal
        open={Boolean(editTarget)}
        user={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={() => {
          // TODO: call edit user API
          setEditTarget(null);
        }}
      />
    </Box>
  );
};

export default DepartmentUsersTab;
