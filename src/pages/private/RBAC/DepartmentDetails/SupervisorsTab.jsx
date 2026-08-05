import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommonTable from "../../../../components/common/CommonTable";
import CommonChip from "../../../../components/common/CommonChip";
import DeactivateUserModal from "../DeactivateUserModal";
import SearchIcon from "../../../../assets/icons/search.svg";

const AVATAR_COLORS = [
  { bgcolor: "#E0F2FE", color: "#0369A1" },
  { bgcolor: "#EDE9FE", color: "#6D28D9" },
  { bgcolor: "#FFEDD5", color: "#C2410C" },
  { bgcolor: "#CFFAFE", color: "#0E7490" },
  { bgcolor: "#FEE2E2", color: "#DC2626" },
  { bgcolor: "#FCE7F3", color: "#BE185D" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const SUPERVISOR_TEMPLATES = [
  { name: "John Smith", email: "john.smith@cargill.com", usersAssigned: 18, queuesManaged: 5, status: "Active", lastLogin: "1 hour ago" },
  { name: "Sarah Lee", email: "sarah.lee@cargill.com", usersAssigned: 12, queuesManaged: 4, status: "Active", lastLogin: "3 hours ago" },
  { name: "Michael Brown", email: "michael.brown@cargill.com", usersAssigned: 10, queuesManaged: 2, status: "Active", lastLogin: "5 hours ago" },
  { name: "Emily Davis", email: "emily.davis@cargill.com", usersAssigned: 8, queuesManaged: 2, status: "Active", lastLogin: "5 days ago" },
  { name: "David Wilson", email: "david.wilson@cargill.com", usersAssigned: 7, queuesManaged: 3, status: "Active", lastLogin: "1 day ago" },
  { name: "Amanda Lewis", email: "amanda.lewis@cargill.com", usersAssigned: 3, queuesManaged: 1, status: "Active", lastLogin: "4 hours ago" },
];

const MOCK_SUPERVISORS = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  ...SUPERVISOR_TEMPLATES[index % SUPERVISOR_TEMPLATES.length],
}));

const SupervisorRowActions = ({ onView, onRemove }) => {
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
            onView?.();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onRemove?.();
          }}
          sx={{ color: "#F05252" }}
        >
          Deactivate
        </MenuItem>
      </Menu>
    </>
  );
};

const SupervisorsTab = ({ departmentName = "Human Resources", supervisors = null, loading = false }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const supervisorRows = supervisors ?? MOCK_SUPERVISORS;

  const [prevSupervisors, setPrevSupervisors] = useState(supervisors);
  if (supervisors !== prevSupervisors) {
    setPrevSupervisors(supervisors);
    setPage(0);
  }

  const filteredSupervisors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return supervisorRows;
    return supervisorRows.filter(
      (supervisor) =>
        supervisor.name.toLowerCase().includes(query) ||
        supervisor.email.toLowerCase().includes(query),
    );
  }, [search, supervisorRows]);

  const paginatedSupervisors = filteredSupervisors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "SUPERVISOR",
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
      { key: "usersAssigned", label: "USERS ASSIGNED", sortable: false },
      { key: "queuesManaged", label: "QUEUES MANAGED", sortable: false },
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
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
            Supervisors
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            View and manage supervisors in the {departmentName} department.
          </Typography>
        </Box>
        <TextField
          placeholder="Search supervisor by name or email..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: "320px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              height: "2.125rem",
            },
            backgroundColor: "background.paper",
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img src={SearchIcon} alt="" width={16} height={16} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <CommonTable
        sx={{ flexGrow: 1, minHeight: 0 }}
        columns={columns}
        rows={paginatedSupervisors}
        onRowClick={(row) => navigate(`/rbac/users/${row.id}`, { state: { user: { ...row, role: "Supervisor" } } })}
        loading={loading}
        sortable
        emptyMessage="No supervisors to display yet."
        ariaLabel="Department supervisors list"
        actions={(row) => (
          <SupervisorRowActions
            onView={() => navigate(`/rbac/users/${row.id}`, { state: { user: { ...row, role: "Supervisor" } } })}
            onRemove={() => setDeactivateTarget(row)}
          />
        )}
        pagination={{
          count: filteredSupervisors.length,
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
          // TODO: call deactivate supervisor API
          setDeactivateTarget(null);
        }}
        userName={deactivateTarget?.name}
      />
    </Box>
  );
};

export default SupervisorsTab;
