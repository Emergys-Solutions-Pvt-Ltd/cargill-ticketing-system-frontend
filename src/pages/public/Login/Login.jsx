import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  Paper,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
  AccountCircle as UserIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { getStoredUsers } from "../../../utils/rbacData";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill out both username and password fields.");
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleQuickLogin = (userPrefix) => {
    setUsername(userPrefix);
    setPassword(userPrefix);
    setError("");
  };

  // Get active test accounts to display dynamically in helper section
  const testAccounts = React.useMemo(() => {
    const list = [{ prefix: "admin", label: "Org Admin" }];
    const users = getStoredUsers();
    users.forEach(u => {
      const prefix = u.email.split("@")[0].toLowerCase();
      if (prefix !== "admin" && !list.some(x => x.prefix === prefix)) {
        list.push({
          prefix,
          label: u.role
        });
      }
    });
    return list;
  }, []);

  return (
    <Box 
      sx={{
        background: "linear-gradient(135deg, #1B3D41 0%, #0E2325 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        py: 6
      }}
    >
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <Box className="flex flex-col items-center mb-6">
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 400, color: "#ffffff", letterSpacing: "-1.5px" }}>
              service
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#81B563", letterSpacing: "-1.5px" }}>
              now
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
            Enterprise Service Portal
          </Typography>
        </Box>

        <Card
          className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900"
          sx={{ backgroundImage: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "text.primary" }}>
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" className="rounded-xl mb-4 font-medium">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="e.g. admin"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserIcon className="text-slate-400 dark:text-slate-500" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="text-slate-400 dark:text-slate-500" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    }
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "12px",
                    height: "50px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    boxShadow: "0 8px 16px rgba(129, 181, 99, 0.15)",
                  }}
                >
                  Log In
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Quick Login Helpers */}
        <Paper
          variant="outlined"
          sx={{ 
            borderColor: "rgba(255, 255, 255, 0.15)", 
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            mt: 4,
            p: 3,
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: "bold", color: "rgba(255, 255, 255, 0.7)", uppercase: true, tracking: "0.5px", display: "block", mb: 2 }}>
            DEVELOPER QUICK-LOGIN PROFILES
          </Typography>
          <Box className="flex flex-wrap justify-center gap-2">
            {testAccounts.map((acc) => (
              <Chip
                key={acc.prefix}
                label={`${acc.prefix} (${acc.label})`}
                onClick={() => handleQuickLogin(acc.prefix)}
                variant="outlined"
                size="small"
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.15)",
                    borderColor: "#81B563"
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      </div>
    </Box>
  );
};

export default Login;
