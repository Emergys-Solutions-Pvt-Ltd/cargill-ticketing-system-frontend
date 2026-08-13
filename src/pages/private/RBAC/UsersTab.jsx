import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommonTable from "../../../components/common/CommonTable";
import CommonChip from "../../../components/common/CommonChip";
import DeactivateUserModal from "./DeactivateUserModal";
import AddUserModal from "./AddUserModal";
import { getUsers, toggleUserStatus } from "../../../api/apiRequests";
import { nameFromEmail, formatRelativeTime, isActiveStatus } from "../../../utils/format";

const MOCK_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@cargill.com", role: "Department Admin", reportsTo: "-", department: "Human Resources", departmentId: 1, groupsAssigned: 2, status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Alex Johnson", email: "alex.johnson@cargill.com", role: "Supervisor", reportsTo: "-", department: "Human Resources", departmentId: 1, groupsAssigned: 4, status: "Active", lastLogin: "1 day ago" },
  { id: 3, name: "Rahul Patel", email: "rahul.patel@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 5, status: "Active", lastLogin: "3 hours ago" },
  { id: 4, name: "Jennifer Garcia", email: "jennifer.garcia@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 3, status: "Active", lastLogin: "5 hours ago" },
  { id: 5, name: "Michael Chen", email: "michael.chen@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 3, status: "Inactive", lastLogin: "5 days ago" },
  { id: 6, name: "Priya Sharma", email: "priya.sharma@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 4, status: "Active", lastLogin: "1 day ago" },
  { id: 7, name: "James Wilson", email: "james.wilson@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 2, status: "Active", lastLogin: "2 days ago" },
  { id: 8, name: "Lisa Anderson", email: "lisa.anderson@cargill.com", role: "User", reportsTo: "Alex Johnson", department: "Human Resources", departmentId: 1, groupsAssigned: 4, status: "Active", lastLogin: "4 hours ago" },
];

const mapUser = (record) => ({
  id: record.userId,
  name: record.userName || nameFromEmail(record.email),
  email: record.email,
  role: record.roleName || "User",
  reportsTo: record.reportsToName || "-",
  department: record.departmentName || "Unassigned",
  departmentId: record.departmentId,
  groupsAssigned: record.groupsAssigned ?? 0,
  status: record.isActive ? "Active" : "Inactive",
  lastLogin: formatRelativeTime(record.lastLogin),
});

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

const UsersTab = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState({});
  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getUsers()
      .then((response) => {
        if (!active) return;
        setUsers(response?.data?.users ? response.data.users.map(mapUser) : null);
      })
      .catch(() => {
        if (!active) return;
        setUsers(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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
      { key: "reportsTo", label: "REPORTS TO" },
      { key: "department", label: "DEPARTMENT" },
      { key: "groupsAssigned", label: "GROUPS ASSIGNED" },
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
        onRowClick={(row) => navigate(`/rbac/users/${row.id}`, { state: { user: row } })}
        loading={loading}
        sortable
        emptyMessage="No users to display yet."
        ariaLabel="Access control user list"
        actions={(row) => (
          <UserRowActions
            isActive={isActiveStatus(row.status)}
            onEdit={() => {
              // TODO: wire up edit user
            }}
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
    </Box>
  );
};

export default UsersTab;
