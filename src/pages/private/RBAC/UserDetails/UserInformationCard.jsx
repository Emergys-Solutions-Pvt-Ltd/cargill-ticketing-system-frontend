import { Box, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const UserInformationCard = ({ title = "User Information", fields = [] }) => {
  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", cursor: "pointer" }}>
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Edit Info
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {fields.map((field) => (
          <Box key={field.label}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5 }}>
              {field.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserInformationCard;
