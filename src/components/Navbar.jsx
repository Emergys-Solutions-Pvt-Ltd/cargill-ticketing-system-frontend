import * as React from "react";
import { useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookIcon from "@mui/icons-material/Book";
import Avatar from "@mui/material/Avatar";
import { Link, NavLink } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import cargillLogo from "../assets/cargill_logo.svg";
import LogoutIcon from "../assets/icons/logout.svg";

const getDisplayName = (email) => {
  if (!email) return "Guest User";
  const namePart = email.split("@")[0];
  return namePart
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getInitials = (name) => {
  if (!name) return "G";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const kbArticles = [
  {
    id: "KB0010045",
    title: "How to Request Vulnerability Scan on QA Environment",
    content:
      "To trigger a vulnerability scan, navigate to the Get Help widget on the Home page, select the 'Security Assessment' category, specify your target QA environment url, and attach any config details. The security team will triage within 24 hours.",
  },
  {
    id: "KB0010046",
    title: "Database Access Control Policy & Level Privileges",
    content:
      "Organization Admin (Level 1) can configure permissions, create custom roles, and add new users. Department Admins (Level 2) can manage settings and view analytics. Standard Users (Level 3) can raise support requests and post comments.",
  },
  {
    id: "KB0010047",
    title: "Requesting Laptop / Hardware Replacements",
    content:
      "Hardware requests can be submitted via the 'Request Items' widget on the Service Portal home screen. Select the 'Hardware' category, fill in the specifications of the machine (e.g. RAM, storage, processor), and hit submit.",
  },
  {
    id: "KB0010048",
    title: "Cargill Service Portal Quick Authentication",
    content:
      "The portal supports developer quick-login. You can use standard local profiles like 'admin', 'hr_admin', 'finance_admin', or 'user'. The password is identical to the username prefix.",
  },
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [kbOpen, setKbOpen] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const { mode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();

  const navLinkStyle = useMemo(
    () =>
      ({ isActive }) => ({
        color: mode === "light" ? "#000000" : "#ffffff",
        textDecoration: "none",
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        fontWeight: 500,
        transition: "all 0.2s ease",
        backgroundColor: isActive ? "#0B8F4D" : "transparent",
      }),
    [mode],
  );

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
    <Box sx={{ width: "100%" }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: mode === "light" ? "background.paper" : "#1B3D41",
          color: mode === "light" ? "#000000" : "#ffffff",
          borderBottom: "1px solid",
          borderColor: mode === "light" ? "#E0E1E0" : "rgba(255,255,255,0.08)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            minHeight: "64px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div id="navbar-logo">
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
            >
              <Link
                to="/"
                style={{
                  ...linkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Box
                  component="img"
                  src={cargillLogo}
                  alt="Cargill Logo"
                  sx={{ height: "36px", width: "84px", display: "block" }}
                />
              </Link>
            </Typography>
          </div>

          {/* <div id="navbar-links">
            <Box>
              <ul
                style={{
                  display: "flex",
                  gap: 5,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <li>
                  <NavLink to="/requests" style={navLinkStyle}>
                    My Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/uam" style={navLinkStyle}>
                    Access Control
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/rbac" style={navLinkStyle}>
                    RBAC
                  </NavLink>
                </li>
              </ul>
            </Box>
          </div> */}

          <div
            id="navbar-actions"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {user ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  ml: 2,
                  mr: 1,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={handleMenu}
              >
                <Avatar
                  sx={{
                    bgcolor: "#0b8043",
                    color: "white",
                    fontWeight: "bold",
                    width: 32,
                    height: 32,
                    fontSize: "1rem",
                  }}
                >
                  AJ
                </Avatar>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1F2A37",
                      lineHeight: "14px",
                    }}
                  >
                    Alex Johnson
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "11px",
                      color: "#374151",
                      fontWeight: 500,
                      lineHeight: "12px",
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            ) : (
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
            )}

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
                  // mt: 1.5,
                  minWidth: "220px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  // padding: "4px 0",
                  backgroundImage: "none",
                  padding: 0,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  component="img"
                  src={LogoutIcon}
                  alt="Filter"
                  sx={{ color: "#000000" }}
                />
                <Typography
                  sx={{
                    // py: 1.25,
                    color: "#374151",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Simulated Knowledge Base Dialog */}
      <Dialog
        open={kbOpen}
        onClose={() => {
          setKbOpen(false);
          setSelectedArticle(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 1.5,
          }}
        >
          <BookIcon sx={{ color: "secondary.main" }} />
          {selectedArticle ? "Knowledge Article" : "Knowledge Base Portal"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3, minHeight: "240px" }}>
          {selectedArticle ? (
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setSelectedArticle(null)}
                sx={{ mb: 2, textTransform: "none", fontWeight: "bold" }}
                size="small"
              >
                Back to Articles
              </Button>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}
              >
                {selectedArticle.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                Article ID: {selectedArticle.id} • Views: 124 • Rating: ★★★★☆
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  lineHeight: 1.8,
                  bgcolor: "action.hover",
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {selectedArticle.content}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Search or browse active troubleshooting manuals and guides.
              </Typography>
              <List disablePadding>
                {kbArticles.map((art) => (
                  <ListItem key={art.id} disablePadding sx={{ mb: 1.5 }}>
                    <ListItemButton
                      onClick={() => setSelectedArticle(art)}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <ListItemText
                        primary={art.title}
                        secondary={art.id}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setKbOpen(false);
              setSelectedArticle(null);
            }}
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            Close Portal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
