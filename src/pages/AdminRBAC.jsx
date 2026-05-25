import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const AdminRBAC = () => {
  const [users, setUsers] = useState([
    { id: 1, email: "admin@cargil.com", role: "Admin", status: "Active" },
    {
      id: 2,
      email: "finance_lead@cargil.com",
      role: "Finance",
      status: "Active",
    },
    { id: 3, email: "hr_manager@cargil.com", role: "HR", status: "Active" },
  ]);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  
  // Edit State
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("");

  const handleAddUser = () => {
    if (!email || !email.includes("@")) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
      });
      return;
    }

    const newUser = {
      id: users.length + 1,
      email,
      role,
      status: "Active",
    };

    setUsers([...users, newUser]);
    setEmail("");
    setRole("User");
    setSnackbar({
      open: true,
      message: `Role assigned successfully to ${email}!`,
    });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditRole(user.role);
    setOpenEditDialog(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: editRole } : u));
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: `Role updated for ${editingUser.email}!`,
    });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setSnackbar({ open: true, message: "User access revoked." });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Finance":
        return "primary";
      case "HR":
        return "secondary";
      default:
        return "default";
    }
  };


  return (
    <Box className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <AdminIcon fontSize="large" />
          </div>
          <div>
            <Typography variant="h4" className="font-bold text-slate-800">
              User Management
            </Typography>
            <Typography variant="body2" className="text-slate-500 font-medium">
              Assign and manage role-based access control for your organization.
            </Typography>
          </div>
        </div>

        {/* Add User Section */}
        <Card className="border-none shadow-xl rounded-3xl mb-10 overflow-visible">
          <CardContent className="p-8">
            <Box sx={{ marginBottom: "15px" }}>
              <Typography
                variant="h6"
                className="font-bold text-slate-800 mb-6"
              >
                Assign New Role
              </Typography>
            </Box>
            <Grid container spacing={4} alignItems="flex-end">
              <Grid item xs={12} md={5} sx={{ padding: "12px" }}>
                <TextField
                  fullWidth
                  label="User Email Address"
                  placeholder="e.g. user@cargil.com"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon className="text-slate-400 mr-2" />
                    ),
                  }}
                  className="bg-white"
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ padding: "12px" }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Assign Role</InputLabel>
                  <Select
                    value={role}
                    label="Assign Role"
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-white"
                  >
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="User">Standard User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} sx={{ padding: "12px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleAddUser}
                  startIcon={<PersonAddIcon />}
                  sx={{
                    height: "56px",
                    borderRadius: "12px",
                    paddingX: "32px !important",
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)",
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Assign Access
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Typography variant="h6" className="font-bold text-slate-800 mb-4 px-2">
          Current Access List
        </Typography>
        <TableContainer
          component={Paper}
          className="border-none shadow-xl rounded-3xl overflow-hidden"
        >
          <Table>
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-bold text-slate-600 uppercase tracking-wider text-xs p-5">
                  User
                </TableCell>
                <TableCell className="font-bold text-slate-600 uppercase tracking-wider text-xs p-5">
                  Role
                </TableCell>
                <TableCell className="font-bold text-slate-600 uppercase tracking-wider text-xs p-5">
                  Status
                </TableCell>
                <TableCell className="font-bold text-slate-600 uppercase tracking-wider text-xs p-5 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="p-5">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <Typography
                        variant="body2"
                        className="font-semibold text-slate-700"
                      >
                        {user.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell className="p-5">
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      className="font-bold rounded-lg px-2"
                      variant={user.role === "User" ? "outlined" : "filled"}
                    />
                  </TableCell>
                  <TableCell className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <Typography
                        variant="caption"
                        className="font-bold text-slate-500 uppercase"
                      >
                        {user.status}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-right">
                    <Tooltip title="Edit Access">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(user)}
                        className="text-slate-400 hover:text-indigo-600 mr-2"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Revoke Access">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="p-10 text-center">
                    <Typography className="text-slate-400 italic">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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

        {/* Edit Role Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)}
          PaperProps={{
            sx: { borderRadius: "24px", padding: "8px", width: "100%", maxWidth: "450px" }
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#1e293b", pb: 1 }}>
            Update User Role
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              Choose a new role for <strong>{editingUser?.email}</strong>.
            </Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Assigned Role</InputLabel>
              <Select
                value={editRole}
                label="Assigned Role"
                onChange={(e) => setEditRole(e.target.value)}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="User">Standard User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setOpenEditDialog(false)}
              sx={{ color: "#64748b", fontWeight: "bold", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateUser}
              startIcon={<SaveIcon />}
              sx={{ 
                bgcolor: "#4f46e5", 
                borderRadius: "12px", 
                px: 3, 
                fontWeight: "bold", 
                textTransform: "none",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

// Simple Grid replacement if not using full context
const Grid = ({
  children,
  container,
  md,
  spacing,
  alignItems,
  sx,
}) => {
  if (container) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: alignItems === "flex-end" ? "flex-end" : "flex-start",
          margin: spacing ? `-${spacing * 4}px` : 0,
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        padding: spacing ? `${spacing * 2}px` : 0,
        "@media (min-width: 900px)": {
          width:
            md === 3
              ? "25%"
              : md === 4
              ? "33.33%"
              : md === 5
              ? "41.66%"
              : "100%",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default AdminRBAC;
