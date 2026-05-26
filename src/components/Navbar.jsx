import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { mode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const linkStyle = {
    color: "inherit",
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >

          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>

            <Link to="/requests" style={linkStyle}>
              Cargill
            </Link>
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginRight: 5 }}>
              <ul
                style={{
                  display: "flex",
                  gap: 30,
                  marginLeft: 5,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {/* <li>
                  <Link to="/" style={linkStyle}>
                    My Task
                  </Link>
                </li> */}
                <li>
                  <Link to="/requests" style={linkStyle}>
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/uam" style={linkStyle}>
                    User Access Management
                  </Link>
                </li>


              </ul>
            </Box>
            <IconButton
              size="large"
              aria-label="toggle dark and light theme"
              onClick={toggleTheme}
              color="inherit"
              sx={{ mr: 1 }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {user && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  mr: 1,
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={handleMenu}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.85rem", opacity: 0.9 }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 600 }}>
                  {user.role}
                </Typography>
              </Box>
            )}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: "220px",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  padding: "4px 0"
                }
              }}
            >
              {user && (
                <Box sx={{ px: 2, py: 1.5, outline: "none" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    Signed in as
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {user.role}
                    </span>
                  </Box>
                </Box>
              )}
              <Divider />
              <MenuItem
                onClick={handleClose}
                component={Link}
                to="/profile"
                sx={{ py: 1.25, fontWeight: 500, fontSize: "0.9rem" }}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
                sx={{ py: 1.25, color: "error.main", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

