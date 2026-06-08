import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PdfPreview({ file }) {
  if (!file) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <iframe
        src={`/docs/${file.name}`}
        title="PDF Preview"
        width="100%"
        height="450px"
        style={{ border: "none", borderRadius: "12px", backgroundColor: "#ffffff" }}
      />
      <Typography variant="caption" sx={{ color: "text.secondary", alignSelf: "center" }}>
        If the PDF reader fails to load, click "Download File" to view locally.
      </Typography>
    </Box>
  );
}
