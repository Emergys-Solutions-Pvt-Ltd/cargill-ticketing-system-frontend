import { Box, Typography, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeptUsersIcon from "../../assets/icons/deptUsers.svg";

/**
 * Reusable summary card for a single department — icon, name, and headcount
 * stats (super users/users/groups).
 */
const DepartmentListItem = ({
  name,
  superUsers,
  users,
  queues,
  icon = DeptUsersIcon,
  onClick,
}) => {
  const stats = [
    { label: "Super Users", value: superUsers },
    { label: "Users", value: users },
    { label: "Groups", value: queues },
  ];

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": onClick
          ? {
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderColor: "primary.main",
            }
          : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <Box component="img" src={icon} alt="" width={36} height={36} sx={{ flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
            {name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            {stats.map((stat, index) => (
              <Box key={stat.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {index > 0 && (
                  <Divider orientation="vertical" flexItem sx={{ height: "12px", alignSelf: "center" }} />
                )}
                <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                  <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {stat.value}
                  </Box>{" "}
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <ChevronRightIcon sx={{ color: "text.secondary", flexShrink: 0 }} />
    </Box>
  );
};

export default DepartmentListItem;
