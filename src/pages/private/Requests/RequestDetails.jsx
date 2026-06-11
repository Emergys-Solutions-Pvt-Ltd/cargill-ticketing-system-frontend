import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import LabTabs from "../../../components/LabTabs";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import HelpOutlineIcon from '@mui/icons-material/Help';
import { getStoredTickets, getStoredTicketsAsync, setStoredTickets } from "../../../utils/rbacData";
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
  const [commentText, setCommentText] = useState("");

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

  const request = tickets.find(r => r.id === requestId) || {
    id: requestId || "REQ0000000",
    title: "Loading Ticket Details...",
    status: "Open",
    priority: "Medium",
    created: "",
    updated: "",
    comments: [],
    assignee: "Loading...",
    category: "General Support",
    department: "Enterprise Services"
  };
  const statusColors = getStatusColor(request.status);
  const priorityColors = getPriorityColor(request.priority);

  const displayName = React.useMemo(() => {
    if (!authUser || !authUser.email) return "Guest";
    const namePart = authUser.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [authUser]);

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: (request.comments?.length || 0) + 1,
      author: displayName,
      avatar: displayName.charAt(0),
      time: "Just now",
      text: commentText,
      attachments: []
    };

    const updatedRequest = {
      ...request,
      comments: [newComment, ...(request.comments || [])],
      updated: "Just now"
    };

    const updatedTickets = tickets.map(t => t.id === request.id ? updatedRequest : t);
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);
    setCommentText("");
  };

  const handleResolveTicket = () => {
    const updatedRequest = {
      ...request,
      status: "Resolved",
      updated: "Just now"
    };

    const updatedTickets = tickets.map(t => t.id === request.id ? updatedRequest : t);
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs & Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link underline="hover" color="inherit" component={RouterLink} to="/">Home</Link>
          <Link underline="hover" color="inherit" component={RouterLink} to="/requests">My Requests</Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>{request.id}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}>
                {request.id}
              </Typography>
              <Chip
                label={request.status}
                sx={{
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                  border: statusColors.border,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  px: 0.5
                }}
              />
              <Chip
                label={request.priority || "Medium"}
                sx={{
                  backgroundColor: priorityColors.bg,
                  color: priorityColors.text,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  px: 0.5
                }}
              />
              <Chip
                label={"Created " + request.created}
                sx={{
                  backgroundColor: "primary",
                  color: "black",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  px: 0.5
                }}
              />
              <Chip
                label={"Last Updated " + request.updated}
                sx={{
                  backgroundColor: "primary",
                  color: "black",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  px: 0.5
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 500, maxWidth: "800px" }}>
              {request.title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')} sx={{ borderRadius: "8px" }}>
              Back to List
            </Button>
            {request.status !== "Closed" && request.status !== "Resolved" && (
              <Button variant="contained" color="secondary" onClick={handleResolveTicket} sx={{ color: "#ffffff", fontWeight: "bold", borderRadius: "8px" }}>
                Resolve Ticket
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Layout Split */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {/* Post Comment Section */}
          <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", backgroundImage: "none" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}>
                Work Notes / Activity Stream
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>{displayName.charAt(0)}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type an update or work note for triagers..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      onClick={handlePostComment}
                      endIcon={<SendIcon />}
                      disabled={!commentText.trim()}
                      sx={{ borderRadius: "8px", fontWeight: "bold", textTransform: "none" }}
                    >
                      Post Update
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Activity Log & Attachments */}
          <Card variant="outlined" sx={{ borderRadius: 3, mb: 4, border: "1px solid", borderColor: "divider", overflow: 'visible', bgcolor: "background.paper", backgroundImage: "none" }}>
            <Box sx={{ p: 1 }}>
              <LabTabs comments={request.comments || []} request={request} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RequestDetails;
