import { Box, CircularProgress, Typography } from "@mui/material";

const TRACK_COLOR = "#DCFCE7";
const ACCENT_COLOR = "#00843D";

const Loader = ({ size = 40, thickness = 4, label = "Loading please wait" }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
    <Box sx={{ position: "relative", width: size, height: size }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{ color: TRACK_COLOR }}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        size={size}
        thickness={thickness}
        sx={{
          color: ACCENT_COLOR,
          position: "absolute",
          left: 0,
          top: 0,
          animationDuration: "650ms",
        }}
      />
    </Box>
    {label && (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    )}
  </Box>
);

export default Loader;
