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
import { useAuth } from "../context/AuthContext";
import { getStoredUsers } from "../utils/rbacData";

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
    <Box className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <Box className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-200 dark:shadow-none mb-3">
            C
          </div>
          <Typography variant="h4" className="font-extrabold text-slate-800 dark:text-slate-100">
            Cargill
          </Typography>
          <Typography variant="body2" className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Sign in to access your support ticketing portal
          </Typography>
        </Box>

        <Card
          className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900"
          sx={{ backgroundImage: "none" }}
        >
          <CardContent sx={{ p: 4 }}>
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
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: "14px",
                    height: "52px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 8px 16px rgba(79, 70, 229, 0.2)",
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Quick Login Helpers */}
        <Paper
          variant="outlined"
          className="mt-6 p-4 rounded-2xl border-dashed bg-slate-50/50 dark:bg-slate-900/30 text-center hidden"
          sx={{ borderColor: "divider" }}
        >
          <Typography variant="caption" className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Quick-Login Profiles (Username = Password)
          </Typography>
          <Box className="flex flex-wrap justify-center gap-2">
            {testAccounts.map((acc) => (
              <Chip
                key={acc.prefix}
                label={`${acc.prefix} (${acc.label})`}
                onClick={() => handleQuickLogin(acc.prefix)}
                variant="outlined"
                size="small"
                className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 border-slate-200 dark:border-slate-800 transition-colors font-medium rounded-lg"
              />
            ))}
          </Box>
        </Paper>
      </div>
    </Box>
  );
};

export default Login;
