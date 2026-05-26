import React, { useState } from "react";
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
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { Visibility as VisibilityIcon, Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const dummyRequests = [
  {
    id: "REQ000123456",
    title: "Request to initiate dynamic scan on SXR QA Environment",
    status: "Closed",
    created: "4 months ago",
    updated: "4 minutes ago",
  },
  {
    id: "REQ000123457",
    title: "Access request for Production Database",
    status: "In Progress",
    created: "2 weeks ago",
    updated: "1 hour ago",
  },
  {
    id: "REQ000123458",
    title: "Software installation: Adobe Creative Cloud",
    status: "Pending",
    created: "1 day ago",
    updated: "10 minutes ago",
  },
  {
    id: "REQ000123459",
    title: "Laptop replacement request",
    status: "Open",
    created: "3 days ago",
    updated: "2 hours ago",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Closed":
      return "default";
    case "In Progress":
      return "primary";
    case "Pending":
      return "warning";
    case "Open":
      return "success";
    default:
      return "default";
  }
};

const RequestList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = dummyRequests.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Requests
        </Typography>
      </Box>

      {/* Search & Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by Request ID or Title..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '250px', maxWidth: '400px' }}
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
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table listing */}
      <TableContainer component={Paper} sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2, border: "1px solid", borderColor: "divider", backgroundImage: "none" }}>
        <Table sx={{ minWidth: 650 }} aria-label="requests table">
          <TableHead sx={{ backgroundColor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: 'pointer',
                  "&:hover": { backgroundColor: "action.hover" }
                }}
                onClick={() => navigate(`/requests/${row.id}`)}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                  {row.id}
                </TableCell>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.title}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={getStatusColor(row.status)}
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.created}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.updated}</TableCell>

              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    No requests found matching the search criteria.
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
