import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const FormSection = ({
  title,
  icon: Icon = DescriptionOutlinedIcon,
  children,
  defaultExpanded = false,
}) => (
  <Accordion
    defaultExpanded={defaultExpanded}
    disableGutters
    elevation={0}
    sx={{
      border: "1px solid #E5E7EB",
      borderRadius: "7px !important",
      mb: 1.25,
      "&:before": { display: "none" },
      "&.Mui-expanded": { margin: "0 0 10px 0" },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: "#111827" }} />}
      sx={{
        p: 2,
        "&.Mui-expanded": { minHeight: 46 },
        "& .MuiAccordionSummary-content": { margin: 0, alignItems: "center" },
        "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "4px",
          backgroundColor: "#ECFFF5",
          border: "0.8px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 1.5,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 16, color: "#16834b" }} />
      </Box>
      <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#1F2A37" }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ px: 2, py: 1.75, borderTop: "1px solid #edf0f2" }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

export default FormSection;
