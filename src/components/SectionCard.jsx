import { useState } from "react";
import { Box, Tab, Tabs, Card, CardContent } from "@mui/material";

const SELECTED_TAB_COLOR = "#1B7F37";

const SectionCard = ({ tabs, initialTab = 0, value: controlledValue, onChange, sx = {} }) => {
  const [internalValue, setInternalValue] = useState(initialTab);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (event, newValue) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue, event);
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
        display: "flex",
        flexDirection: "column",
        ...sx,
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
              color: SELECTED_TAB_COLOR,
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: SELECTED_TAB_COLOR,
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
      <CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, overflow: "auto" }}>
        {selectedTab && selectedTab.content}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
