import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Mp4Preview({ file }) {
  if (!file) return null;

  return (
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
  );
}
