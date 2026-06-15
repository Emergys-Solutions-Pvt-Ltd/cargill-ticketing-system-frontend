import React, { useState, useEffect } from "react";
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../../context/AuthContext";
import { getStoredTickets, getStoredTicketsAsync, setStoredTickets } from "../../../utils/rbacData";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState(() => getStoredTickets());

  useEffect(() => {
    if (tickets.length === 0) {
      getStoredTicketsAsync().then((fetchedTickets) => {
        setTickets(fetchedTickets);
      });
    }
  }, [tickets]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);

  // Dialog states
  const [openIncident, setOpenIncident] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const [openKbArticle, setOpenKbArticle] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Incident Form state
  const [incTitle, setIncTitle] = useState("");
  const [incDesc, setIncDesc] = useState("");
  const [incUrgency, setIncUrgency] = useState("Medium");
  const [incImpact, setIncImpact] = useState("Medium");
  const [incCategory, setIncCategory] = useState("Software");

  // Request Form state
  const [reqItem, setReqItem] = useState("Adobe Creative Cloud");
  const [reqJustify, setReqJustify] = useState("");
  const [reqUrgency, setReqUrgency] = useState("Medium");

  // Selected KB Article
  const [selectedKb, setSelectedKb] = useState(null);

  const kbArticles = [
    {
      id: "KB0010045",
      title: "How to Request Vulnerability Scan on QA Environment",
      content: "To trigger a vulnerability scan, navigate to the Get Help widget on the Home page, select the 'Security Assessment' category, specify your target QA environment url, and attach any config details."
    },
    {
      id: "KB0010046",
      title: "Database Access Control Policy & Level Privileges",
      content: "Organization Admin (Level 1) can configure permissions, create custom roles, and add new users. Department Admins (Level 2) can manage settings and view analytics. Standard Users (Level 3) can raise support requests."
    },
    {
      id: "KB0010047",
      title: "Requesting Laptop / Hardware Replacements",
      content: "Hardware requests can be submitted via the 'Request Items' widget. Select the 'Hardware' category, fill in the specifications of the machine (e.g. RAM, storage, processor), and hit submit."
    }
  ];

  const displayName = React.useMemo(() => {
    if (!user || !user.email) return "Guest";
    const namePart = user.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const results = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(value.toLowerCase()) ||
          t.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setSearchAnchor(e.currentTarget);
    } else {
      setSearchResults([]);
      setSearchAnchor(null);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/requests/${id}`);
    setSearchAnchor(null);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/requests`);
    }
  };

  // Submit new incident (INC)
  const handleSubmitIncident = (e) => {
    e.preventDefault();
    if (!incTitle.trim() || !incDesc.trim()) {
      setToast({ open: true, message: "Please fill out all mandatory fields.", severity: "error" });
      return;
    }

    const nextIncNum = 10045 + tickets.filter(t => t.id.startsWith("INC")).length;
    const newIncident = {
      id: `INC00${nextIncNum}`,
      title: incTitle,
      status: "New",
      created: "Just now",
      updated: "Just now",
      priority: incUrgency === "High" && incImpact === "High" ? "Critical" : incUrgency === "High" || incImpact === "High" ? "High" : "Medium",
      assignee: "Triage Queue",
      department: user?.role === "Org Admin" ? "IT Security Administration" : "Help Desk Services",
      category: incCategory,
      urgency: incUrgency,
      impact: incImpact,
      comments: [
        {
          id: 1,
          author: displayName,
          avatar: displayName.charAt(0),
          time: "Just now",
          text: `Incident reported: ${incDesc}`
        }
      ]
    };

    const updatedTickets = [newIncident, ...tickets];
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);

    setIncTitle("");
    setIncDesc("");
    setIncUrgency("Medium");
    setIncImpact("Medium");
    setIncCategory("Software");
    setOpenIncident(false);

    setToast({ open: true, message: `Incident ${newIncident.id} created successfully!`, severity: "success" });
  };

  // Submit new request (REQ)
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!reqJustify.trim()) {
      setToast({ open: true, message: "Please provide a justification.", severity: "error" });
      return;
    }

    const nextReqNum = 1236 + tickets.filter(t => t.id.startsWith("REQ")).length;
    const newRequest = {
      id: `REQ000${nextReqNum}`,
      title: `Order Request: ${reqItem}`,
      status: "Pending",
      created: "Just now",
      updated: "Just now",
      priority: reqUrgency === "High" ? "High" : "Medium",
      assignee: "Catalog Approval Manager",
      department: "Procurement Services",
      category: reqItem.includes("Laptop") ? "Hardware" : "Software Request",
      urgency: reqUrgency,
      impact: "Low",
      comments: [
        {
          id: 1,
          author: displayName,
          avatar: displayName.charAt(0),
          time: "Just now",
          text: `Item ordered: ${reqItem}. Business Justification: ${reqJustify}`
        }
      ]
    };

    const updatedTickets = [newRequest, ...tickets];
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);

    setReqJustify("");
    setReqUrgency("Medium");
    setOpenRequest(false);

    setToast({ open: true, message: `Service Request ${newRequest.id} raised successfully!`, severity: "success" });
  };

  const handleOpenKb = (art) => {
    setSelectedKb(art);
    setOpenKbArticle(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
      {/* Cargill Portal Banner */}
      <Box
        sx={{
          bgcolor: "#1B3D41",
          position: "relative",
          height: "260px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          px: 2,
          boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.15)"
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 300,
            mb: 1,
            textAlign: "center",
            letterSpacing: "-0.5px"
          }}
        >
          How can we help?
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255,255,255,0.75)",
            mb: 3,
            textAlign: "center",
            fontWeight: 500
          }}
        >
          Search the Service Catalog, Knowledge Base, or view your open requests.
        </Typography>

        {/* Global search */}
        <Box sx={{ width: "100%", maxWidth: "620px", position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Type your question or request ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                color: "#1F2D2E",
                borderRadius: "8px",
                px: 2,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                height: "48px",
                "& fieldset": { border: "none" }
              }
            }}
          />

          {/* Search results Menu */}
          <Menu
            anchorEl={searchAnchor}
            open={Boolean(searchAnchor) && searchResults.length > 0}
            onClose={() => setSearchAnchor(null)}
            autoFocus={false}
            disableAutoFocusItem
            PaperProps={{
              sx: {
                width: searchAnchor ? searchAnchor.clientWidth : "auto",
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                maxHeight: "280px",
                backgroundImage: "none"
              }
            }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                MATCHING TICKETS
              </Typography>
            </Box>
            {searchResults.map((t) => (
              <MenuItem
                key={t.id}
                onClick={() => handleResultClick(t.id)}
                sx={{ py: 1.5, display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {t.id}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {t.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Grid container */}
      <Box sx={{ maxWidth: "1240px", mx: "auto", px: { xs: 2, md: 4 }, mt: 5 }}>
        <Grid container spacing={4}>
          {/* Sidebar - Recently Viewed */}
          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "divider",
                bgcolor: "background.paper",
                backgroundImage: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                  Recently Viewed Tickets
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List disablePadding>
                  {tickets.slice(0, 4).map((ticket) => (
                    <ListItem
                      key={ticket.id}
                      disableGutters
                      secondaryAction={
                        <IconButton size="small" edge="end" onClick={() => navigate(`/requests/${ticket.id}`)}>
                          <ChevronRightIcon />
                        </IconButton>
                      }
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:last-child": { border: 0 },
                        py: 2
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Avatar sx={{ bgcolor: "action.hover", color: "primary.main", width: 32, height: 32 }}>
                          {ticket.id.startsWith("INC") ? <ReportProblemIcon fontSize="inherit" /> : <HistoryIcon fontSize="inherit" />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ticket.id}
                        secondary={ticket.title}
                        primaryTypographyProps={{ fontWeight: "bold", fontSize: "0.85rem", color: "primary.main" }}
                        secondaryTypographyProps={{
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "180px"
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/requests")}
                  sx={{ mt: 2, textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
                >
                  View All Open Tickets ({tickets.length})
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "divider",
                bgcolor: "background.paper",
                backgroundImage: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                  Recently Searched Tickets
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List disablePadding>
                  {tickets.slice(0, 4).map((ticket) => (
                    <ListItem
                      key={ticket.id}
                      disableGutters
                      secondaryAction={
                        <IconButton size="small" edge="end" onClick={() => navigate(`/requests/${ticket.id}`)}>
                          <ChevronRightIcon />
                        </IconButton>
                      }
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:last-child": { border: 0 },
                        py: 2
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Avatar sx={{ bgcolor: "action.hover", color: "primary.main", width: 32, height: 32 }}>
                          {ticket.id.startsWith("INC") ? <ReportProblemIcon fontSize="inherit" /> : <HistoryIcon fontSize="inherit" />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ticket.id}
                        secondary={ticket.title}
                        primaryTypographyProps={{ fontWeight: "bold", fontSize: "0.85rem", color: "primary.main" }}
                        secondaryTypographyProps={{
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "180px"
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/requests")}
                  sx={{ mt: 2, textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
                >
                  View All Open Tickets ({tickets.length})
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* dialog 1: Create Incident */}
      <Dialog
        open={openIncident}
        onClose={() => setOpenIncident(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <ReportProblemIcon sx={{ color: "error.main" }} />
          Create Incident (Record Outage/Error)
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmitIncident}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
            <TextField
              required
              fullWidth
              label="Short Description"
              placeholder="e.g. Production Database connection timeout error"
              value={incTitle}
              onChange={(e) => setIncTitle(e.target.value)}
            />
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Incident Details / Steps to Reproduce"
              placeholder="Describe the problem, error messages, and how to trigger the issue..."
              value={incDesc}
              onChange={(e) => setIncDesc(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Urgency</InputLabel>
                  <Select
                    value={incUrgency}
                    label="Urgency"
                    onChange={(e) => setIncUrgency(e.target.value)}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Impact</InputLabel>
                  <Select
                    value={incImpact}
                    label="Impact"
                    onChange={(e) => setIncImpact(e.target.value)}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={incCategory}
                    label="Category"
                    onChange={(e) => setIncCategory(e.target.value)}
                  >
                    <MenuItem value="Software">Software</MenuItem>
                    <MenuItem value="Hardware">Hardware</MenuItem>
                    <MenuItem value="Access Management">Access Management</MenuItem>
                    <MenuItem value="Security Assessment">Security Assessment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenIncident(false)} color="inherit" sx={{ fontWeight: "bold" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="error" sx={{ fontWeight: "bold", borderRadius: "8px" }}>
              Submit Incident
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* dialog 2: Service Catalog Order Item */}
      <Dialog
        open={openRequest}
        onClose={() => setOpenRequest(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCartIcon sx={{ color: "primary.main" }} />
          Service Catalog - Request Item
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmitRequest}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Choose Catalog Item</InputLabel>
              <Select
                value={reqItem}
                label="Choose Catalog Item"
                onChange={(e) => setReqItem(e.target.value)}
              >
                <MenuItem value="Adobe Creative Cloud Suite License">Adobe Creative Cloud Suite License</MenuItem>
                <MenuItem value="Standard Developer Laptop (16GB RAM)">Standard Developer Laptop (16GB RAM)</MenuItem>
                <MenuItem value="Production Database Access Role">Production Database Access Role</MenuItem>
                <MenuItem value="QA Environment Server Allocation">QA Environment Server Allocation</MenuItem>
                <MenuItem value="Microsoft 365 Enterprise License">Microsoft 365 Enterprise License</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Business Justification"
              placeholder="Why is this software/hardware required for your role?"
              value={reqJustify}
              onChange={(e) => setReqJustify(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={reqUrgency}
                label="Urgency"
                onChange={(e) => setReqUrgency(e.target.value)}
              >
                <MenuItem value="Low">Low - Standard Triage</MenuItem>
                <MenuItem value="Medium">Medium - Regular Queue</MenuItem>
                <MenuItem value="High">High - Urgent Project Requirement</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenRequest(false)} color="inherit" sx={{ fontWeight: "bold" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: "bold", borderRadius: "8px" }}>
              Raise Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* dialog 3: View KB Article */}
      <Dialog
        open={openKbArticle}
        onClose={() => setOpenKbArticle(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <BookIcon sx={{ color: "secondary.main" }} />
          Knowledge Article Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {selectedKb && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}>
                {selectedKb.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2, fontWeight: 600 }}>
                Article ID: {selectedKb.id} • Cargill Triage Database
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.8, bgcolor: "action.hover", p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                {selectedKb.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenKbArticle(false)} color="inherit" sx={{ fontWeight: "bold" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" className="rounded-xl shadow-lg">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box >
  );
}
