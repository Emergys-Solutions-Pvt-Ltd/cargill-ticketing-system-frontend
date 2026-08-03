import { Box, Typography, Button, Divider } from "@mui/material";
import DeptUsersIcon from "../../assets/icons/deptUsers.svg";

const EntityHeaderCard = ({
  icon = DeptUsersIcon,
  title,
  description,
  stats = [],
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box component="img" src={icon} alt="" width={36} height={36} sx={{ flexShrink: 0 }} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
            {title}
          </Typography>
          {actionLabel && (
            <Button
              variant="outlined"
              size="small"
              onClick={onAction}
              sx={{
                flexShrink: 0,
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "13px",
                color: "text.primary",
                borderColor: "divider",
                py: 0.5,
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 0.25 }}>
          {description && (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          )}
          {stats.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              {stats.map((stat, index) => (
                <Box key={stat.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {index > 0 && <Divider orientation="vertical" flexItem sx={{ height: "12px", alignSelf: "center" }} />}
                  <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                    <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {stat.value}
                    </Box>{" "}
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EntityHeaderCard;
