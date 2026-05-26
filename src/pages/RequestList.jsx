import React from "react";
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
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
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

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f8fafc", p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>

        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Requests
        </Typography>
        <Button variant="contained" color="primary">
          Create New Request
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="requests table">
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Updated</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyRequests.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: 'pointer', "&:hover": { backgroundColor: "#f1f5f9" } }}
                onClick={() => navigate(`/requests/${row.id}`)}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: '#3b82f6' }}>
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
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestList;
