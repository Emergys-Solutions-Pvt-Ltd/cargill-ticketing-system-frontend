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
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LabTabs from "../components/LabTabs";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';

import CategoryIcon from '@mui/icons-material/Category';

const dummyRequests = [
  {
    id: "REQ000123456",
    title: "Request to initiate dynamic scan on SXR QA Environment",
    status: "Closed",
    created: "4 months ago",
    updated: "4 minutes ago",
    priority: "High",
    assignee: "John Doe",
    department: "Security Operations",
    category: "Security Assessment"
  },
  {
    id: "REQ000123457",
    title: "Access request for Production Database",
    status: "In Progress",
    created: "2 weeks ago",
    updated: "1 hour ago",
    priority: "Critical",
    assignee: "Alice Smith",
    department: "IT Infrastructure",
    category: "Access Management"
  },
  {
    id: "REQ000123458",
    title: "Software installation: Adobe Creative Cloud",
    status: "Pending",
    created: "1 day ago",
    updated: "10 minutes ago",
    priority: "Medium",
    assignee: "Bob Wilson",
    department: "IT Support",
    category: "Software Request"
  },
  {
    id: "REQ000123459",
    title: "Laptop replacement request",
    status: "Open",
    created: "3 days ago",
    updated: "2 hours ago",
    priority: "Low",
    assignee: "Sarah Johnson",
    department: "HR Services",
    category: "Hardware"
  },
];

const getStatusColor = (status, mode) => {
  const isDark = mode === "dark";
  switch (status) {
    case "Closed":
      return isDark
        ? { bg: "rgba(255, 255, 255, 0.08)", text: "#94a3b8" }
        : { bg: "#f1f5f9", text: "#475569" };
    case "In Progress":
      return isDark
        ? { bg: "rgba(2, 132, 199, 0.2)", text: "#38bdf8" }
        : { bg: "#e0f2fe", text: "#0284c7" };
    case "Pending":
      return isDark
        ? { bg: "rgba(217, 119, 6, 0.2)", text: "#fbbf24" }
        : { bg: "#fef3c7", text: "#d97706" };
    case "Open":
      return isDark
        ? { bg: "rgba(22, 163, 74, 0.2)", text: "#4ade80" }
        : { bg: "#dcfce7", text: "#16a34a" };
    default:
      return isDark
        ? { bg: "rgba(255, 255, 255, 0.08)", text: "#94a3b8" }
        : { bg: "#f1f5f9", text: "#475569" };
  }
};

function MyRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const request = dummyRequests.find(r => r.id === requestId) || dummyRequests[0];
  const statusColors = getStatusColor(request.status, theme.palette.mode);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs & Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link underline="hover" color="inherit" component={RouterLink} to="/requests">Home</Link>
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
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  px: 1
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 500, maxWidth: "800px" }}>
              {request.title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')}>
              Back
            </Button>
            <Button variant="contained" color="primary" disableElevation>
              Add Comment
            </Button>
            <IconButton><MoreVertIcon /></IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Main Content Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "State", value: request.status, icon: <AccessTimeIcon color="action" /> },
          { label: "Created", value: request.created, icon: <AccessTimeIcon color="action" /> },
          { label: "Updated", value: request.updated, icon: <AccessTimeIcon color="action" /> },
          { label: "Priority", value: request.priority, icon: <AccessTimeIcon color="action" /> },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card variant="outlined" sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: "16px !important" }}>
                <Avatar sx={{ bgcolor: isDark ? "rgba(59, 130, 246, 0.15)" : "#eff6ff", color: isDark ? "#60a5fa" : "#3b82f6" }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {item.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Layout Split */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ borderRadius: 4, mb: 4, border: "1px solid", borderColor: "divider", overflow: 'visible' }}>
            <Box sx={{ p: 1 }}>
              <LabTabs />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
                Request Details
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: "background.default" }}><PersonOutlineIcon color="action" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>ASSIGNEE</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.assignee}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: "background.default" }}><CategoryIcon color="action" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>CATEGORY</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.category}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>DEPARTMENT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.department}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MyRequest;


