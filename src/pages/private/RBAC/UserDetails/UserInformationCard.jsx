import { Box, Typography } from "@mui/material";
import EditInfoIcon from "../../../../assets/icons/editInfo.svg";

const UserInformationCard = ({ title = "User Information", fields = [] }) => {
  return (
    <Box
      sx={{
        width: "100%",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#1C64F2", cursor: "pointer" }}>
          <img src={EditInfoIcon} alt="" width={16} height={16} style={{ display: "block" }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Edit Info
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          rowGap: 3,
          columnGap: 4,
        }}
      >
        {fields.map((field) => (
          <Box key={field.label} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
            {field.icon && (
              <Box component="img" src={field.icon} alt="" sx={{ width: 32, height: 32, flexShrink: 0 }} />
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.25 }}>
                {field.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {field.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserInformationCard;
