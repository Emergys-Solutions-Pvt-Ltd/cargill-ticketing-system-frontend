import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getStoredTickets,
  getStoredTicketsAsync,
} from "../../../utils/rbacData";
import SearchIcon from "../../../../src/assets/icons/search.svg";
import FilterIcon from "../../../../src/assets/icons/filter.svg";

const getStatusColor = (status) => {
  const s = status.toLowerCase();
  switch (s) {
    case "in progress":
      return { bg: "#E1EFFE", text: "#3B82F6", border: "1px solid #C3DDFD" };
    case "pending":
    case "on hold":
      return { bg: "#FEECDC", text: "#C97601", border: "1px solid #FCD9BD" };
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
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                fontSize: "13px",
              }}
            >
              Search, view and stay informed about your requests and their
              current status.
            </Typography>
          </Box>
        </Box>

        {/* Search & Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: "450px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
              },
              backgroundColor: "background.paper",
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="Search" width={16} height={16} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box
            sx={{
              height: "2.125rem",
              backgroundColor: "background.paper",
              borderRadius: "4px",
              border: "1px solid #D1D5DB",
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="img" src={FilterIcon} alt="Filter" />
            <Typography variant="body2">Filter</Typography>
          </Box>
        </Box>
      </Box>

      {/* Table listing */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: "8px",
          border: "1px solid #D1D5DB",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #E5E7EB",
            },
          }}
          aria-label="Cargill ticket list"
        >
          <TableHead>
            <TableRow>
              {[
                "TICKET ID",
                "SHORT DESCRIPTION",
                "DESCRIPTION",
                "TICKET TYPE",
                "FORM NAME",
                "CLIENT ID",
                "CONTACT",
                "STATUS",
                "OPENED DATE",
                "STAFF",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    py: 1.5,
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
              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                  onClick={() => navigate(`/requests/${row.id}`)}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "#1C64F2",
                      fontWeight: 500,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.description || row.title}
                  </TableCell>
                  <TableCell>{row.ticketType || "Service"}</TableCell>
                  <TableCell>{row.formName || "General Request"}</TableCell>
                  <TableCell>{row.clientId || "N/A"}</TableCell>
                  <TableCell>{row.contact || "N/A"}</TableCell>
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
                  <TableCell>{row.created}</TableCell>
                  <TableCell>{row.assignee || "Unassigned"}</TableCell>
                </TableRow>
              );
            })}
            {paginatedRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    No matching records found in this view.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
