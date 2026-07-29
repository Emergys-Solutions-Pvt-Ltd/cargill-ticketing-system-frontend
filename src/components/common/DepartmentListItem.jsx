import { Box, Typography, Divider } from "@mui/material";
import RightArrowIcon from "../../assets/icons/rightArrow.svg";
import DeptUsersIcon from "../../assets/icons/deptUsers.svg";

/**
 * Reusable summary row for a single department — icon, name, headcount
 * stats (supervisors/users/queues) and the assigned department admin.
 */
const DepartmentListItem = ({
  name,
  supervisors,
  users,
  queues,
  adminLabel = "Department Admin",
  adminName,
  icon = DeptUsersIcon,
  onClick,
}) => {
  const stats = [
    { label: "Supervisors", value: supervisors },
    { label: "Users", value: users },
    { label: "Queues", value: queues },
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box component="img" src={icon} alt="" width={44} height={44} />
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
            {name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            {stats.map((stat, index) => (
              <Box key={stat.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {index > 0 && <Divider orientation="vertical" flexItem sx={{ height: "12px", alignSelf: "center" }} />}
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
        <Divider orientation="vertical" flexItem sx={{ height: "36px", alignSelf: "center" }} />
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            {adminLabel}
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "13px", color: "text.primary" }}>
            {adminName}
          </Typography>
        </Box>
        <Box component="img" src={RightArrowIcon} alt="" width={16} height={16} />
      </Box>
    </Box>
  );
};

export default DepartmentListItem;
