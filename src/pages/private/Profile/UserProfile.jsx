import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  AssignmentTurnedInOutlined as TicketIcon,
  CloudUploadOutlined as UploadIcon,
  ChatBubbleOutlineOutlined as CommentIcon,
  CheckCircleOutlineOutlined as ResolveIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import profileImg from "../../../assets/profile_avatar.png";
import { useAuth } from "../../../context/AuthContext";
import { getStoredRoles, systemPermissions } from "../../../utils/rbacData";

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const roles = React.useMemo(() => getStoredRoles(), []);
  const [activeTab, setActiveTab] = useState(0);

  // Dynamically map details based on logged-in user
  const userDetails = React.useMemo(() => {
    if (!authUser) {
      return {
        name: "Ashish Shende",
        role: "Finance Executive",
        location: "Pune, India",
        email: "ashish.shende@cargill.com",
        phone: "+91 98765 43210",
        website: "cargill.com",
        bio: "Dedicated Finance Specialist at Cargill managing systems compliance and standard workflows.",
        skills: ["React", "Compliance", "Finance", "Auditing"]
      };
    }

    const email = authUser.email;
    const prefix = email.split("@")[0];
    const name = prefix
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name,
      role: authUser.role,
      location: authUser.role === "Org Admin" ? "Minneapolis, USA" : "Pune, India",
      email: email,
      phone: authUser.role === "Org Admin" ? "+1 (952) 742-7575" : "+91 98765 43210",
      website: "cargill.com",
      bio: `Dedicated ${authUser.role} at Cargill. Managing support requests, reviewing compliance checkpoints, and auditing access policies.`,
      skills: authUser.role === "Org Admin"
        ? ["Access Control", "System Administration", "Compliance Auditing", "Risk Assessment", "Operations Security"]
        : authUser.role.includes("Admin")
          ? ["Department Administration", "Access Control Management", "Ticket Workflows", "Team Leadership"]
          : ["Ticket Submission", "Vulnerability Review", "File Review", "Testing Support"]
    };
  }, [authUser]);

  // Dynamically compute stats depending on user profile
  const userStats = React.useMemo(() => {
    if (!authUser) {
      return {
        tickets: 4,
        files: 2,
        comments: 3,
        resolutionRate: 75,
        statusSummary: { open: 1, inProgress: 1, pending: 1, closed: 1 }
      };
    }

    const email = authUser.email.toLowerCase();
    if (email.startsWith("admin")) {
      return {
        tickets: 14,
        files: 8,
        comments: 24,
        resolutionRate: 85,
        statusSummary: { open: 3, inProgress: 4, pending: 2, closed: 5 }
      };
    } else if (email.startsWith("hr")) {
      return {
        tickets: 4,
        files: 2,
        comments: 6,
        resolutionRate: 75,
        statusSummary: { open: 1, inProgress: 1, pending: 1, closed: 1 }
      };
    } else if (email.startsWith("finance")) {
      return {
        tickets: 6,
        files: 3,
        comments: 11,
        resolutionRate: 66,
        statusSummary: { open: 1, inProgress: 2, pending: 1, closed: 2 }
      };
    } else {
      return {
        tickets: 3,
        files: 2,
        comments: 5,
        resolutionRate: 50,
        statusSummary: { open: 1, inProgress: 1, pending: 0, closed: 1 }
      };
    }
  }, [authUser]);

  const userActivities = React.useMemo(() => {
    const email = (authUser?.email || "finance_admin@cargill.com").toLowerCase();

    if (email.startsWith("admin")) {
      return [
        { id: 1, action: "User Access Review", detail: "Reviewed and approved UAM roles for 4 team members", time: "2 hours ago", category: "Access Control", status: "Success", ip: "10.124.45.12" },
        { id: 2, action: "Role Modified", detail: "Updated HR Depart Admin permissions policy", time: "1 day ago", category: "Security Policy", status: "Success", ip: "10.124.45.12" },
        { id: 3, action: "Ticket Transferred", detail: "Assigned INC0010045 to Alice Smith", time: "3 days ago", category: "Ticket Assignment", status: "Success", ip: "10.124.45.18" },
        { id: 4, action: "Security Audit", detail: "Exported Q2 UAM system logs for compliance verification", time: "1 week ago", category: "Compliance", status: "Success", ip: "10.124.45.12" },
        { id: 5, action: "System Logged In", detail: "Session initiated via Single Sign-On (SSO)", time: "1 week ago", category: "Session", status: "Success", ip: "10.124.45.12" },
      ];
    } else if (email.startsWith("hr")) {
      return [
        { id: 1, action: "Ticket Created", detail: "Raised REQ0001235: Adobe Creative Cloud installation request", time: "1 day ago", category: "Ticket Management", status: "Success", ip: "192.168.22.4" },
        { id: 2, action: "Comment Added", detail: "Commented on REQ0001234: 'Confirming requirement validation'", time: "2 days ago", category: "Ticket Management", status: "Success", ip: "192.168.22.4" },
        { id: 3, action: "File Uploaded", detail: "Uploaded employee onboarding file: uam_guidelines.pdf", time: "4 days ago", category: "Attachments", status: "Success", ip: "192.168.22.9" },
        { id: 4, action: "System Logged In", detail: "Session initiated via desktop agent", time: "5 days ago", category: "Session", status: "Success", ip: "192.168.22.4" },
      ];
    } else if (email.startsWith("finance") || email.includes("ashish")) {
      return [
        { id: 1, action: "File Uploaded", detail: "Uploaded scan_requirements.txt to REQ0001234", time: "10 mins ago", category: "Attachments", status: "Success", ip: "10.98.12.112" },
        { id: 2, action: "Comment Added", detail: "Commented on REQ0001234 regarding spreadsheet architecture", time: "15 mins ago", category: "Ticket Management", status: "Success", ip: "10.98.12.112" },
        { id: 3, action: "Ticket Created", detail: "Raised REQ0001234: Request to initiate QA environment scan", time: "4 months ago", category: "Ticket Management", status: "Success", ip: "10.98.10.45" },
        { id: 4, action: "System Logged In", detail: "Session initiated via SSO", time: "4 months ago", category: "Session", status: "Success", ip: "10.98.10.45" },
      ];
    } else {
      return [
        { id: 1, action: "Ticket Update", detail: "Modified description for REQ0001235", time: "3 hours ago", category: "Ticket Management", status: "Success", ip: "172.16.14.8" },
        { id: 2, action: "System Logged In", detail: "Session initiated via mobile app", time: "1 day ago", category: "Session", status: "Success", ip: "172.16.14.8" },
        { id: 3, action: "Comment Added", detail: "Commented on incident regarding laptop battery swap status", time: "3 days ago", category: "Ticket Management", status: "Success", ip: "172.16.12.5" },
      ];
    }
  }, [authUser]);

  const userRole = React.useMemo(() => {
    return roles.find((r) => r.name === userDetails.role) || { permissions: [] };
  }, [roles, userDetails.role]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", p: { xs: 2, md: 4 } }}>
      <div className="max-w-5xl mx-auto">
        {/* Header Profile Card */}
        <Card
          className="overflow-hidden border-none shadow-xl rounded-2xl mb-8 bg-white dark:bg-slate-900"
          sx={{ backgroundImage: "none" }}
        >
          <div className="h-48 bg-gradient-to-r from-[#1B3D41] to-[#2E5E63] relative">
            <Tooltip title="Edit Cover Photo" arrow>
              <IconButton
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 mb-6 gap-6">
              <div className="relative">
                <Avatar
                  src={profileImg}
                  sx={{
                    width: 160,
                    height: 160,
                    border: "5px solid white",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white dark:bg-slate-800"
                />
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
                  {userDetails.role}
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
                      <Chip label={userDetails.role} color="primary" size="small" sx={{ fontWeight: "bold" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>System ID</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "text.primary" }}>USR-00{authUser?.id || 1}</Typography>
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

            {/* Tab 2: Ticket Stats */}
            {activeTab === 2 && (
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

            {/* Tab 3: User Activity */}
            {activeTab === 3 && (
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

            {/* Tab 4: Role & Permissions Settings */}
            {activeTab === 4 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <ShieldIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Security Role & Permissions Settings
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Inherited authorization and access policies
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, display: "block" }}>
                  Your Security Role
                </Typography>
                <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip label={userDetails.role} color="secondary" sx={{ fontWeight: "bold" }} />
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Your role is assigned by the System Administrator and determines the permissions below.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

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
    </Box>
  );
};

export default UserProfile;
