import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getStoredTickets,
  getStoredTicketsAsync,
} from "../../../utils/rbacData";
import SearchIcon from "../../../../src/assets/icons/search.svg";
import FilterIcon from "../../../../src/assets/icons/filter.svg";
import CommonTable from "../../../components/common/CommonTable";
import CommonChip from "../../../components/common/CommonChip";

// ── Page-specific: truncation style reused by two columns ──
const truncateCellSx = {
  maxWidth: 200,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const RequestList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

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

  // ── Page-specific: column definitions ──

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "TICKET ID",
        cellProps: { component: "th", scope: "row" },
        cellSx: {
          color: "#1C64F2",
          fontWeight: 500,
          "&:hover": { textDecoration: "underline" },
        },
      },
      {
        key: "title",
        label: "SHORT DESCRIPTION",
        cellSx: truncateCellSx,
      },
      {
        key: "description",
        label: "DESCRIPTION",
        cellSx: truncateCellSx,
        render: (value, row) => row.description || row.title,
      },
      {
        key: "ticketType",
        label: "TICKET TYPE",
        render: (value) => value || "Service",
      },
      {
        key: "formName",
        label: "FORM NAME",
        render: (value) => value || "General Request",
      },
      {
        key: "clientId",
        label: "CLIENT ID",
        render: (value) => value || "N/A",
      },
      {
        key: "contact",
        label: "CONTACT",
        render: (value) => value || "N/A",
      },
      {
        key: "status",
        label: "STATUS",
        render: (_value, row) => {
          return (
            <CommonChip status={row.status} label={row.status} />
          );
        },
      },
      {
        key: "created",
        label: "OPENED DATE",
      },
      {
        key: "assignee",
        label: "STAFF",
        render: (value) => value || "Unassigned",
      },
    ],
    [],
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
                height: "2.125rem",
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

      {/* Table — now powered by the reusable CommonTable component */}
      <CommonTable
        columns={columns}
        rows={paginatedRequests}
        onRowClick={(row) => navigate(`/requests/${row.id}`)}
        emptyMessage="No matching records found in this view."
        tableContainerSx={{ mt: 2 }}
        ariaLabel="Cargill ticket list"
        pagination={{
          count: filteredRequests.length,
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

export default RequestList;
