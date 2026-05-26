import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  getStoredUsers,
  getStoredRoles,
  setStoredRoles,
  systemPermissions,
} from "../utils/rbacData";

const RoleDetails = () => {
  const { roleName } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const storedUsers = getStoredUsers();
    const storedRoles = getStoredRoles();
    setUsers(storedUsers);
    setRoles(storedRoles);

    const currentRole = storedRoles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
    if (currentRole) {
      setRole(currentRole);
    }
  }, [roleName]);

  const handlePermissionToggle = (permId) => {
    let updatedPermissions;
    if (role.permissions.includes(permId)) {
      updatedPermissions = role.permissions.filter((p) => p !== permId);
    } else {
      updatedPermissions = [...role.permissions, permId];
    }

    const updatedRole = { ...role, permissions: updatedPermissions };
    setRole(updatedRole);

    const updatedRoles = roles.map((r) =>
      r.name.toLowerCase() === role.name.toLowerCase() ? updatedRole : r
    );
    setRoles(updatedRoles);
    setStoredRoles(updatedRoles);
    setSnackbarMessage(`Permissions updated for role: ${role.name}`);
  };

  if (!role) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Role not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin")} sx={{ mt: 2 }}>
          Back to Admin
        </Button>
      </Box>
    );
  }

  const assignedUsers = users.filter((u) => u.role.toLowerCase() === role.name.toLowerCase());

  return (
    <Box className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin")}
          sx={{ mb: 4, textTransform: "none", fontWeight: "bold" }}
        >
          Back to Access Control
        </Button>

        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
          {/* Permissions edit */}
          <Box sx={{ flex: 1.5 }}>
            <Card className="border-none shadow-xl rounded-3xl bg-white dark:bg-slate-900" sx={{ backgroundImage: "none", p: 3 }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <ShieldIcon color="primary" fontSize="large" />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Role: {role.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {role.isSystem ? "System Role (Inherited)" : "Custom Role"}
                      </Typography>
                    </Box>
                  </Box>
                  {role.level && (
                    <Chip 
                      label={role.level === 1 ? "Level 1: Organization" : role.level === 2 ? "Level 2: Department" : "Level 3: Tickets"} 
                      size="small" 
                      color={role.level === 1 ? "error" : role.level === 2 ? "secondary" : "primary"} 
                      sx={{ fontWeight: "bold" }} 
                    />
                  )}
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" className="font-bold mb-3">
                  Assign Policies
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  Check the options below to configure what actions are permitted for any user holding the <strong>{role.name}</strong> role.
                </Typography>

                {[
                  { val: 1, name: "Level 1 - Organization Policies" },
                  { val: 2, name: "Level 2 - Department Policies" },
                  { val: 3, name: "Level 3 - Tickets Policies" }
                ].map((lvl, index) => {
                  const perms = systemPermissions.filter(p => p.level === lvl.val);
                  return (
                    <Box key={lvl.val} sx={{ mb: index === 2 ? 0 : 4 }}>
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
                      <FormGroup>
                        {perms.map((perm) => {
                          const checked = role.permissions.includes(perm.id);
                          return (
                            <FormControlLabel
                              key={perm.id}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={() => handlePermissionToggle(perm.id)}
                                  color="primary"
                                />
                              }
                              label={
                                <Box sx={{ ml: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: checked ? "text.primary" : "text.secondary" }}>
                                    {perm.label}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    {perm.desc}
                                  </Typography>
                                </Box>
                              }
                              sx={{ 
                                mb: 2, 
                                p: 1.5, 
                                borderRadius: 3, 
                                bgcolor: checked ? "action.hover" : "transparent",
                                border: "1px solid",
                                borderColor: checked ? "divider" : "transparent",
                                alignItems: "flex-start", 
                                "& .MuiCheckbox-root": { pt: 0.25 } 
                              }}
                            />
                          );
                        })}
                      </FormGroup>
                      {index < 2 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Box>

          {/* Assigned users details */}
          <Box sx={{ flex: 1 }}>
            <Card className="border-none shadow-xl rounded-3xl bg-white dark:bg-slate-900" sx={{ backgroundImage: "none", p: 3 }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="h6" className="font-bold mb-3">
                  Assigned Users ({assignedUsers.length})
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  Users list currently mapped to this security policy:
                </Typography>

                <Stack spacing={2}>
                  {assignedUsers.map((u) => (
                    <Paper
                      key={u.id}
                      variant="outlined"
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        borderColor: "divider",
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2, 
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.hover" }
                      }}
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis" 
                          }}
                        >
                          {u.email}
                        </Typography>
                        <Chip label={u.role} size="small" sx={{ mt: 0.5, height: 20, fontSize: "0.7rem", fontWeight: "bold" }} />
                      </Box>
                    </Paper>
                  ))}
                  {assignedUsers.length === 0 && (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center", py: 2 }}>
                      No user accounts currently assigned.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
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

export default RoleDetails;
