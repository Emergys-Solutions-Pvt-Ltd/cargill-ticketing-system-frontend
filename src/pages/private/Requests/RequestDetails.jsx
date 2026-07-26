import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import LabTabs from "../../../components/LabTabs";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getStoredTickets,
  getStoredTicketsAsync,
  setStoredTickets,
} from "../../../utils/rbacData";
import { recordTicketView } from "../../../utils/fileActionTracker";
import { useAuth } from "../../../context/AuthContext";

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
  const p = priority?.toLowerCase() || "medium";
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

function RequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [tickets, setTickets] = useState(() => getStoredTickets());

  useEffect(() => {
    if (tickets.length === 0) {
      getStoredTicketsAsync().then((fetchedTickets) => {
        setTickets(fetchedTickets);
      });
    }
  }, [tickets]);

  useEffect(() => {
    if (requestId && authUser) {
      recordTicketView(requestId, authUser);
    }
  }, [requestId, authUser]);

  const request = tickets.find((r) => r.id === requestId) || {
    id: requestId || "REQ0000000",
    title: "Loading Ticket Details...",
    status: "Open",
    priority: "Medium",
    created: "",
    updated: "",
    comments: [],
    assignee: "Loading...",
    category: "General Support",
    department: "Enterprise Services",
  };
  const statusColors = getStatusColor(request.status);
  const priorityColors = getPriorityColor(request.priority);

  const displayName = React.useMemo(() => {
    if (!authUser || !authUser.email) return "Guest";
    const namePart = authUser.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [authUser]);

  const handleResolveTicket = () => {
    const updatedRequest = {
      ...request,
      status: "Resolved",
      updated: "Just now",
    };

    const updatedTickets = tickets.map((t) =>
      t.id === request.id ? updatedRequest : t,
    );
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Breadcrumbs & Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/requests")}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Back to Requests
        </Button>

        <Card sx={{ px: 2, py: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "text.primary",
                }}
              >
                {request.id}
              </Typography>
              <Chip
                label={request.status}
                sx={{
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                  border: statusColors.border,
                  fontWeight: 700,
                  fontSize: "0.688rem",
                  borderRadius: "50px",
                }}
              />
            </Box>
          </Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              maxWidth: "50rem",
              fontSize: "1rem",
            }}
          >
            {request.title}
          </Typography>
        </Card>
      </Box>

      {/* Layout Split */}
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ width: "100%" }}>
          {/* Activity Log & Attachments */}
          <Card
            variant="outlined"
            sx={{
              mb: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "visible",
              bgcolor: "background.paper",
              backgroundImage: "none",
            }}
          >
            <LabTabs comments={request.comments || []} request={request} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RequestDetails;
