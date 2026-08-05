import { Box, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const AdminInformationTab = ({ adminInfo }) => {
  const fields = [
    { label: "Admin Name", value: adminInfo.adminName },
    { label: "User ID", value: adminInfo.userId },
    { label: "Phone No", value: adminInfo.phoneNo },
    { label: "Email", value: adminInfo.email },
    { label: "Work Location", value: adminInfo.workLocation },
    { label: "Member since", value: adminInfo.memberSince },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          User Information
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", cursor: "pointer" }}>
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
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

export default AdminInformationTab;
