import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackNavigation = ({ label = "Back to List", onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        cursor: onClick ? "pointer" : "default",
        width: "fit-content",
        color: "text.primary",
        "&:hover": { color: "primary.main" },
      }}
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>{label}</Typography>
    </Box>
  );
};

export default BackNavigation;
