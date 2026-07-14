import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Avatar,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Shield as ShieldIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getStoredUsers,
  setStoredUsers,
  getStoredRoles,
  setStoredRoles,
  systemPermissions,
} from "../../../../utils/rbacData";
import SectionCard from "../../../../components/SectionCard";
import trash_icon from "../../../../assets/icons/trash_icon.svg";

const UserList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState(() => getStoredUsers());
  const [roles, setRoles] = useState(() => getStoredRoles());

  // User tab state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Roles tab state
  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleLevel, setNewRoleLevel] = useState(3);
  const [newRolePermissions, setNewRolePermissions] = useState(() => {
    const initial = {};
    systemPermissions.forEach((perm) => {
      initial[perm.id] = false;
    });
    return initial;
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddUser = () => {
    if (!email || !email.includes("@")) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setSnackbar({
        open: true,
        message: "A user with this email address already exists.",
      });
      return;
    }

    const newUser = {
      id: users.length + 1,
      email,
      role,
      status: "Active",
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);

    setEmail("");
    setRole("User");
    setOpenAddUserDialog(false);
    setSnackbar({
      open: true,
      message: `User ${email} created with role ${role}!`,
    });
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
    setSnackbar({ open: true, message: "User access revoked." });
  };

  const handleCreateRole = () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setSnackbar({ open: true, message: "Please enter a role name." });
      return;
    }

    if (roles.some((r) => r.name.toLowerCase() === trimmedName.toLowerCase())) {
      setSnackbar({
        open: true,
        message: "A role with this name already exists.",
      });
      return;
    }

    const activePermissions = Object.keys(newRolePermissions).filter(
      (key) => newRolePermissions[key],
    );

    const newRole = {
      name: trimmedName,
      permissions: activePermissions,
      isSystem: false,
      level: newRoleLevel,
    };

    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    setStoredRoles(updatedRoles);

    setNewRoleName("");
    setNewRoleLevel(3);
    const resetPerms = {};
    systemPermissions.forEach((perm) => {
      resetPerms[perm.id] = false;
    });
    setNewRolePermissions(resetPerms);
    setOpenCreateRoleDialog(false);
    setSnackbar({
      open: true,
      message: `Custom role "${trimmedName}" created successfully!`,
    });
  };

  const handlePermissionCheckboxChange = (permId) => {
    setNewRolePermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case "Org Admin":
        return "error";
      case "Finance Depart Admin":
        return "primary";
      case "HR Depart Admin":
        return "secondary";
      case "User":
        return "default";
      default:
        return "default";
    }
  };

  const UsersTab = (
    <Box sx={{ fontFamily: "sans-serif" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          User Accounts ({users.length})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddUserDialog(true)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 60px",
          gap: 2,
          p: "0 16px 16px 16px",
          color: "#6b7280",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          fontWeight: "bold",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>User</Box>
        <Box>Email</Box>
        <Box>Role</Box>
        <Box sx={{ textAlign: "right" }}>Actions</Box>
      </Box>

      {/* User Rows */}
      <Box sx={{ backgroundColor: "background.paper", borderRadius: "8px" }}>
        {users.map((u) => (
          <Box
            key={u.id}
            onClick={() => navigate(`/admin/users/${u.id}`)}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 60px",
              gap: 2,
              alignItems: "center",
              p: "12px",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {/* User Column */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                }}
              >
                {u.email.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", color: "#1C64F2" }}
              >
                {u.email}
              </Typography>
            </Stack>

            {/* Email Column */}
            <Box>
              <Typography variant="body2">{u.email}</Typography>
            </Box>

            {/* Role Column */}
            <Box>
              <Typography variant="body2">{u.role}</Typography>
            </Box>

            {/* Actions Column */}
            <Box
              sx={{ textAlign: "right" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="Revoke Access">
                <IconButton onClick={() => handleDeleteUser(u.id)}>
                  <Box component="img" src={trash_icon} alt="Delete" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const RolesTab = (
    <Box>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateRoleDialog(true)}
        sx={{ borderRadius: "10px", textTransform: "none" }}
      >
        Create Role
      </Button>
      <Typography
        variant="h6"
        className="font-bold text-slate-800 dark:text-slate-100"
      >
        Role Definitions ({roles.length})
      </Typography>
      <Stack spacing={3}>
        {roles.map((r) => {
          const uCount = users.filter((u) => u.role === r.name).length;

          return (
            <Card
              key={r.name}
              variant="outlined"
              onClick={() => navigate(`/admin/roles/${r.name}`)}
              sx={{
                borderRadius: 3,
                cursor: "pointer",
                borderColor: "divider",
                bgcolor: "background.paper",
                backgroundImage: "none",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ShieldIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {r.name}
                    </Typography>
                    {r.level && (
                      <Chip
                        label={
                          r.level === 1
                            ? "Level 1: Organization"
                            : r.level === 2
                              ? "Level 2: Department"
                              : "Level 3: Tickets"
                        }
                        size="small"
                        color={
                          r.level === 1
                            ? "error"
                            : r.level === 2
                              ? "secondary"
                              : "primary"
                        }
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                    {r.isSystem && (
                      <Chip
                        label="System"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {uCount} {uCount === 1 ? "user" : "users"} assigned
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {r.permissions.map((pId) => {
                    const label =
                      systemPermissions.find((sp) => sp.id === pId)?.label ||
                      pId;
                    return (
                      <Chip
                        key={pId}
                        label={label}
                        size="small"
                        sx={{
                          borderRadius: "6px",
                          bgcolor: "background.default",
                          color: "text.primary",
                        }}
                      />
                    );
                  })}
                  {r.permissions.length === 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    >
                      No permissions assigned.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );

  const tabs = [
    {
      label: "Users",
      content: UsersTab,
    },
    {
      label: "Roles",
      content: RolesTab,
    },
  ];

  return (
    <Box className="p-6 md:p-10 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <Typography
                variant="h4"
                className="font-bold text-slate-800 dark:text-slate-100"
              >
                Access Control
              </Typography>
              <Typography
                variant="body2"
                className="text-slate-500 dark:text-slate-400 font-medium"
              >
                Manage user access rights and role-based permissions policies.
              </Typography>
            </div>
          </div>
        </div>

        <SectionCard tabs={tabs} />

        {/* Add User Dialog */}
        <Dialog
          open={openAddUserDialog}
          onClose={() => setOpenAddUserDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "24px",
              padding: "8px",
              width: "100%",
              maxWidth: "450px",
              backgroundImage: "none",
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", color: "text.primary", pb: 1 }}
          >
            Assign Access
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Enter email and assign a role to authorize a new user.
            </Typography>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="User Email Address"
                placeholder="user@cargill.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon className="text-slate-400 mr-2" />,
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Assign Role</InputLabel>
                <Select
                  value={role}
                  label="Assign Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <MenuItem key={r.name} value={r.name}>
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenAddUserDialog(false)}
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddUser}
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: "12px",
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Assign Access
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Role Dialog */}
        <Dialog
          open={openCreateRoleDialog}
          onClose={() => setOpenCreateRoleDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "24px",
              padding: "8px",
              width: "100%",
              maxWidth: "500px",
              backgroundImage: "none",
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", color: "text.primary", pb: 1 }}
          >
            Create Custom Role
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Define a new role, assign a hierarchy level, and configure
              permissions.
            </Typography>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Role Name"
                placeholder="e.g. Auditor"
                variant="outlined"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Role Level Hierarchy</InputLabel>
                <Select
                  value={newRoleLevel}
                  label="Role Level Hierarchy"
                  onChange={(e) => setNewRoleLevel(Number(e.target.value))}
                >
                  <MenuItem value={1}>Level 1 - Organization</MenuItem>
                  <MenuItem value={2}>Level 2 - Department</MenuItem>
                  <MenuItem value={3}>Level 3 - Tickets</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Assign Permissions
                </Typography>

                {[
                  { val: 1, name: "Level 1 - Organization Permissions" },
                  { val: 2, name: "Level 2 - Department Permissions" },
                  { val: 3, name: "Level 3 - Tickets Permissions" },
                ].map((lvl, index) => {
                  const perms = systemPermissions.filter(
                    (p) => p.level === lvl.val,
                  );
                  return (
                    <Box key={lvl.val} sx={{ mb: index === 2 ? 0 : 3 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          display: "block",
                          color:
                            lvl.val === 1
                              ? "error.main"
                              : lvl.val === 2
                                ? "secondary.main"
                                : "primary.main",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {lvl.name}
                      </Typography>
                      <FormGroup>
                        {perms.map((perm) => (
                          <FormControlLabel
                            key={perm.id}
                            control={
                              <Checkbox
                                checked={newRolePermissions[perm.id]}
                                onChange={() =>
                                  handlePermissionCheckboxChange(perm.id)
                                }
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {perm.label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {perm.desc}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              mb: 1.5,
                              alignItems: "flex-start",
                              "& .MuiCheckbox-root": { pt: 0.25 },
                            }}
                          />
                        ))}
                      </FormGroup>
                      {index < 2 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  );
                })}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenCreateRoleDialog(false)}
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateRole}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "12px",
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Create Custom Role
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            className="rounded-xl shadow-lg"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};

export default UserList;
