import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TableChartIcon from "@mui/icons-material/TableChart";
import LanguageIcon from "@mui/icons-material/Language";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ImageIcon from "@mui/icons-material/Image";
import MailIcon from "@mui/icons-material/Mail";
import BasicTimeline from "./myRequest/BasicTimeline";

const commentsData = [
  {
    id: 1,
    author: "Ashish Shende",
    avatar: "A",
    time: "10 mins ago",
    text: "I have uploaded the initial text guidelines, architectural diagram, and financial audit spreadsheets for review.",
    attachments: [
      { name: "scan_requirements.txt", size: "1.2 KB", type: "txt" },
      { name: "architecture_diagram.pdf", size: "2.4 MB", type: "pdf" },
      { name: "financial_report.xlsx", size: "850 KB", type: "xlsx" },
      { name: "project_schedule.xls", size: "1.5 MB", type: "xls" }
    ]
  },
  {
    id: 2,
    author: "Security Team",
    avatar: "S",
    time: "2 hours ago",
    text: "Review completed. Attached are the slide presentations, legacy documentations, and signed clearance sheets.",
    attachments: [
      { name: "preliminary_audit.pptx", size: "4.8 MB", type: "pptx" },
      { name: "slideshow_backup.ppt", size: "12.4 MB", type: "ppt" },
      { name: "auth_signed.docx", size: "420 KB", type: "docx" },
      { name: "access_permission.doc", size: "380 KB", type: "doc" }
    ]
  },
  {
    id: 3,
    author: "Systems Admin",
    avatar: "O",
    time: "1 day ago",
    text: "Added the datacenter photos, legacy database schema design maps, and network topology blueprint files.",
    attachments: [
      { name: "network_topography.png", size: "1.8 MB", type: "png" },
      { name: "server_rack_photo.jpg", size: "3.2 MB", type: "jpg" },
      { name: "datacenter_blueprint.jpeg", size: "4.1 MB", type: "jpeg" },
      { name: "device_firmware_spec.tiff", size: "8.6 MB", type: "tiff" },
      { name: "legacy_schema.bmp", size: "900 KB", type: "bmp" }
    ]
  },
  {
    id: 4,
    author: "Developer Team",
    avatar: "D",
    time: "2 days ago",
    text: "Here is the vulnerability HTML scan log report, a video recording of the login security gap verification, and the raw email communication threads.",
    attachments: [
      { name: "security_report.html", size: "180 KB", type: "html" },
      { name: "index_backup.htm", size: "75 KB", type: "htm" },
      { name: "screen_recording.mp4", size: "15.4 MB", type: "mp4" },
      { name: "authorization_email.eml", size: "12 KB", type: "eml" },
      { name: "clearance_msg.msg", size: "25 KB", type: "msg" }
    ]
  }
];

export const getFileIcon = (type) => {
  const t = type.toLowerCase();
  switch (t) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#ef4444", fontSize: "2rem" }} />;
    case "docx":
    case "doc":
      return <DescriptionIcon sx={{ color: "#3b82f6", fontSize: "2rem" }} />;
    case "pptx":
    case "ppt":
      return <SlideshowIcon sx={{ color: "#f97316", fontSize: "2rem" }} />;
    case "xlsx":
    case "xls":
      return <TableChartIcon sx={{ color: "#10b981", fontSize: "2rem" }} />;
    case "png":
    case "jpg":
      return <ImageIcon sx={{ color: "#ec4899", fontSize: "2rem" }} />;
    case "jpeg":
    case "bmp":
    case "tiff":
      return <ImageIcon sx={{ color: "#8b5cf6", fontSize: "2rem" }} />;
    case "html":
    case "htm":
      return <LanguageIcon sx={{ color: "#06b6d4", fontSize: "2rem" }} />;
    case "mp4":
      return <PlayArrowIcon sx={{ color: "#e11d48", fontSize: "2rem" }} />;
    case "eml":
    case "msg":
      return <MailIcon sx={{ color: "#d97706", fontSize: "2rem" }} />;
    case "txt":
      return <InsertDriveFileIcon sx={{ color: "#6b7280", fontSize: "2rem" }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#9ca3af", fontSize: "2rem" }} />;
  }
};

const pptxSlides = [
  {
    title: "Cargil System Audit",
    subtitle: "Preliminary Assessment Report",
    content: [
      "Author: Security Operations Team",
      "Assessment Date: May 20, 2026",
      "Status: Under Compliance Review"
    ]
  },
  {
    title: "Audit Scope & Methodology",
    subtitle: "What was scanned",
    content: [
      "Dynamic scan on SXR QA environment",
      "Authorization checklist verification",
      "Role-Based Access Control (RBAC) validations"
    ]
  },
  {
    title: "Key Findings Summary",
    subtitle: "Initial review details",
    content: [
      "No critical security gaps identified",
      "CORS headers and SSL ciphers conform to Cargil policy",
      "Minor documentation warnings cleared"
    ]
  }
];

export default function LabTabs() {
  const [value, setValue] = React.useState("1");
  const [previewFile, setPreviewFile] = React.useState(null);
  const [txtContent, setTxtContent] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Reset slide index when changing files
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [previewFile]);

  // Load TXT file content
  React.useEffect(() => {
    if (previewFile && previewFile.type === "txt") {
      setTxtContent("Loading document content...");
      fetch(`/docs/${previewFile.name}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load file");
          return res.text();
        })
        .then(text => setTxtContent(text))
        .catch(() => {
          setTxtContent(
            "Cargil Ticketing System - Security Scan Requirements Checklist\n" +
            "------------------------------------------------------------\n" +
            "1. Verify CORS policies on all SXR QA endpoints.\n" +
            "2. Run dynamic application scan against HTTP API.\n" +
            "3. Validate session timeout parameters.\n" +
            "4. Verify SSL/TLS cipher suites.\n" +
            "5. Check RBAC roles for privilege escalation holes.\n" +
            "6. Verify encryption settings for sensitive parameters."
          );
        });
    }
  }, [previewFile]);

  // Flatten all attachments from comments
  const allAttachments = React.useMemo(() => {
    const list = [];
    commentsData.forEach(comment => {
      if (comment.attachments && comment.attachments.length > 0) {
        comment.attachments.forEach(att => {
          list.push({
            ...att,
            attachedBy: comment.author,
            attachedTime: comment.time
          });
        });
      }
    });
    return list;
  }, []);

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="request tabs">
            <Tab label="Activity" value="1" />
            <Tab label={`Attachments (${allAttachments.length})`} value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 2 }}>
          <Box sx={{ width: "100%" }}>
            <BasicTimeline comments={commentsData} onPreview={handlePreview} />
          </Box>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 3 }}>
          {allAttachments.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
              No attachments found for this request.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {allAttachments.map((file, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 3, 
                      borderColor: "divider", 
                      backgroundImage: "none",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                      }
                    }}
                  >
                    <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", "&:last-child": { pb: 2 } }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: "action.hover", display: "flex", alignItems: "center" }}>
                        {getFileIcon(file.type)}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: "text.primary", 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis" 
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                          Size: {file.size}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                          By: {file.attachedBy} • {file.attachedTime}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="secondary" 
                        sx={{ border: "1px solid", borderColor: "divider", mr: 1 }}
                        onClick={() => handlePreview(file)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        component="a" 
                        href={`/docs/${file.name}`} 
                        download 
                        size="small" 
                        color="primary" 
                        sx={{ border: "1px solid", borderColor: "divider" }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </TabContext>

      {/* File Preview Dialog */}
      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" }
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {previewFile && getFileIcon(previewFile.type)}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {previewFile?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Attached by {previewFile?.attachedBy || "Ashish Shende"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setPreviewFile(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4, bgcolor: "background.default" }}>
          {/* TXT Preview */}
          {previewFile?.type === "txt" && (
            <Box 
              sx={{ 
                bgcolor: "background.paper", 
                p: 3, 
                borderRadius: 3, 
                border: "1px solid",
                borderColor: "divider",
                fontFamily: "monospace", 
                whiteSpace: "pre-wrap",
                maxHeight: "450px", 
                overflow: "auto",
                color: "text.primary"
              }}
            >
              {txtContent}
            </Box>
          )}

          {/* PDF Preview */}
          {previewFile?.type === "pdf" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <iframe
                src={`/docs/${previewFile.name}`}
                title="PDF Preview"
                width="100%"
                height="450px"
                style={{ border: "none", borderRadius: "12px", backgroundColor: "#ffffff" }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary", alignSelf: "center" }}>
                If the PDF reader fails to load, click "Download File" to view locally.
              </Typography>
            </Box>
          )}

          {/* DOCX / DOC Word Document Preview */}
          {(previewFile?.type === "docx" || previewFile?.type === "doc") && (
            <Box sx={{ display: "flex", justifyContent: "center", minHeight: "400px", py: 2 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  bgcolor: "#ffffff", 
                  color: "#000000", 
                  p: 6, 
                  width: "100%", 
                  maxWidth: "650px", 
                  minHeight: "400px", 
                  borderRadius: 1, 
                  border: "1px solid #e2e8f0",
                  fontFamily: '"Times New Roman", Times, serif'
                }}
              >
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 1, color: "#1e3a8a", letterSpacing: "0.05em" }}>
                  ACCESS AUTHORIZATION SHEET
                </Typography>
                <Typography variant="subtitle2" align="center" sx={{ mb: 4, color: "#64748b", fontWeight: "bold" }}>
                  CARGIL SYSTEMS • SECURITY COMPLIANCE
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" paragraph>
                  <strong>Date:</strong> May 20, 2026
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Request Ref:</strong> REQ000123465
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Authorized Activity:</strong> Dynamic Application Scan (DAST Audit)
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Target Environment:</strong> SXR QA Environment
                </Typography>
                <Typography variant="body1" sx={{ mt: 4, lineHeight: 1.8, fontSize: "1.05rem" }}>
                  This document formally validates compliance clearance and grants authorization to perform vulnerability testing. Activities are restricted to non-production endpoints. Ensure logging monitoring is active prior to initialization.
                </Typography>
                <Typography variant="body1" sx={{ mt: 5, fontStyle: "italic", textAlign: "right" }}>
                  Approved by: Security Compliance Board
                </Typography>
              </Paper>
            </Box>
          )}

          {/* PPTX / PPT PowerPoint Preview */}
          {(previewFile?.type === "pptx" || previewFile?.type === "ppt") && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: "#0f172a", 
                  color: "#ffffff", 
                  p: 5, 
                  borderRadius: 4, 
                  minHeight: "300px", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center", 
                  alignItems: "center",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative"
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#38bdf8" }}>
                  {pptxSlides[currentSlide].title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#94a3b8", mb: 4, fontStyle: "italic" }}>
                  {pptxSlides[currentSlide].subtitle}
                </Typography>
                <Box align="left" sx={{ display: "inline-block" }}>
                  {pptxSlides[currentSlide].content.map((bullet, bIdx) => (
                    <Typography key={bIdx} variant="body1" sx={{ color: "#e2e8f0", mb: 1 }}>
                      • {bullet}
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                <Button 
                  variant="outlined" 
                  disabled={currentSlide === 0} 
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                >
                  Previous Slide
                </Button>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Slide {currentSlide + 1} of {pptxSlides.length}
                </Typography>
                <Button 
                  variant="outlined" 
                  disabled={currentSlide === pptxSlides.length - 1} 
                  onClick={() => setCurrentSlide(prev => Math.min(pptxSlides.length - 1, prev + 1))}
                >
                  Next Slide
                </Button>
              </Box>
            </Box>
          )}

          {/* XLSX / XLS Spreadsheet Preview */}
          {(previewFile?.type === "xlsx" || previewFile?.type === "xls") && (
            <Box sx={{ bgcolor: "background.paper", borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              <Box sx={{ bgcolor: "#10b981", color: "#ffffff", px: 2, py: 1, display: "flex", gap: 3, alignItems: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Cargil Excel Viewer
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, fontSize: "0.75rem", opacity: 0.9 }}>
                  <span>File</span>
                  <span>Home</span>
                  <span>Insert</span>
                  <span>Data</span>
                </Box>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 600, borderCollapse: "collapse", "& td, & th": { border: "1px solid", borderColor: "divider", p: 1, fontSize: "0.8rem" } }}>
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold", width: 50 }}>Row</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>A (Audit Item)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>B (Category)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>C (Scope)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>D (Status)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>E (Assigned)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>F (Completion)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { item: "CORS Checking", cat: "Security Policy", scope: "SXR QA environment", stat: "PASS", who: "Ashish Shende", pct: "100%" },
                      { item: "SSL Ciphers check", cat: "Infrastructure", scope: "API Endpoint", stat: "PASS", who: "Ops Team", pct: "100%" },
                      { item: "RBAC Matrix Verify", cat: "Identity Control", scope: "UAM Portal", stat: "IN PROGRESS", who: "Admin", pct: "50%" },
                      { item: "Vulnerability DAST Scan", cat: "Pen Testing", scope: "External Web Service", stat: "PENDING", who: "Security Team", pct: "0%" },
                      { item: "Data encryption audits", cat: "Database Security", scope: "SQL Database", stat: "PENDING", who: "DB Admin", pct: "0%" },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center" sx={{ bgcolor: "action.hover", fontWeight: "bold" }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{row.item}</TableCell>
                        <TableCell>{row.cat}</TableCell>
                        <TableCell>{row.scope}</TableCell>
                        <TableCell>
                          <span style={{ 
                            padding: "2px 6px", 
                            borderRadius: "4px", 
                            fontSize: "0.7rem", 
                            fontWeight: "bold",
                            backgroundColor: row.stat === "PASS" ? "rgba(16, 185, 129, 0.15)" : row.stat === "IN PROGRESS" ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: row.stat === "PASS" ? "#10b981" : row.stat === "IN PROGRESS" ? "#3b82f6" : "#f59e0b"
                          }}>
                            {row.stat}
                          </span>
                        </TableCell>
                        <TableCell>{row.who}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{row.pct}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider", px: 2, py: 0.5, display: "flex", gap: 2, fontSize: "0.75rem", color: "text.secondary" }}>
                <span style={{ fontWeight: "bold", borderBottom: "2px solid #10b981", color: "#10b981", paddingBottom: "2px" }}>Sheet1</span>
                <span>Audit Summary</span>
                <span>+</span>
              </Box>
            </Box>
          )}

          {/* HTML / HTM Webpage Preview */}
          {(previewFile?.type === "html" || previewFile?.type === "htm") && (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
              <Box sx={{ bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider", px: 2, py: 1, display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
                </Box>
                <Box sx={{ flexGrow: 1, bgcolor: "background.default", border: "1px solid", borderColor: "divider", borderRadius: "10px", px: 1.5, py: 0.25, fontSize: "0.75rem", color: "text.secondary", fontFamily: "monospace" }}>
                  file:///c:/Cargil/{previewFile.name}
                </Box>
              </Box>
              <Box sx={{ p: 4, minHeight: "350px", bgcolor: "#ffffff", color: "#000000" }}>
                <h1 style={{ margin: "0 0 10px 0", color: "#1e3a8a", borderBottom: "2px solid #e2e8f0", paddingBottom: "5px", fontSize: "1.5rem" }}>
                  Security Vulnerability Audit Report
                </h1>
                <p style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#475569" }}>
                  <strong>Scan Date:</strong> May 24, 2026 • <strong>Scope:</strong> External Gateway Services
                </p>
                <div style={{ padding: "12px", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "4px", marginBottom: "15px" }}>
                  <h3 style={{ margin: "0 0 5px 0", color: "#991b1b", fontSize: "1rem" }}>
                    Medium Vulnerability Identified
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#7f1d1d", lineHeight: 1.5 }}>
                    Session cookie missing secure flag attribute. Users traversing unencrypted channels might expose authentication tokens.
                  </p>
                </div>
                <h4 style={{ margin: "15px 0 5px 0", fontSize: "1rem" }}>System Audit Trace Checklist</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#334155" }}>
                  <li>Cross-Origin Resource Sharing (CORS): <strong>Verified</strong></li>
                  <li>SQL Injection Protection validation: <strong>Passed</strong></li>
                  <li>XSS Content Security Policy (CSP): <strong>Passed</strong></li>
                </ul>
              </Box>
            </Box>
          )}

          {/* MP4 Video Preview */}
          {previewFile?.type === "mp4" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <Box sx={{ width: "100%", maxWidth: "600px", borderRadius: "16px", overflow: "hidden", border: "1px solid", borderColor: "divider", bgcolor: "#000000" }}>
                <video 
                  controls 
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  width="100%" 
                  style={{ display: "block" }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Vulnerability Demo Video Log. Play controls above to launch MP4.
              </Typography>
            </Box>
          )}

          {/* EML / MSG Email Preview */}
          {(previewFile?.type === "eml" || previewFile?.type === "msg") && (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
              <Box sx={{ bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider", px: 3, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                  Email Message ({previewFile.type.toUpperCase()} Viewer)
                </Typography>
                <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(217, 119, 6, 0.15)", color: "#d97706", fontWeight: "bold" }}>
                  Active Thread
                </span>
              </Box>
              
              <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      <strong>From:</strong> security_compliance@cargil.com
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      <strong>To:</strong> ashish.shende@cargil.com, developer_lead@cargil.com
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      <strong>Date:</strong> May 20, 2026, 10:45 AM
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      Subject: Access Authorization Clearance - SXR QA Scan
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 4, minHeight: "250px", bgcolor: "#ffffff", color: "#334155" }}>
                <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
                  Hi Ashish,
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
                  The security compliance committee has formally reviewed your DAST assessment scan request for the SXR QA environment (Ref: REQ000123465). 
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
                  Clearance has been granted subject to testing protocols outlined in the attached scan_requirements checklists. Please ensure that all activities are logged and that the network gateway is monitored throughout the scan interval.
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: "#1e293b", lineHeight: 1.6 }}>
                  Let us know if you encounter any access blocks.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#64748b" }}>
                  Best regards,<br />
                  <strong>Cargil Security & Compliance Board</strong><br />
                  Minneapolis Operations Center
                </Typography>
              </Box>
            </Box>
          )}

          {/* PNG, JPG, JPEG, BMP, TIFF Image Preview */}
          {(previewFile?.type === "png" || previewFile?.type === "jpg" || previewFile?.type === "jpeg" || previewFile?.type === "bmp" || previewFile?.type === "tiff") && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <Box 
                sx={{ 
                  width: "100%", 
                  maxWidth: "500px", 
                  height: "350px", 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  border: "1px solid", 
                  borderColor: "divider",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  color: "#ffffff"
                }}
              >
                <Box sx={{ opacity: 0.1, position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                <ImageIcon sx={{ fontSize: "5rem", mb: 2, zIndex: 1, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", zIndex: 1 }}>
                  {previewFile.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, zIndex: 1, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", fontSize: "0.8rem", mt: 0.5 }}>
                  Simulated Image Preview ({previewFile.type.toUpperCase()})
                </Typography>
                <Box sx={{ position: "absolute", bottom: 15, right: 15, px: 1.5, py: 0.5, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    Resolution: 1920 x 1080
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Blueprint asset logs. For local testing, click download to retrieve standard mock files.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPreviewFile(null)} color="inherit">
            Close Preview
          </Button>
          {previewFile && (
            <Button 
              component="a" 
              href={`/docs/${previewFile.name}`} 
              download 
              variant="contained" 
              startIcon={<DownloadIcon />}
            >
              Download File
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
