import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getStoredTickets } from "../../../utils/rbacData";

const getStatusColor = (status) => {
  const s = status.toLowerCase();
  switch (s) {
    case "new":
    case "open":
      return { bg: "#e6f4ea", text: "#137333", border: "1px solid #ceead6" };
    case "in progress":
      return { bg: "#e8f0fe", text: "#1a73e8", border: "1px solid #d2e3fc" };
    case "pending":
    case "on hold":
      return { bg: "#fef7e0", text: "#b06000", border: "1px solid #feebd0" };
    case "resolved":
      return { bg: "#e2f1e8", text: "#0f9d58", border: "1px solid #c6ecdb" };
    case "closed":
      return { bg: "#f1f3f4", text: "#5f6368", border: "1px solid #dadce0" };
    default:
      return { bg: "#f1f3f4", text: "#5f6368", border: "1px solid #dadce0" };
  }
};

const getPriorityColor = (priority) => {
  const p = priority.toLowerCase();
  switch (p) {
    case "critical":
      return { bg: "rgba(225, 29, 72, 0.15)", text: "#e11d48" };
    case "high":
      return { bg: "rgba(249, 115, 22, 0.15)", text: "#f97316" };
    case "medium":
      return { bg: "rgba(37, 99, 235, 0.15)", text: "#2563eb" };
    case "low":
    default:
      return { bg: "rgba(107, 114, 128, 0.15)", text: "#6b7280" };
  }
};

const RequestList = () => {
  const navigate = useNavigate();
  const [tickets] = useState(() => getStoredTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = tickets.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: "text.primary" }}>
            Service Desk - Open Tickets
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Cargill Incident & Request Tracking Workspace
          </Typography>
        </Box>
      </Box>

      {/* Search & Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by ID, short description, or category..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: '250px',
            maxWidth: '450px',
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
        />
        <FormControl size="small" sx={{ minWidth: '160px' }}>
          <InputLabel id="status-filter-label">Filter Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: "8px" }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="New">New / Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Pending">Pending / On Hold</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table listing */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          backgroundImage: "none"
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="Cargill ticket list">
          <TableHead sx={{ backgroundColor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Short Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>State</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: "text.primary" }}>Assignee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((row) => {
              const statusColors = getStatusColor(row.status);
              const priorityColors = getPriorityColor(row.priority || "Medium");

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: 'pointer',
                    "&:hover": { backgroundColor: "action.hover" }
                  }}
                  onClick={() => navigate(`/requests/${row.id}`)}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280, fontWeight: 600, color: "text.primary", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.title}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.priority || "Medium"}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        borderRadius: '6px',
                        bgcolor: priorityColors.bg,
                        color: priorityColors.text
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: "text.primary", fontWeight: 500 }}>{row.category || "General Support"}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.72rem',
                        borderRadius: '4px',
                        bgcolor: statusColors.bg,
                        color: statusColors.text,
                        border: statusColors.border
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.created}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 500 }}>{row.assignee || "Unassigned"}</TableCell>
                </TableRow>
              );
            })}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    No matching records found in this view.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestList;
