import { Box } from "@mui/material";
import DetailField from "./DetailField";

const FormSectionGrid = ({ fields }) => (
  <Box
    sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", rowGap: 3 }}
  >
    {fields.map((f, i) => (
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
);

export default FormSectionGrid;
