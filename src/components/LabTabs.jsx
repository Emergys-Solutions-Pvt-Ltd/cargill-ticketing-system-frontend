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
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { useAuth } from "../context/AuthContext";
import {
  getFileActions,
  recordFileAction,
  getTicketViews,
} from "../utils/fileActionTracker";

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

import HelpOutlineIcon from "@mui/icons-material/Help";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
import DetailsForm from "./DetailsForm";

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
      return (
        <InsertDriveFileIcon sx={{ color: "#6b7280", fontSize: "2rem" }} />
      );
    default:
      return (
        <InsertDriveFileIcon sx={{ color: "#9ca3af", fontSize: "2rem" }} />
      );
  }
};

export default function LabTabs({ comments = [], request }) {
  const [value, setValue] = React.useState("1");
  const [previewFile, setPreviewFile] = React.useState(null);

  const { user: authUser } = useAuth();
  const [fileStats, setFileStats] = React.useState({
    previews: [],
    downloads: [],
  });
  const [previewAnchorEl, setPreviewAnchorEl] = React.useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = React.useState(null);
  const [ticketViews, setTicketViews] = React.useState([]);

  React.useEffect(() => {
    if (request && request.id) {
      setTicketViews(getTicketViews(request.id));
    }
  }, [request, value]);

  const handlePreviewStatsClick = (event) => {
    setPreviewAnchorEl(event.currentTarget);
  };
  const handlePreviewStatsClose = () => {
    setPreviewAnchorEl(null);
  };
  const handleDownloadStatsClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };
  const handleDownloadStatsClose = () => {
    setDownloadAnchorEl(null);
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    const updatedStats = recordFileAction(file.name, "preview", authUser);
    setFileStats(updatedStats);
  };

  const handleDownload = (file) => {
    const updatedStats = recordFileAction(file.name, "download", authUser);
    if (previewFile && previewFile.name === file.name) {
      setFileStats(updatedStats);
    }
  };

  const handleCloseDialog = () => {
    setPreviewFile(null);
    setPreviewAnchorEl(null);
    setDownloadAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Flatten all attachments from comments
  const allAttachments = React.useMemo(() => {
    const list = [];
    comments.forEach((comment) => {
      if (comment.attachments && comment.attachments.length > 0) {
        comment.attachments.forEach((att) => {
          list.push({
            ...att,
            attachedBy: comment.author,
            attachedTime: comment.time,
          });
        });
      }
    });
    return list;
  }, [comments]);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="request tabs">
            <Tab label="Details" value="1" />
            <Tab label="Activity" value="2" />
            <Tab label={`Attachments (${allAttachments.length})`} value="3" />
            <Tab label="Ticket Attributes" value="4" />
            <Tab label="Audit History" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 2 }}>
          <Box sx={{ width: "100%" }}>
            <DetailsForm request={request} />
          </Box>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 2 }}>
          <Box sx={{ width: "100%" }}>
            <BasicTimeline comments={comments} onPreview={handlePreview} />
          </Box>
        </TabPanel>
        <TabPanel value="3" sx={{ p: 3 }}>
          {allAttachments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
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
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
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
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          Size: {file.size}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          By: {file.attachedBy} • {file.attachedTime}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="secondary"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          mr: 1,
                        }}
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
                        onClick={() => handleDownload(file)}
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
        <TabPanel value="4" sx={{ p: 3 }}>
          <Box sx={{ maxWidth: "600px", mx: "auto" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
            >
              Ticket Attributes
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  <HelpOutlineIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    TICKET TYPE
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.id?.startsWith("INC")
                      ? "Incident (Break/Fix)"
                      : "Service Catalog Item"}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  <PersonOutlineIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    ASSIGNED GROUP / ASSIGNEE
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.assignee || "Triage Queue"}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  <CategoryIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    CATEGORY
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.category || "General Support"}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  <AccessTimeIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    CREATED / UPDATED
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.created} • Updated {request?.updated}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    IMPACT
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.impact || "Medium"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700 }}
                  >
                    URGENCY
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {request?.urgency || "Medium"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontWeight: 700 }}
                >
                  SERVICE WORKSPACE / DEPT
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {request?.department || "Enterprise Services"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </TabPanel>
        <TabPanel value="5" sx={{ p: 3 }}>
          <Box sx={{ maxWidth: "600px", mx: "auto" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
            >
              Ticket View History
            </Typography>
            {ticketViews.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No views recorded yet.
              </Typography>
            ) : (
              <List>
                {ticketViews.map((view, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "secondary.main",
                            color: "#ffffff",
                            fontWeight: "bold",
                          }}
                        >
                          {view.userName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", color: "text.primary" }}
                          >
                            {view.userName}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {view.role} • Viewed {view.timeAgo}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < ticketViews.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </TabPanel>
      </TabContext>

      {/* File Preview Dialog */}
      <Dialog
        open={Boolean(previewFile)}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: "20px", backgroundImage: "none" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
          }}
        >
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

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              ml: "auto",
              mr: 2,
              alignItems: "center",
            }}
          >
            <Chip
              icon={
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              }
              label={`${fileStats.previews.length}`}
              onClick={handlePreviewStatsClick}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "8px",
                borderColor: "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                "& .MuiChip-label": { px: 1 },
                "& .MuiChip-icon": { ml: 0.5 },
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "secondary.main",
                },
              }}
            />
            <Chip
              icon={
                <DownloadIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              }
              label={`${fileStats.downloads.length}`}
              onClick={handleDownloadStatsClick}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "8px",
                borderColor: "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                "& .MuiChip-label": { px: 1 },
                "& .MuiChip-icon": { ml: 0.5 },
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                },
              }}
            />
          </Box>

          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4, bgcolor: "background.default" }}>
          {/* TXT Preview */}
          {previewFile?.type === "txt" && <TxtPreview file={previewFile} />}

          {/* PDF Preview */}
          {previewFile?.type === "pdf" && <PdfPreview file={previewFile} />}

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
          {previewFile?.type === "mp4" && <Mp4Preview file={previewFile} />}

          {/* EML / MSG Email Preview */}
          {(previewFile?.type === "eml" || previewFile?.type === "msg") && (
            <EmlPreview file={previewFile} />
          )}

          {/* PNG, JPG, JPEG, BMP, TIFF Image Preview */}
          {(previewFile?.type === "png" ||
            previewFile?.type === "jpg" ||
            previewFile?.type === "jpeg" ||
            previewFile?.type === "bmp" ||
            previewFile?.type === "tiff") && (
            <ImagePreview file={previewFile} />
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Close Preview
          </Button>
          {previewFile && (
            <Button
              component="a"
              href={`/docs/${previewFile.name}`}
              download
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(previewFile)}
            >
              Download File
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Popovers for stats lists */}
      <Popover
        open={Boolean(previewAnchorEl)}
        anchorEl={previewAnchorEl}
        onClose={handlePreviewStatsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 280,
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}
        >
          Viewed by
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {fileStats.previews.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No views recorded yet
          </Typography>
        ) : (
          <List
            size="small"
            disablePadding
            sx={{ maxHeight: 200, overflowY: "auto" }}
          >
            {fileStats.previews.map((action, idx) => (
              <ListItem key={idx} disablePadding sx={{ py: 0.75 }}>
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      bgcolor: "secondary.main",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    {action.userName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={action.userName}
                  secondary={`${action.role} • ${action.timeAgo}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>

      <Popover
        open={Boolean(downloadAnchorEl)}
        anchorEl={downloadAnchorEl}
        onClose={handleDownloadStatsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 280,
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}
        >
          Downloaded by
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {fileStats.downloads.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No downloads recorded yet
          </Typography>
        ) : (
          <List
            size="small"
            disablePadding
            sx={{ maxHeight: 200, overflowY: "auto" }}
          >
            {fileStats.downloads.map((action, idx) => (
              <ListItem key={idx} disablePadding sx={{ py: 0.75 }}>
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      bgcolor: "primary.main",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    {action.userName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={action.userName}
                  secondary={`${action.role} • ${action.timeAgo}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </Box>
  );
}
