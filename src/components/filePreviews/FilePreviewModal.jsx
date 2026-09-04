import { useEffect, useState } from "react";
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
import mammoth from "mammoth";
import * as XLSX from "xlsx";

const getExtension = (filename = "") =>
  filename.split(".").pop().toLowerCase();

const FilePreviewModal = ({
  open,
  onClose,
  file,
  onDownload,
  onViewHistory,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docHtml, setDocHtml] = useState("");       // mammoth output for docx
  const [sheetHtml, setSheetHtml] = useState("");    // SheetJS output for xlsx

  const ext = getExtension(file?.name);
  const isDocx = ext === "docx";
  const isXlsx = ext === "xlsx" || ext === "xls";
  const needsBuffer = isDocx || isXlsx;
  // Everything else (pdf, images, etc.) keeps using the plain iframe below, untouched.

  useEffect(() => {
    if (!open || !file?.previewUrl || !needsBuffer) {
      setDocHtml("");
      setSheetHtml("");
      setError("");
      return;
    }

    let cancelled = false;

    const fetchAndRender = async () => {
      setLoading(true);
      setError("");
      setDocHtml("");
      setSheetHtml("");

      try {
        const response = await fetch(file.previewUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;

        if (isDocx) {
          const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
          if (!cancelled) setDocHtml(result.value);
        } else if (isXlsx) {
          const workbook = XLSX.read(buffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const html = XLSX.utils.sheet_to_html(sheet);
          if (!cancelled) setSheetHtml(html);
        }
      } catch (err) {
        console.error("File preview render failed:", err);
        if (!cancelled) setError("Unable to render this document.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAndRender();
    return () => {
      cancelled = true;
    };
  }, [open, file?.previewUrl, needsBuffer, isDocx, isXlsx]);

  if (!file) return null;

  const renderPreview = () => {
    if (needsBuffer && loading) {
      return (
        <Box sx={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "13px", color: "#6b7280" }}>Loading preview...</Typography>
        </Box>
      );
    }

    if (needsBuffer && error) {
      return (
        <Box sx={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "13px", color: "#6b7280" }}>{error}</Typography>
        </Box>
      );
    }

    if (isDocx && docHtml) {
      return (
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", backgroundColor: "#f5f5f5", p: 2 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              margin: "0 auto",
              maxWidth: "800px",
              p: "40px 48px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#111",
              "& h1, & h2, & h3": { marginTop: "1em", marginBottom: "0.4em" },
              "& p": { marginBottom: "0.6em" },
              "& table": { borderCollapse: "collapse", width: "100%", marginBottom: "1em" },
              "& td, & th": { border: "1px solid #ccc", padding: "4px 8px" },
            }}
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        </Box>
      );
    }

    if (isXlsx && sheetHtml) {
      return (
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            p: 2,
            fontSize: "13px",
            "& table": { borderCollapse: "collapse", width: "100%" },
            "& td, & th": { border: "1px solid #e5e7eb", padding: "4px 8px" },
          }}
          dangerouslySetInnerHTML={{ __html: sheetHtml }}
        />
      );
    }

    // Untouched — pdf, images, everything else keep using the iframe.
    if (file.previewUrl) {
      return (
        <Box
          component="iframe"
          src={file.previewUrl}
          title={file.previewTitle || file.name}
          sx={{
            width: "100%",
            height: "60vh",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#fff",
          }}
        />
      );
    }

    return (
      <Typography sx={{ fontSize: "13px", color: "#6b7280" }}>
        No preview available.
      </Typography>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.15)" } },
        paper: { sx: { borderRadius: "10px", boxShadow: "none" } },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", p: 2.5, pb: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111928",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {file.name}
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "#6A7282", mt: 0.25 }}>
            By {file.uploadedBy} · {file.date}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2, flexShrink: 0 }}>
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
            onClick={onDownload}
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

      {/* Preview */}
      <DialogContent
        sx={{
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          px: 2.5,
          py: 2.5,
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
        }}
      >
        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#111827", mb: 1.5 }}>
          {file.previewTitle || file.name}
        </Typography>

        {renderPreview()}
      </DialogContent>

      {/* Footer */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, px: 2.5, pb: 2.5, mt: 3 }}>
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