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
} from "../utils/rbacData";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const storedUsers = getStoredUsers();
    const storedRoles = getStoredRoles();
    setUsers(storedUsers);
    setRoles(storedRoles);

    const currentUser = storedUsers.find((u) => u.id === parseInt(userId, 10));
    if (currentUser) {
      setUser(currentUser);
    }
  }, [userId]);

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
    if (!user) {
      return {
        name: "Guest User",
        location: "Pune, India",
        email: "guest@cargill.com",
        phone: "+91 98765 43210",
        website: "cargill.com",
        bio: "No details available.",
        skills: ["Access Control"]
      };
    }

    const email = user.email;
    const prefix = email.split("@")[0];
    const name = prefix
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name,
      location: user.role === "Org Admin" ? "Minneapolis, USA" : "Pune, India",
      email: email,
      phone: user.role === "Org Admin" ? "+1 (952) 742-7575" : "+91 98765 43210",
      website: "cargill.com",
      bio: `Dedicated ${user.role} at Cargill. Auditing access logs, managing permissions hierarchy, and ensuring system compliance.`,
      skills: user.role === "Org Admin"
        ? ["Access Control", "System Administration", "Compliance Auditing", "Risk Assessment", "Operations Security"]
        : user.role.includes("Admin")
          ? ["Department Administration", "Access Control Management", "Ticket Workflows", "Team Leadership"]
          : ["Ticket Submission", "Vulnerability Review", "File Review", "Testing Support"]
    };
  }, [user]);

  // Dynamically compute stats depending on user profile
  const userStats = React.useMemo(() => {
    if (!user) {
      return {
        tickets: 0,
        files: 0,
        comments: 0,
        resolutionRate: 0,
        statusSummary: { open: 0, inProgress: 0, pending: 0, closed: 0 }
      };
    }

    const email = user.email.toLowerCase();
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
        tickets: 5,
        files: 2,
        comments: 8,
        resolutionRate: 80,
        statusSummary: { open: 1, inProgress: 1, pending: 0, closed: 3 }
      };
    } else if (email.startsWith("finance")) {
      return {
        tickets: 8,
        files: 4,
        comments: 15,
        resolutionRate: 70,
        statusSummary: { open: 2, inProgress: 2, pending: 1, closed: 3 }
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
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">User not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin")} sx={{ mt: 2 }}>
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
          onClick={() => navigate("/admin")}
          sx={{ mb: 4, textTransform: "none", fontWeight: "bold" }}
        >
          Back to Access Control
        </Button>

        {/* Header Profile Card */}
        <Card
          className="overflow-hidden border-none shadow-xl rounded-2xl mb-8 bg-white dark:bg-slate-900"
          sx={{ backgroundImage: "none" }}
        >
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
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

        <Grid container spacing={4}>
          {/* Left Column: Tickets & System Stats + Roles & Permissions */}
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              {/* Activity Stats Card */}
              <Card
                className="border-none shadow-lg rounded-2xl bg-white dark:bg-slate-900"
                sx={{ backgroundImage: "none", p: 3 }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography
                    variant="h6"
                    className="font-bold text-slate-800 dark:text-slate-100 mb-6"
                  >
                    User Activity & Ticket Stats
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
                      <Grid item xs={6} key={idx}>
                        <Box className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                          <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                            {stat.icon}
                          </div>
                          <div>
                            <Typography
                              variant="caption"
                              className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block"
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h5"
                              className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5"
                            >
                              {stat.value}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography
                    variant="subtitle2"
                    className="font-bold text-slate-800 dark:text-slate-100 mb-3 block"
                  >
                    Ticket Status Summary
                  </Typography>
                  <Stack spacing={2}>
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
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography
                              variant="body2"
                              className="font-bold text-slate-600 dark:text-slate-300"
                            >
                              {status.label}
                            </Typography>
                            <Typography variant="caption" className="font-bold text-slate-500">
                              {status.count} ({Math.round(pct)}%)
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "100%",
                              height: "8px",
                              bgcolor: "action.hover",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${pct}%`,
                                height: "100%",
                                borderRadius: "4px",
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
                </CardContent>
              </Card>

              {/* Roles & Permissions Card */}
              <Card
                className="border-none shadow-lg rounded-2xl bg-white dark:bg-slate-900"
                sx={{ backgroundImage: "none", p: 3 }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <ShieldIcon color="primary" fontSize="large" />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Role & Permissions Settings
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {user.role} (Auditable & Editable Options)
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {/* Role settings */}
                  <Typography variant="subtitle2" className="font-bold mb-2 block">
                    Role Allocation
                  </Typography>
                  <Box sx={{ mb: 4 }}>
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

                  <Divider sx={{ mb: 3 }} />

                  {/* Inherited permissions policy */}
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
                    <ShieldIcon color="primary" fontSize="small" /> Inherited Policy Permissions
                  </Typography>

                  <Stack spacing={3}>
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
                              mb: 1.5,
                              display: "block",
                              color: lvl.val === 1 ? "error.main" : lvl.val === 2 ? "secondary.main" : "primary.main",
                              textTransform: "uppercase",
                              letterSpacing: "1px"
                            }}
                          >
                            {lvl.name}
                          </Typography>
                          <Stack spacing={1.5}>
                            {perms.map((perm) => {
                              const hasPerm = userRole.permissions.includes(perm.id);
                              return (
                                <Box
                                  key={perm.id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
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
                              );
                            })}
                          </Stack>
                          {index < 2 && <Divider sx={{ mt: 3 }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column: Contact Details & Personal Info */}
          <Grid item xs={12} md={5}>
            <Card
              className="border-none shadow-lg rounded-2xl bg-white dark:bg-slate-900"
              sx={{ backgroundImage: "none", p: 3, height: "100%" }}
            >
              <CardContent className="p-1">
                <Typography
                  variant="h6"
                  className="font-bold text-slate-800 dark:text-slate-100 mb-6"
                >
                  Personal Information
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1"
                    >
                      Bio
                    </Typography>
                    <Typography variant="body2" className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {userDetails.bio}
                    </Typography>
                  </Box>

                  <Divider className="opacity-60" />

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                      <EmailIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block"
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-slate-700 dark:text-slate-200 font-medium font-mono"
                      >
                        {userDetails.email}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-lg">
                      <PhoneIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block"
                      >
                        Phone
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-slate-700 dark:text-slate-200 font-medium"
                      >
                        {userDetails.phone}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg">
                      <LanguageIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block"
                      >
                        Website
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                      >
                        {userDetails.website}
                      </Typography>
                    </div>
                  </div>

                  <Divider className="opacity-60" />

                  <div className="space-y-4">
                    <Typography
                      variant="subtitle2"
                      className="font-bold text-slate-800 dark:text-slate-100"
                    >
                      Skills
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {userDetails.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
