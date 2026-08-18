import { Box, Typography } from "@mui/material";

const DetailField = ({ label, value }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      sx={{ fontSize: "11px", color: "#6b7280", mb: 0.5, fontWeight: 400 }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "13px",
        color: "#374151",
        fontWeight: 600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value || "-"}
    </Typography>
  </Box>
);

export default DetailField;
