import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Avatar, Box, Card, Typography, Chip, Stack } from "@mui/material";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import TableChartIcon from "@mui/icons-material/TableChart";
import LanguageIcon from "@mui/icons-material/Language";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ImageIcon from "@mui/icons-material/Image";
import MailIcon from "@mui/icons-material/Mail";

const getSmallFileIcon = (type) => {
  const t = type.toLowerCase();
  switch (t) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#ef4444", fontSize: "1.1rem" }} />;
    case "docx":
    case "doc":
      return <DescriptionIcon sx={{ color: "#3b82f6", fontSize: "1.1rem" }} />;
    case "pptx":
    case "ppt":
      return <SlideshowIcon sx={{ color: "#f97316", fontSize: "1.1rem" }} />;
    case "xlsx":
    case "xls":
      return <TableChartIcon sx={{ color: "#10b981", fontSize: "1.1rem" }} />;
    case "png":
    case "jpg":
      return <ImageIcon sx={{ color: "#ec4899", fontSize: "1.1rem" }} />;
    case "jpeg":
    case "bmp":
    case "tiff":
      return <ImageIcon sx={{ color: "#8b5cf6", fontSize: "1.1rem" }} />;
    case "html":
    case "htm":
      return <LanguageIcon sx={{ color: "#06b6d4", fontSize: "1.1rem" }} />;
    case "mp4":
      return <PlayArrowIcon sx={{ color: "#e11d48", fontSize: "1.1rem" }} />;
    case "eml":
    case "msg":
      return <MailIcon sx={{ color: "#d97706", fontSize: "1.1rem" }} />;
    case "txt":
      return <InsertDriveFileIcon sx={{ color: "#6b7280", fontSize: "1.1rem" }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#9ca3af", fontSize: "1.1rem" }} />;
  }
};

export default function BasicTimeline({ comments = [], onPreview }) {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
        p: 0,
        m: 0,
      }}
    >
      {comments.map((comment, index) => (
        <TimelineItem key={comment.id}>
          <TimelineSeparator>
            <TimelineDot sx={{ p: 0, border: "none", bgcolor: "transparent", boxShadow: "none" }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: "0.875rem", fontWeight: "bold" }}>
                {comment.avatar}
              </Avatar>
            </TimelineDot>
            {index < comments.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ pr: 0, pl: 2, pb: index < comments.length - 1 ? 3 : 1 }}>
            <Card variant="outlined" sx={{ padding: 2, borderRadius: 3, borderColor: "divider", backgroundImage: "none" }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}
              >
                <Typography sx={{ fontWeight: "bold", color: "text.primary" }}>
                  {comment.author}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                  {comment.time}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                {comment.text}
              </Typography>

              {comment.attachments?.length > 0 && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Attachments ({comment.attachments.length})
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {comment.attachments.map((file, fIdx) => (
                      <Chip
                        key={fIdx}
                        icon={getSmallFileIcon(file.type)}
                        label={`${file.name} (${file.size})`}
                        clickable
                        onClick={() => onPreview && onPreview(file)}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderRadius: "8px", 
                          py: 1.5,
                          height: "auto",
                          borderColor: "divider",
                          "& .MuiChip-label": { px: 1 },
                          "& .MuiChip-icon": { ml: 1 }
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              )}
            </Card>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
