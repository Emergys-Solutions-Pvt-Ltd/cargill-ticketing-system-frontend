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
import Divider from "@mui/material/Divider";

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


import TxtPreview from "./filePreviews/TxtPreview";
import PdfPreview from "./filePreviews/PdfPreview";
import DocPreview from "./filePreviews/DocPreview";
import PptPreview from "./filePreviews/PptPreview";
import XlsPreview from "./filePreviews/XlsPreview";
import HtmlPreview from "./filePreviews/HtmlPreview";
import Mp4Preview from "./filePreviews/Mp4Preview";
import EmlPreview from "./filePreviews/EmlPreview";
import ImagePreview from "./filePreviews/ImagePreview";
import BasicTimeline from "./BasicTimeline";
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

const getFileIcon = (type) => {
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

export default function LabTabs({ comments = commentsData }) {
  const [value, setValue] = React.useState("1");
  const [previewFile, setPreviewFile] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Flatten all attachments from comments
  const allAttachments = React.useMemo(() => {
    const list = [];
    comments.forEach(comment => {
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
  }, [comments]);

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
            <BasicTimeline comments={comments} onPreview={handlePreview} />
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
            <TxtPreview file={previewFile} />
          )}

          {/* PDF Preview */}
          {previewFile?.type === "pdf" && (
            <PdfPreview file={previewFile} />
          )}

          {/* DOCX / DOC Word Document Preview */}
          {(previewFile?.type === "docx" || previewFile?.type === "doc") && (
            <DocPreview file={previewFile} />
          )}

          {/* PPTX / PPT PowerPoint Preview */}
          {(previewFile?.type === "pptx" || previewFile?.type === "ppt") && (
            <PptPreview file={previewFile} />
          )}

          {/* XLSX / XLS Spreadsheet Preview */}
          {(previewFile?.type === "xlsx" || previewFile?.type === "xls") && (
            <XlsPreview file={previewFile} />
          )}

          {/* HTML / HTM Webpage Preview */}
          {(previewFile?.type === "html" || previewFile?.type === "htm") && (
            <HtmlPreview file={previewFile} />
          )}

          {/* MP4 Video Preview */}
          {previewFile?.type === "mp4" && (
            <Mp4Preview file={previewFile} />
          )}

          {/* EML / MSG Email Preview */}
          {(previewFile?.type === "eml" || previewFile?.type === "msg") && (
            <EmlPreview file={previewFile} />
          )}

          {/* PNG, JPG, JPEG, BMP, TIFF Image Preview */}
          {(previewFile?.type === "png" || previewFile?.type === "jpg" || previewFile?.type === "jpeg" || previewFile?.type === "bmp" || previewFile?.type === "tiff") && (
            <ImagePreview file={previewFile} />
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
