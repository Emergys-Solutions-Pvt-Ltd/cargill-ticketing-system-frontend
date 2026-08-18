import { Box, Typography } from "@mui/material";
import DetailField from "./DetailField";

const SubmittedFormView = ({ data }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#111928" }}>
      {data.formTitle}
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        rowGap: 2,
        py: 1,
        px: 1.5,
      }}
    >
      {data.topFields.map((f, i) => (
        <Box
          key={f.label}
          sx={{
            px: 2.5,
            borderRight: (i + 1) % 4 !== 0 ? "1px solid #e5e7eb" : "none",
            "&:nth-of-type(4n+1)": { pl: 0 },
          }}
        >
          <DetailField label={f.label} value={f.value} />
        </Box>
      ))}
    </Box>

    {data.sections.map((section, i) => (
      <Box key={i} sx={{ borderTop: "1px solid #edf0f2", pt: 2 }}>
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
            {section.fields.map((f) => (
              <Box key={f.label}>
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

export default SubmittedFormView;
