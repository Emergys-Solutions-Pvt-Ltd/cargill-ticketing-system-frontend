import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Tab, Tabs, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SectionCard = ({ tabs, initialTab = 0 }) => {
  const [value, setValue] = useState(initialTab);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const selectedTab = tabs[value];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        backgroundImage: "none",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="section tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
            },
            "& .MuiTab-root.Mui-selected": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
            },
            backgroundColor: "#F8F8F8",
            px: 2,
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {selectedTab && selectedTab.content}
      </CardContent>
    </Card>
  );
};

SectionCard.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  initialTab: PropTypes.number,
};

export default SectionCard;
