import { useMemo, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import CommonTable from "../../../../components/common/CommonTable";
import CommonChip from "../../../../components/common/CommonChip";

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

const USER_TEMPLATES = [
  { name: "Rahul Patel", email: "rahul.patel@cargill.com", role: "User", queuesAssigned: 4, status: "Active", lastLogin: "3 hours ago" },
  { name: "Jennifer Garcia", email: "jennifer.garcia@cargill.com", role: "User", queuesAssigned: 3, status: "Active", lastLogin: "5 hours ago" },
  { name: "Michael Chen", email: "michael.chen@cargill.com", role: "User", queuesAssigned: 2, status: "Inactive", lastLogin: "5 days ago" },
];

const MOCK_USERS = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  ...USER_TEMPLATES[index % USER_TEMPLATES.length],
}));

const SupervisorUsersTab = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const paginatedUsers = MOCK_USERS.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns = useMemo(
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
      <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary", mb: 2 }}>
        List of Users
      </Typography>

      <CommonTable
        sx={{ flexGrow: 1, minHeight: 0 }}
        columns={columns}
        rows={paginatedUsers}
        sortable
        emptyMessage="No users assigned yet."
        ariaLabel="Supervisor assigned users"
        pagination={{
          count: MOCK_USERS.length,
          page,
          onPageChange: setPage,
          rowsPerPage,
          onRowsPerPageChange: (value) => {
            setRowsPerPage(value);
            setPage(0);
          },
        }}
      />
    </Box>
  );
};

export default SupervisorUsersTab;
