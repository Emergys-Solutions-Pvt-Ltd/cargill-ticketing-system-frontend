import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RequestTabs = ({
  activeTab,
  onTabChange,
  openRequestTabs,
  onCloseTab,
}) => {
  const isAllRequestsActive = activeTab === "all-requests";

  if (openRequestTabs.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        onClick={() => onTabChange("all-requests")}
        variant="body2"
        sx={{
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontSize: "13px",
          backgroundColor: "background.paper",
          py: 0.5,
          px: 1,
        }}
      >
        All Requests
      </Typography>

      {openRequestTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Box
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              pl: 1.25,
              pr: 1,
              py: 0.5,
              backgroundColor: isActive ? "#00843D1A" : "background.paper",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                color: "inherit",
                fontSize: "12px",
                fontWeight: isActive ? 550 : 400,
              }}
            >
              {tab.request.id}
            </Typography>
            <Box
              component="span"
              role="button"
              aria-label={`Close ${tab.request.id}`}
              onClick={(event) => onCloseTab(tab.id, event)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: "inherit" }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RequestTabs;
