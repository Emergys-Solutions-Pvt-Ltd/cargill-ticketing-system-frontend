import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageIcon from "@mui/icons-material/Image";

export default function ImagePreview({ file }) {
  if (!file) return null;

  return (
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
          {file.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, zIndex: 1, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", fontSize: "0.8rem", mt: 0.5 }}>
          Simulated Image Preview ({file.type.toUpperCase()})
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
  );
}
