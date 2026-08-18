import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const FilePreviewModal = ({
  open,
  onClose,
  file,
  onDownload,
  onViewHistory,
}) => {
  if (!file) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(0, 0, 0, 0.15)" }, // lower = lighter, try 0.15–0.3
        },
        paper: { sx: { borderRadius: "10px", boxShadow: "none" } },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          p: 2.5,
          pb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: "18px", fontWeight: 600, color: "#111928" }}
          >
            {file.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              color: "#6A7282",
              mt: 0.25,
            }}
          >
            By {file.uploadedBy} · {file.date}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            startIcon={<RestoreOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={onViewHistory}
            sx={{
              textTransform: "none",
              fontSize: "12px",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              px: 1.25,
            }}
          >
            View History
          </Button>
          <Button
            size="small"
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontSize: "12px",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              px: 1.25,
            }}
          >
            {file.downloadCount ?? 1}
          </Button>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent
        sx={{
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          px: 2.5,
          py: 2.5,
        }}
      >
        <Typography
          sx={{ fontSize: "14px", fontWeight: 700, color: "#111827", mb: 1.5 }}
        >
          {file.previewTitle}
        </Typography>

        {file.previewLines?.map((line, i) => (
          <Typography
            key={i}
            sx={{ fontSize: "13px", color: "#374151", mb: 0.75 }}
          >
            {i + 1}. {line}
          </Typography>
        ))}
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 2.5,
          pb: 2.5,
          mt: 3,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            px: 2,
            "&:hover": { backgroundColor: "#e5e7eb" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onDownload}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#16834b",
            borderRadius: "6px",
            px: 2,
            "&:hover": { backgroundColor: "#0f6b3c" },
          }}
        >
          Download
        </Button>
      </Box>
    </Dialog>
  );
};

export default FilePreviewModal;
