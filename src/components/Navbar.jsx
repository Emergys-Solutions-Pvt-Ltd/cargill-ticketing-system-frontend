import * as React from "react";
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
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const kbArticles = [
  {
    id: "KB0010045",
    title: "How to Request Vulnerability Scan on QA Environment",
    content: "To trigger a vulnerability scan, navigate to the Get Help widget on the Home page, select the 'Security Assessment' category, specify your target QA environment url, and attach any config details. The security team will triage within 24 hours."
  },
  {
    id: "KB0010046",
    title: "Database Access Control Policy & Level Privileges",
    content: "Organization Admin (Level 1) can configure permissions, create custom roles, and add new users. Department Admins (Level 2) can manage settings and view analytics. Standard Users (Level 3) can raise support requests and post comments."
  },
  {
    id: "KB0010047",
    title: "Requesting Laptop / Hardware Replacements",
    content: "Hardware requests can be submitted via the 'Request Items' widget on the Service Portal home screen. Select the 'Hardware' category, fill in the specifications of the machine (e.g. RAM, storage, processor), and hit submit."
  },
  {
    id: "KB0010048",
    title: "Cargill Service Portal Quick Authentication",
    content: "The portal supports developer quick-login. You can use standard local profiles like 'admin', 'hr_admin', 'finance_admin', or 'user'. The password is identical to the username prefix."
  }
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [kbOpen, setKbOpen] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState(null);
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
      <AppBar
        position="static"
        sx={{
          bgcolor: mode === "light" ? "#1B3D41" : "#141f21",
          color: "#ffffff",
          borderBottom: "1px solid",
          borderColor: mode === "light" ? "#0e2325" : "rgba(255,255,255,0.08)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
        elevation={0}
      >
        <Toolbar sx={{ minHeight: "64px" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 400, letterSpacing: "-0.5px" }}>Cargill</span>
              <span style={{
                fontSize: "0.75rem",
                opacity: 0.8,
                marginLeft: "10px",
                borderLeft: "1px solid rgba(255,255,255,0.3)",
                paddingLeft: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Portal
              </span>
            </Link>
          </Typography>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ marginRight: 4 }}>
              <ul style={{ display: "flex", gap: 24, listStyle: "none", padding: 0, margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
                <li>
                  <Link to="/" style={linkStyle}>
                    Service Catalog
                  </Link>
                </li>
                <li>
                  <Box onClick={() => setKbOpen(true)} style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "4px" }}>
                    Knowledge Base
                  </Box>
                </li>
                <li>
                  <Link to="/requests" style={linkStyle}>
                    My Requests
                  </Link>
                </li>
                <li>
                  <Link to="/uam" style={linkStyle}>
                    Access Control
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
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  padding: "4px 0",
                  backgroundImage: "none"
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
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-slate-700">
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

      {/* Simulated Knowledge Base Dialog */}
      <Dialog
        open={kbOpen}
        onClose={() => { setKbOpen(false); setSelectedArticle(null); }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1.5, pb: 1.5 }}>
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
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}>
                {selectedArticle.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2, fontWeight: 600 }}>
                Article ID: {selectedArticle.id} • Views: 124 • Rating: ★★★★☆
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.8, bgcolor: "action.hover", p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                {selectedArticle.content}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
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
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      <ListItemText
                        primary={art.title}
                        secondary={art.id}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                        secondaryTypographyProps={{ fontSize: "0.75rem", fontWeight: "bold" }}
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
          <Button onClick={() => { setKbOpen(false); setSelectedArticle(null); }} color="inherit" sx={{ fontWeight: "bold" }}>
            Close Portal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

