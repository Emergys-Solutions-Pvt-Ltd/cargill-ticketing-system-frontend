import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  InputAdornment,
  Menu,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RequestPageIcon from "@mui/icons-material/Description";
import { useAuth } from "../context/AuthContext";

const dummyRequests = [
  { id: "REQ000123456", title: "Request to initiate dynamic scan on SXR QA Environment" },
  { id: "REQ000123457", title: "Access request for Production Database" },
  { id: "REQ000123458", title: "Software installation: Adobe Creative Cloud" },
  { id: "REQ000123459", title: "Laptop replacement request" }
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Extract friendly display name from logged-in user's email
  const displayName = React.useMemo(() => {
    if (!user || !user.email) return "Admin";
    const namePart = user.email.split("@")[0];
    // Capitalize first letters
    return namePart
      .split(".")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const results = dummyRequests.filter(
        (r) =>
          r.id.toLowerCase().includes(value.toLowerCase()) ||
          r.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setAnchorEl(e.currentTarget);
    } else {
      setSearchResults([]);
      setAnchorEl(null);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/requests`);
    }
  };

  const handleResultClick = (requestId) => {
    navigate(`/requests/${requestId}`);
    setAnchorEl(null);
  };

  const handleCloseResults = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
      {/* Subheader bar matching the Technology services dark bar */}
      <Box 
        sx={{ 
          bgcolor: "#1e1e1e", 
          color: "#ffffff", 
          px: 3, 
          py: 1, 
          display: "flex", 
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 0.5, 
            cursor: "pointer",
            fontWeight: 500,
            opacity: 0.9,
            "&:hover": { opacity: 1 },
            fontSize: "0.85rem",
            userSelect: "none"
          }}
        >
          Technology services <KeyboardArrowDownIcon sx={{ fontSize: "1rem" }} />
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          height: "280px",
          backgroundImage: 'url("/keyboard_typing_banner.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.55)",
            zIndex: 1
          }
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: "#ffffff", 
            fontWeight: 600, 
            mb: 2.5, 
            zIndex: 2,
            fontFamily: "'Outfit', 'Inter', sans-serif",
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
          }}
        >
          Hello, {displayName}
        </Typography>

        {/* Search Input field */}
        <Box sx={{ width: "100%", maxWidth: "680px", zIndex: 2, position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                color: "#000000",
                borderRadius: "30px",
                px: 2.5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                height: "50px",
                "& fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" }
              }
            }}
          />

          {/* live suggestions menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && searchResults.length > 0}
            onClose={handleCloseResults}
            autoFocus={false}
            disableAutoFocusItem
            PaperProps={{
              sx: {
                width: anchorEl ? anchorEl.clientWidth : "auto",
                mt: 1,
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                maxHeight: "300px",
                overflow: "auto",
                backgroundImage: "none"
              }
            }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                REQUESTS MATCHING SEARCH
              </Typography>
            </Box>
            {searchResults.map((req) => (
              <MenuItem 
                key={req.id} 
                onClick={() => handleResultClick(req.id)}
                sx={{ py: 1.5, display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {req.id}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "normal" }}>
                  {req.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Grid container */}
      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, mt: 5 }}>
        <Grid container spacing={4}>
          
          {/* Quick links Card */}
          <Grid item xs={12} md={8}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 4, 
                border: "1px solid", 
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3.5, 
                    color: "text.primary",
                    fontFamily: "'Outfit', 'Inter', sans-serif"
                  }}
                >
                  Quick links
                </Typography>
                
                <Grid container spacing={3}>
                  
                  {/* Attachments Card */}
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      onClick={() => navigate("/requests/REQ000123456")}
                      sx={{
                        borderRadius: 3,
                        borderColor: "divider",
                        textAlign: "center",
                        p: 3,
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "center" }}>
                        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M32 56C32 56 10 40 10 24C10 14 18 8 26 12C32 15 32 19 32 19C32 19 32 15 38 12C46 8 54 14 54 24C54 40 32 56 32 56Z" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="32" cy="24" r="10" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                          <path d="M32 20V28M28 24H36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem" }}>
                        Attachments
                      </Typography>
                    </Card>
                  </Grid>

                  {/* All Requests Card */}
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      onClick={() => navigate("/requests")}
                      sx={{
                        borderRadius: 3,
                        borderColor: "divider",
                        textAlign: "center",
                        p: 3,
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "center" }}>
                        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 16C10 13.7909 11.7909 12 14 12H24L30 18H50C52.2091 18 54 19.7909 54 22V48C54 50.2091 52.2091 52 50 52H14C11.7909 52 10 50.2091 10 48V16Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
                          <circle cx="44" cy="38" r="11" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
                          <path d="M44 32V38H48" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem" }}>
                        All Requests
                      </Typography>
                    </Card>
                  </Grid>

                  {/* Admin Card */}
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      onClick={() => navigate("/admin")}
                      sx={{
                        borderRadius: 3,
                        borderColor: "divider",
                        textAlign: "center",
                        p: 3,
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "center" }}>
                        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="24" width="36" height="20" rx="4" fill="#f3f4f6" stroke="#4b5563" strokeWidth="3" />
                          <path d="M12 28H16M20 28H24M28 28H32M36 28H40" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 34H16M20 34H24M28 34H36M40 34V40" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
                          <rect x="48" y="20" width="10" height="20" rx="5" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
                          <path d="M53 20V30M48 27H58" stroke="#0284c7" strokeWidth="1.5" />
                          <path d="M44 34C46 34 48 36 48 38" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="2 2" />
                        </svg>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem" }}>
                        Admin
                      </Typography>
                    </Card>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* My Items Card */}
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 4, 
                border: "1px solid", 
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: "text.primary",
                    fontFamily: "'Outfit', 'Inter', sans-serif"
                  }}
                >
                  My items
                </Typography>
                
                <List disablePadding>
                  
                  {/* Tasks Item */}
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.9rem" }}>
                          0
                        </Typography>
                        <IconButton size="small" edge="end" onClick={() => navigate("/admin")}>
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{ borderBottom: "1px solid", borderColor: "divider", py: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "rgba(99, 102, 241, 0.15)", 
                          color: "#6366f1",
                          width: 36,
                          height: 36
                        }}
                      >
                        <AssignmentTurnedInIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tasks" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }} 
                    />
                  </ListItem>

                  {/* Requests Item */}
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.9rem" }}>
                          {dummyRequests.length}
                        </Typography>
                        <IconButton size="small" edge="end" onClick={() => navigate("/requests")}>
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 46 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "rgba(59, 130, 246, 0.15)", 
                          color: "#3b82f6",
                          width: 36,
                          height: 36
                        }}
                      >
                        <RequestPageIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Requests" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }} 
                    />
                  </ListItem>

                </List>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}
