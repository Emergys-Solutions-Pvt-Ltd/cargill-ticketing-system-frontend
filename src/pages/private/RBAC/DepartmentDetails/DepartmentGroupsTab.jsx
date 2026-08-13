import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CommonTable from "../../../../components/common/CommonTable";
import SearchIcon from "../../../../assets/icons/search.svg";

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

const truncateCellSx = {
  maxWidth: 320,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const GROUP_TEMPLATES = [
  { name: "Technical Support", description: "Handles general customer inquiries and first-level issue resolution.", queues: 5, assignedUsers: 18 },
  { name: "Escalation Team", description: "Provides technical troubleshooting and advanced issue resolution.", queues: 4, assignedUsers: 12 },
  { name: "Quality Assurance", description: "Manages complex cases escalated from support teams.", queues: 2, assignedUsers: 10 },
  { name: "Operations Team", description: "Reviews service quality and ensures compliance with operational standards.", queues: 2, assignedUsers: 8 },
  { name: "Business Development", description: "Oversees daily operational processes and workflow execution.", queues: 3, assignedUsers: 7 },
  { name: "Sales Operations", description: "Identifies new business opportunities and manages strategic partnerships.", queues: 1, assignedUsers: 3 },
  { name: "Product Management", description: "Leads product strategy, roadmap, and cross-functional coordination.", queues: 3, assignedUsers: 9 },
  { name: "Customer Success", description: "Focuses on customer retention and maximizing product value for clients.", queues: 4, assignedUsers: 11 },
];

const MOCK_GROUPS = GROUP_TEMPLATES.map((template, index) => ({
  id: index + 1,
  ...template,
}));

const DepartmentGroupsTab = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_GROUPS;
    return MOCK_GROUPS.filter((group) => group.name.toLowerCase().includes(query));
  }, [search]);

  const paginatedGroups = filteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "GROUP NAME",
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
      {
        key: "description",
        label: "DESCRIPTION",
        cellSx: truncateCellSx,
      },
      { key: "queues", label: "QUEUES", sortable: false },
      { key: "assignedUsers", label: "ASSIGNED TO USERS", sortable: false },
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
          Groups ({filteredGroups.length})
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder="Search group..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: "260px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
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
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              // TODO: open add group dialog
            }}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, whiteSpace: "nowrap" }}
          >
            Add Group
          </Button>
        </Box>
      </Box>

      <CommonTable
        sx={{ flexGrow: 1, minHeight: 0 }}
        columns={columns}
        rows={paginatedGroups}
        sortable
        emptyMessage="No groups to display yet."
        ariaLabel="Department groups list"
        actions={() => (
          <IconButton
            size="small"
            onClick={() => {
              // TODO: open edit group dialog
            }}
            aria-label="Edit group"
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        pagination={{
          count: filteredGroups.length,
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

export default DepartmentGroupsTab;
