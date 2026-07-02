import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getStoredTickets,
  getStoredTicketsAsync,
} from "../../../utils/rbacData";

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
      return { bg: "rgba(225, 29, 72, 0.15)", text: "#e11d48", dot: "#e11d48" };
    case "high":
      return {
        bg: "rgba(249, 115, 22, 0.15)",
        text: "#f97316",
        dot: "#ef4444",
      };
    case "medium":
      return { bg: "rgba(37, 99, 235, 0.15)", text: "#2563eb", dot: "#f59e0b" };
    case "low":
    default:
      return {
        bg: "rgba(107, 114, 128, 0.15)",
        text: "#6b7280",
        dot: "#10b981",
      };
  }
};

const RequestList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  useEffect(() => {
    if (tickets.length === 0) {
      getStoredTicketsAsync().then((fetchedTickets) => {
        setTickets(fetchedTickets);
      });
    }
  }, [tickets]);

  const filteredRequests = tickets.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      row.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}
          >
            Requests
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 400, fontSize: "13px" }}
          >
            Search, view and stay informed about your requests and their current
            status.
          </Typography>
        </Box>
      </Box>

      {/* Search & Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search by ID, short description, or category"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            maxWidth: "450px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            backgroundColor: "background.paper",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Status
          </Typography>

          <FormControl
            size="small"
            sx={{ minWidth: 160, backgroundColor: "background.paper" }}
          >
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{
                height: 36,
                fontSize: "13px",
                borderRadius: "6px",
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="New">New / Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Pending">Pending / On Hold</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table listing */}
      <Box>
        <Table
          sx={{
            minWidth: 650,
            borderCollapse: "separate",
            borderSpacing: "0 8px",
          }}
          aria-label="Cargill ticket list"
        >
          <TableHead>
            <TableRow>
              {[
                "TICKET ID",
                "SHORT DESCRIPTION",
                "PRIORITY",
                "CATEGORY",
                "STATE",
                "CREATED",
                "ASSIGNEE",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    border: "none",
                    py: 1,
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((row) => {
              const statusColors = getStatusColor(row.status);
              const priorityColors = getPriorityColor(row.priority || "Medium");

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "background.paper",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                    "& > td, & > th": {
                      border: "none",
                      py: 2,
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                    "& > td:first-of-type, & > th:first-of-type": {
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                      borderLeft: "1px solid",
                      borderColor: "divider",
                    },
                    "& > td:last-of-type": {
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                      borderRight: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                  onClick={() => navigate(`/requests/${row.id}`)}
                >
                  <TableCell sx={{ color: "#1C64F2" }}>
                    {row.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 280,
                      fontWeight: 500,
                      color: "text.primary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.title}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: priorityColors.dot,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.priority || "Medium"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "0.85rem",
                      color: "text.primary",
                      fontWeight: 500,
                    }}
                  >
                    {row.category || "General Support"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.72rem",
                        borderRadius: "50px",
                        bgcolor: statusColors.bg,
                        color: statusColors.text,
                        border: statusColors.border,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.primary", fontSize: "0.85rem" }}
                  >
                    {row.created}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {row.assignee || "Unassigned"}
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, border: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    No matching records found in this view.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {`${page * rowsPerPage + 1} - ${Math.min(
            (page + 1) * rowsPerPage,
            filteredRequests.length,
          )} of ${filteredRequests.length} items`}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            sx={{ textTransform: "none" }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              setPage((p) =>
                (p + 1) * rowsPerPage < filteredRequests.length ? p + 1 : p,
              )
            }
            disabled={(page + 1) * rowsPerPage >= filteredRequests.length}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default RequestList;
