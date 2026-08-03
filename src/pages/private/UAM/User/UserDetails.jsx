import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AssignmentTurnedInOutlined as TicketIcon,
  CloudUploadOutlined as UploadIcon,
  ChatBubbleOutlineOutlined as CommentIcon,
  CheckCircleOutlineOutlined as ResolveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  getStoredUsers,
  setStoredUsers,
  getStoredRoles,
  systemPermissions,
} from "../../../../utils/rbacData";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getStoredUsers());
  const roles = React.useMemo(() => getStoredRoles(), []);
  const [prevUserId, setPrevUserId] = useState(userId);
  const [user, setUser] = useState(() => {
    const storedUsers = getStoredUsers();
    return storedUsers.find((u) => u.id === parseInt(userId, 10)) || null;
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [mockData, setMockData] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setMockData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch mock data in UserDetails:", error);
      });
    return () => {
      active = false;
    };
  }, []);

  if (userId !== prevUserId) {
    setPrevUserId(userId);
    const storedUsers = getStoredUsers();
    setUser(storedUsers.find((u) => u.id === parseInt(userId, 10)) || null);
  }

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);

    const updatedUsers = users.map((u) =>
      u.id === user.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
    setSnackbarMessage(`Role successfully updated to ${newRole}`);
  };

  // Dynamically map details based on viewed user
  const userDetails = React.useMemo(() => {
    const defaultDetails = {
      name: "Guest User",
      location: "Pune, India",
      email: user?.email || "guest@cargill.com",
      phone: "+91 98765 43210",
      website: "cargill.com",
      bio: "No details available.",
      skills: ["Access Control"]
    };

    if (!user) {
      return defaultDetails;
    }

    const email = user.email;
    const prefix = email.split("@")[0];
    const name = prefix
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!mockData) {
      return { ...defaultDetails, name, email };
    }

    const profilesSource = mockData.profiles;
    const key = email.toLowerCase().startsWith("admin")
      ? "admin"
      : email.toLowerCase().startsWith("hr")
      ? "hr"
      : email.toLowerCase().startsWith("finance")
      ? "finance"
      : "default";

    const profile = profilesSource[key] || {};
    return {
      ...defaultDetails,
      ...profile,
      name,
      email
    };
  }, [user, mockData]);

  // Dynamically compute stats depending on user profile
  const userStats = React.useMemo(() => {
    const defaultStats = {
      tickets: 0,
      files: 0,
      comments: 0,
      resolutionRate: 0,
      statusSummary: { open: 0, inProgress: 0, pending: 0, closed: 0 }
    };
    if (!user || !mockData) {
      return defaultStats;
    }

    const email = user.email.toLowerCase();
    const statsSource = mockData.stats;
    const key = email.startsWith("admin")
      ? "admin"
      : email.startsWith("hr")
      ? "hr"
      : email.startsWith("finance")
      ? "finance"
      : "default";

    return statsSource[key] || defaultStats;
  }, [user, mockData]);

  const userActivities = React.useMemo(() => {
    if (!user || !mockData) return [];
    const email = user.email.toLowerCase();
    const activitiesSource = mockData.activities;
    const key = email.startsWith("admin")
      ? "admin"
      : email.startsWith("hr")
      ? "hr"
      : email.startsWith("finance")
      ? "finance"
      : "default";

    return activitiesSource[key] || [];
  }, [user, mockData]);

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">User not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/uam")} sx={{ mt: 2 }}>
          Back to Admin
        </Button>
      </Box>
    );
  }

  const userRole = roles.find((r) => r.name === user.role) || { permissions: [] };

  return (
    <Box className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/uam")}
          sx={{ mb: 4, textTransform: "none", fontWeight: "bold" }}
        >
          Back to Access Control
        </Button>

        {/* Header Profile Card */}
        <Card
          className="overflow-hidden border-none shadow-xl rounded-2xl mb-8 bg-white dark:bg-slate-900"
          sx={{ backgroundImage: "none" }}
        >
          <div className="h-48 bg-gradient-to-r from-[#1B3D41] to-[#2E5E63] relative">
            {/* Cover Photo */}
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 mb-6 gap-6">
              <div className="relative">
                <Avatar
                  sx={{
                    width: 160,
                    height: 160,
                    border: "5px solid white",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    fontSize: "3.5rem",
                    fontWeight: "bold",
                    bgcolor: "primary.main",
                    color: "primary.contrastText"
                  }}
                  className="bg-white dark:bg-slate-800"
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left mb-2">
                <Typography
                  variant="h4"
                  className="font-bold text-slate-800 dark:text-slate-100 tracking-tight"
                >
                  {userDetails.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1"
                >
                  {user.role}
                </Typography>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <LocationIcon fontSize="inherit" />
                    {userDetails.location}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Bar */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            mb: 4,
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
            backgroundImage: "none"
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "0.9rem",
                py: 2,
                px: 3
              }
            }}
          >
            <Tab label="Basic Info" />
            <Tab label="Personal Information" />
            <Tab label="Role & Permissions Settings" />
            <Tab label="Ticket Stats" />
            <Tab label="User Activity" />

          </Tabs>
        </Paper>

        {/* Tab Panel Card */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            backgroundImage: "none",
            mb: 4
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {/* Tab 0: Basic Info */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}>
                  Basic User Information
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary" }}>{userDetails.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary", fontFamily: "monospace" }}>{userDetails.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Work Location</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary" }}>{userDetails.location}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Role</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={user.role} color="primary" size="small" sx={{ fontWeight: "bold" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>System ID</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary" }}>USR-00{user.id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Department</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary" }}>Technology Services</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 1: Personal Information */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}>
                  Personal Information
                </Typography>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 1 }}>Biography</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.7, fontSize: "0.95rem" }}>{userDetails.bio}</Typography>
                  </Box>
                  <Divider />
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}><EmailIcon /></Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>EMAIL</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontFamily: "monospace" }}>{userDetails.email}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}><PhoneIcon /></Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>PHONE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{userDetails.phone}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}><LanguageIcon /></Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>WEBSITE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>{userDetails.website}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 2 }}>Skills & Expertise</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                      {userDetails.skills.map((skill) => (
                        <Chip key={skill} label={skill} variant="outlined" sx={{ borderRadius: "8px", fontWeight: 600 }} />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Tab 3: Ticket Stats */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}>
                  Ticket Stats
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      label: "Total Tickets",
                      value: userStats.tickets,
                      icon: <TicketIcon fontSize="medium" />,
                      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
                    },
                    {
                      label: "Files Uploaded",
                      value: userStats.files,
                      icon: <UploadIcon fontSize="medium" />,
                      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
                    },
                    {
                      label: "Comments Posted",
                      value: userStats.comments,
                      icon: <CommentIcon fontSize="medium" />,
                      color: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
                    },
                    {
                      label: "Resolution Rate",
                      value: `${userStats.resolutionRate}%`,
                      icon: <ResolveIcon fontSize="medium" />,
                      color: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
                    },
                  ].map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                        <div>
                          <Typography variant="caption" className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                            {stat.label}
                          </Typography>
                          <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                            {stat.value}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 3, display: "block" }}>
                  Ticket Status Summary
                </Typography>
                <Stack spacing={3}>
                  {[
                    { label: "Open", count: userStats.statusSummary.open, color: "success" },
                    { label: "In Progress", count: userStats.statusSummary.inProgress, color: "primary" },
                    { label: "Pending", count: userStats.statusSummary.pending, color: "warning" },
                    { label: "Closed", count: userStats.statusSummary.closed, color: "inherit" },
                  ].map((status, idx) => {
                    const total =
                      userStats.statusSummary.open +
                      userStats.statusSummary.inProgress +
                      userStats.statusSummary.pending +
                      userStats.statusSummary.closed;
                    const pct = total > 0 ? (status.count / total) * 100 : 0;
                    return (
                      <Box key={idx}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                            {status.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                            {status.count} ({Math.round(pct)}%)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: "10px",
                            bgcolor: "action.hover",
                            borderRadius: "5px",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: "5px",
                              bgcolor:
                                status.color === "success"
                                  ? "success.main"
                                  : status.color === "primary"
                                    ? "primary.main"
                                    : status.color === "warning"
                                      ? "warning.main"
                                      : "text.secondary",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Tab 4: User Activity */}
            {activeTab === 4 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                      User Activity Log
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Recent system actions and audit trail for this account
                    </Typography>
                  </Box>
                  <Chip
                    label="Compliance Audited"
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderRadius: "8px" }}
                  />
                </Box>

                <Stack spacing={3}>
                  {userActivities.map((act) => (
                    <Box
                      key={act.id}
                      className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10 hover:shadow-md transition-all duration-200"
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                            <Box
                              className={`p-2.5 rounded-xl flex items-center justify-center ${act.category === "Access Control" || act.category === "Security Policy" || act.category === "Compliance"
                                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                                : act.category === "Session"
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                  : act.category === "Attachments"
                                    ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                                    : "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                                }`}
                            >
                              {act.category === "Access Control" || act.category === "Security Policy" || act.category === "Compliance" ? (
                                <ShieldIcon fontSize="small" />
                              ) : act.category === "Session" ? (
                                <LanguageIcon fontSize="small" />
                              ) : act.category === "Attachments" ? (
                                <UploadIcon fontSize="small" />
                              ) : (
                                <TicketIcon fontSize="small" />
                              )}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                {act.action}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                                {act.detail}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: { xs: "flex-start", sm: "flex-end" },
                              gap: 1,
                              pl: { xs: 6, sm: 0 },
                            }}
                          >
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                              {act.time}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={`IP: ${act.ip}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.75rem", height: "20px", color: "text.secondary" }}
                              />
                              <Chip
                                label={act.category}
                                size="small"
                                sx={{
                                  fontSize: "0.75rem",
                                  height: "20px",
                                  bgcolor: "action.selected",
                                  color: "text.primary",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Tab 2: Role & Permissions Settings */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <ShieldIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Role & Permissions Settings
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Manage role allocation and audit policy permissions
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4 }} />

                {/* Role settings */}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, display: "block" }}>
                  Role Allocation
                </Typography>
                <Box sx={{ mb: 4, maxWidth: "450px" }}>
                  <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                    <InputLabel id="role-select-label">Assign Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={user.role}
                      label="Assign Role"
                      onChange={handleRoleChange}
                    >
                      {roles.map((r) => (
                        <MenuItem key={r.name} value={r.name}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Changing this role immediately updates the security privileges inherited by this account.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Inherited permissions policy */}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <ShieldIcon color="primary" fontSize="small" /> Inherited Policy Permissions
                </Typography>

                <Stack spacing={4}>
                  {[
                    { val: 1, name: "Level 1 - Organization Policies" },
                    { val: 2, name: "Level 2 - Department Policies" },
                    { val: 3, name: "Level 3 - Tickets Policies" }
                  ].map((lvl, index) => {
                    const perms = systemPermissions.filter(p => p.level === lvl.val);
                    return (
                      <Box key={lvl.val}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            display: "block",
                            color: lvl.val === 1 ? "error.main" : lvl.val === 2 ? "secondary.main" : "primary.main",
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                          }}
                        >
                          {lvl.name}
                        </Typography>
                        <Grid container spacing={2}>
                          {perms.map((perm) => {
                            const hasPerm = userRole.permissions.includes(perm.id);
                            return (
                              <Grid item xs={12} sm={6} key={perm.id}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    height: "100%",
                                    borderRadius: 3,
                                    bgcolor: hasPerm ? "action.hover" : "transparent",
                                    border: "1px solid",
                                    borderColor: hasPerm ? "divider" : "transparent",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    {hasPerm ? (
                                      <CheckCircleIcon color="success" fontSize="small" />
                                    ) : (
                                      <CancelIcon color="disabled" fontSize="small" />
                                    )}
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: hasPerm ? 600 : 400, color: hasPerm ? "text.primary" : "text.secondary" }}>
                                        {perm.label}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                        {perm.desc}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                        {index < 2 && <Divider sx={{ mt: 4 }} />}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </div>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" className="rounded-xl shadow-lg">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDetails;
