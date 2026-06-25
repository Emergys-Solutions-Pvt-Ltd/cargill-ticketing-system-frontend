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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookIcon from "@mui/icons-material/Book";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../../context/AuthContext";
import {
  getStoredTickets,
  getStoredTicketsAsync,
  setStoredTickets,
} from "../../../utils/rbacData";
import Group2 from "../../../assets/Group-2.png";
import Group3 from "../../../assets/Group-3.png";
import Chip from "@mui/material/Chip";

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

  // Dialog states
  const [openIncident, setOpenIncident] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const [openKbArticle, setOpenKbArticle] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      content:
        "To trigger a vulnerability scan, navigate to the Get Help widget on the Home page, select the 'Security Assessment' category, specify your target QA environment url, and attach any config details.",
    },
    {
      id: "KB0010046",
      title: "Database Access Control Policy & Level Privileges",
      content:
        "Organization Admin (Level 1) can configure permissions, create custom roles, and add new users. Department Admins (Level 2) can manage settings and view analytics. Standard Users (Level 3) can raise support requests.",
    },
    {
      id: "KB0010047",
      title: "Requesting Laptop / Hardware Replacements",
      content:
        "Hardware requests can be submitted via the 'Request Items' widget. Select the 'Hardware' category, fill in the specifications of the machine (e.g. RAM, storage, processor), and hit submit.",
    },
  ];

  const displayName = React.useMemo(() => {
    if (!user || !user.email) return "Guest";
    const namePart = user.email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const results = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(value.toLowerCase()) ||
          t.title.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/requests/${id}`);
    setSearchResults([]);
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
      setToast({
        open: true,
        message: "Please fill out all mandatory fields.",
        severity: "error",
      });
      return;
    }

    const nextIncNum =
      10045 + tickets.filter((t) => t.id.startsWith("INC")).length;
    const newIncident = {
      id: `INC00${nextIncNum}`,
      title: incTitle,
      status: "New",
      created: "Just now",
      updated: "Just now",
      priority:
        incUrgency === "High" && incImpact === "High"
          ? "Critical"
          : incUrgency === "High" || incImpact === "High"
            ? "High"
            : "Medium",
      assignee: "Triage Queue",
      department:
        user?.role === "Org Admin"
          ? "IT Security Administration"
          : "Help Desk Services",
      category: incCategory,
      urgency: incUrgency,
      impact: incImpact,
      comments: [
        {
          id: 1,
          author: displayName,
          avatar: displayName.charAt(0),
          time: "Just now",
          text: `Incident reported: ${incDesc}`,
        },
      ],
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

    setToast({
      open: true,
      message: `Incident ${newIncident.id} created successfully!`,
      severity: "success",
    });
  };

  // Submit new request (REQ)
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!reqJustify.trim()) {
      setToast({
        open: true,
        message: "Please provide a justification.",
        severity: "error",
      });
      return;
    }

    const nextReqNum =
      1236 + tickets.filter((t) => t.id.startsWith("REQ")).length;
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
          text: `Item ordered: ${reqItem}. Business Justification: ${reqJustify}`,
        },
      ],
    };

    const updatedTickets = [newRequest, ...tickets];
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);

    setReqJustify("");
    setReqUrgency("Medium");
    setOpenRequest(false);

    setToast({
      open: true,
      message: `Service Request ${newRequest.id} raised successfully!`,
      severity: "success",
    });
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
          background: `
      url(${Group3}) left center no-repeat,
      url(${Group2}) right center no-repeat,
      linear-gradient(
        180deg,
        #001E0E 0%,
        #0A381F 50%,
        #145532 100%
      )
    `,
          position: "relative",
          height: "260px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          px: 2,
          margin: "16px",
          borderRadius: "16px",
          boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
            letterSpacing: "-0.5px",
          }}
        >
          Find What You Need, Faster
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255,255,255,0.75)",
            mb: "32px",
            textAlign: "center",
            fontWeight: 400,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Search the Service Catalog, Knowledge Base, or view your open
          requests.
        </Typography>

        {/* Global search */}
        <Box sx={{ width: "100%", maxWidth: "620px", position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Type your question or request ID"
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
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                color: "#1F2D2E",
                borderRadius: "59px",
                px: 2,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                height: "44px",
                "& fieldset": { border: "none" },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px #fff inset",
                WebkitTextFillColor: "#1F2D2E",
                height: "20px",
                py: 0,
              },
            }}
          />

          {/* Search results */}
          {searchResults.length > 0 && (
            <Card
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                maxHeight: "280px",
                overflowY: "auto",
                bgcolor: "background.paper",
                zIndex: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                  borderRadius: "0 12px 12px 0",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "4px",
                  border: "2px solid transparent",
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", color: "text.secondary" }}
                >
                  MATCHING REQUESTS
                </Typography>
              </Box>
              <List disablePadding>
                {searchResults.map((t) => (
                  <ListItem
                    button={true}
                    key={t.id}
                    onClick={() => handleResultClick(t.id)}
                  >
                    <ListItemText
                      primary={t.id}
                      secondary={t.title}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { fontWeight: "bold", color: "text.primary" },
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        sx: { color: "text.secondary" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Box>
      </Box>

      {/* Grid container */}
      <Box sx={{ mx: "auto", px: { xs: 2, md: 4 }, mt: 5 }}>
        {/* Recently Viewed Tickets */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1F2937",
              mb: 0.25,
            }}
          >
            Recently Viewed Tickets
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              mb: 2,
              fontSize: "0.8rem",
            }}
          >
            Tickets with recent activity, focused on who updated and what
            changed.
          </Typography>

          <Grid container spacing={2}>
            {tickets.slice(0, 4).map((ticket) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ticket.id}>
                <Card
                  onClick={() => navigate(`/requests/${ticket.id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    },
                    width: "100%",
                  }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SearchIcon
                          sx={{
                            fontSize: 16,
                            color: "#16A34A",
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          {ticket.id}
                        </Typography>
                      </Box>

                      <Chip
                        label={ticket.status}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.6rem",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#6B7280",
                      }}
                    >
                      Category: {ticket.category}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#9CA3AF",
                        textAlign: "right",
                        mt: 1,
                      }}
                    >
                      2m ago
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Open Requests / Recently Searched */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.25,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#1F2937",
              }}
            >
              Open Requests
            </Typography>

            <Typography
              sx={{
                color: "#16A34A",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
              onClick={() => navigate("/requests")}
            >
              View All
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              mb: 2,
              fontSize: "0.8rem",
            }}
          >
            Open tickets that may require your attention or follow-up.
          </Typography>

          <Grid container spacing={2}>
            {tickets.slice(0, 4).map((ticket) => (
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 3 }}
                key={`open-${ticket.id}`}
              >
                <Card
                  onClick={() => navigate(`/requests/${ticket.id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#1F2937",
                        }}
                      >
                        {ticket.id}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: "#9CA3AF",
                        }}
                      >
                        2h ago
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#6B7280",
                        minHeight: 40,
                      }}
                    >
                      {ticket.title}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: "#6B7280",
                        }}
                      >
                        Created by: M. Chen
                      </Typography>

                      <ChevronRightIcon
                        sx={{
                          fontSize: 18,
                          color: "#6B7280",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* dialog 1: Create Incident */}
      <Dialog
        open={openIncident}
        onClose={() => setOpenIncident(false)}
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
            gap: 1,
          }}
        >
          <ReportProblemIcon sx={{ color: "error.main" }} />
          Create Incident (Record Outage/Error)
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmitIncident}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}
          >
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
                    <MenuItem value="Access Management">
                      Access Management
                    </MenuItem>
                    <MenuItem value="Security Assessment">
                      Security Assessment
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setOpenIncident(false)}
              color="inherit"
              sx={{ fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ fontWeight: "bold", borderRadius: "8px" }}
            >
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
          sx: { borderRadius: "20px", backgroundImage: "none" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShoppingCartIcon sx={{ color: "primary.main" }} />
          Service Catalog - Request Item
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmitRequest}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}
          >
            <FormControl fullWidth>
              <InputLabel>Choose Catalog Item</InputLabel>
              <Select
                value={reqItem}
                label="Choose Catalog Item"
                onChange={(e) => setReqItem(e.target.value)}
              >
                <MenuItem value="Adobe Creative Cloud Suite License">
                  Adobe Creative Cloud Suite License
                </MenuItem>
                <MenuItem value="Standard Developer Laptop (16GB RAM)">
                  Standard Developer Laptop (16GB RAM)
                </MenuItem>
                <MenuItem value="Production Database Access Role">
                  Production Database Access Role
                </MenuItem>
                <MenuItem value="QA Environment Server Allocation">
                  QA Environment Server Allocation
                </MenuItem>
                <MenuItem value="Microsoft 365 Enterprise License">
                  Microsoft 365 Enterprise License
                </MenuItem>
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
                <MenuItem value="High">
                  High - Urgent Project Requirement
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setOpenRequest(false)}
              color="inherit"
              sx={{ fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", borderRadius: "8px" }}
            >
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
          sx: { borderRadius: "20px", backgroundImage: "none" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BookIcon sx={{ color: "secondary.main" }} />
          Knowledge Article Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {selectedKb && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}
              >
                {selectedKb.title}
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
                Article ID: {selectedKb.id} • Cargill Triage Database
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
                {selectedKb.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenKbArticle(false)}
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
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
        <Alert
          severity={toast.severity}
          variant="filled"
          className="rounded-xl shadow-lg"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
