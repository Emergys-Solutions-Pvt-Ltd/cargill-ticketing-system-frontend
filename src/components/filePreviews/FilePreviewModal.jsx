import { useEffect, useRef, useState } from "react";
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
import { renderAsync } from "docx-preview";
import mammoth from "mammoth";

const getExtension = (filename = "") =>
  filename.split(".").pop().toLowerCase();

const FilePreviewModal = ({
  open,
  onClose,
  file,
  onDownload,
  onViewHistory,
}) => {
  const docxContainerRef = useRef(null);

  const [fileBuffer, setFileBuffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSheet, setActiveSheet] = useState(0);
  const [docHtml, setDocHtml] = useState("");          // mammoth output for .doc

  const ext = getExtension(file?.name);

  const isDocx = ext === "docx";
  const isDoc = ext === "doc";
  const needsBuffer = isDocx || isDoc;

  // Fetch file buffer for docx, doc, and xlsx from the signed S3 URL
  useEffect(() => {
    if (!open || !file?.previewUrl || !needsBuffer) {
      setFileBuffer(null);
      setError("");
      setActiveSheet(0);
      setDocHtml("");
      return;
    }

    let cancelled = false;

    const fetchFile = async () => {
      try {
        setLoading(true);
        setError("");
        setFileBuffer(null);

        const response = await fetch(file.previewUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status}`
          );
        }

        const buffer = await response.arrayBuffer();


        if (!cancelled) {
          setFileBuffer(buffer);
        }
      } catch (err) {
        console.error("File fetch failed:", err);

        if (!cancelled) {
          setError("Unable to load file preview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFile();

    return () => {
      cancelled = true;
    };
  }, [open, file?.previewUrl, needsBuffer]);

  // --- Render .docx buffer ---
  useEffect(() => {
    if (
      !open ||
      !isDocx ||
      !fileBuffer ||
      !docxContainerRef.current
    ) {
      return;
    }

    const renderDocx = async () => {
      try {
        docxContainerRef.current.innerHTML = "";

        const blob = new Blob([fileBuffer], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        await renderAsync(
          blob,
          docxContainerRef.current,
          null,
          {
            className: "docx-preview",
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: false,
            experimental: false,
            trimXmlDeclaration: true,
            useBase64URL: false,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
            renderEndnotes: true,
          }
        );
      } catch (err) {
        console.error("DOCX render failed:", err);

        if (docxContainerRef.current) {
          docxContainerRef.current.innerHTML = "";
        }

        setError("Unable to render this document.");
      }
    };

    renderDocx();

    return () => {
      if (docxContainerRef.current) {
        docxContainerRef.current.innerHTML = "";
      }
    };
  }, [open, isDocx, fileBuffer]);

  // --- Render .xlsx / .xls buffer with SheetJS ---


  // --- Render .doc buffer with mammoth (converts to HTML) ---
  useEffect(() => {
    if (!open || !isDoc || !fileBuffer) {
      setDocHtml("");
      return;
    }

    mammoth
      .convertToHtml({ arrayBuffer: fileBuffer })
      .then((result) => {
        setDocHtml(result.value);
      })
      .catch((err) => {
        console.error("DOC render failed:", err);
        setError("Unable to render this document.");
      });
  }, [open, isDoc, fileBuffer]);

  if (!file) return null;

  const renderPreview = () => {
    if (loading) {
      return (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Loading preview...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {error}
          </Typography>
        </Box>
      );
    }

    if (isDocx && fileBuffer) {
      return (
        <Box
          ref={docxContainerRef}
          sx={{
            width: "100%",
            maxHeight: "60vh",
            overflowY: "auto",
            "& .docx-wrapper": { backgroundColor: "#f5f5f5", padding: "20px 0" },
            "& .docx-wrapper > section": { backgroundColor: "#fff", margin: "0 auto", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" },
          }}
        />
      );
    }

    if (isDoc && docHtml) {
      return (
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "#f5f5f5",
            p: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              margin: "0 auto",
              maxWidth: "800px",
              p: "40px 48px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              fontSize: "14px",
              lineHeight: 1.7,
              fontFamily: '"Times New Roman", Times, serif',
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



    // Keep iframe fallback for other file types.
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
      <Typography
        sx={{
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
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
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.15)",
          },
        },
        paper: {
          sx: {
            borderRadius: "10px",
            boxShadow: "none",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          p: 2.5,
          pb: 2,
        }}
      >
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: 2,
            flexShrink: 0,
          }}
        >
          <Button
            size="small"
            startIcon={
              <RestoreOutlinedIcon sx={{ fontSize: 16 }} />
            }
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
            startIcon={
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            }
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
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
            mb: 1.5,
          }}
        >
          {file.previewTitle || file.name}
        </Typography>

        {renderPreview()}
      </DialogContent>

      {/* Footer */}
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
            "&:hover": {
              backgroundColor: "#e5e7eb",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onDownload}
          startIcon={
            <FileDownloadOutlinedIcon sx={{ fontSize: 16 }}
            />
          }
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#16834b",
            borderRadius: "6px",
            px: 2,
            "&:hover": {
              backgroundColor: "#0f6b3c",
            },
          }}
        >
          Download
        </Button>
      </Box>
    </Dialog>
  );
};

export default FilePreviewModal;

