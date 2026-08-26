import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

const buildSections = (items = []) => {
  const sections = [];
  let current = null;

  items.forEach((item) => {
    if (item.type === "header") {
      if (!current || current.fields.length > 0) {
        current = { title: item.title, description: "", fields: [] };
        sections.push(current);
      } else {
        // second header right after first w/ no fields yet = description line
        current.description = item.title;
      }
    } else if (item.type === "field") {
      if (!current) {
        current = { title: "", description: "", fields: [] };
        sections.push(current);
      }
      current.fields.push(item);
    }
  });

  return sections;
};

const SubmittedFormView = ({ data }) => {
  const sections = useMemo(() => buildSections(data), [data]);

  if (!sections.length) return null;

  console.log(sections,"----------------sections")
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {sections.map((section, i) => (
        <Box
          key={i}
          sx={{
            borderTop: i === 0 ? "none" : "1px solid #edf0f2",
            pt: i === 0 ? 0 : 2,
          }}
        >
          {section.title && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1F2A37",
                mb: 0.75,
              }}
            >
              {section.title}
            </Typography>
          )}
          {section.description && (
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#374151",
                mb: 1.5,
              }}
            >
              {section.description}
            </Typography>
          )}
          {section.fields.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {section.fields.map((f, idx) => (
                <Box key={`${f.label}-${idx}`}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#374151",
                      fontWeight: 400,
                      mb: 0.25,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", color: "#374151", fontWeight: 700 }}
                  >
                    {f.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SubmittedFormView;
