import { Box } from "@mui/material";
import DetailField from "./DetailField";

const FormSectionGrid = ({ fields = [] }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      rowGap: 3,
    }}
  >
    {fields.map((field, index) => (
      <Box
        key={field.key || field.label || index}
        sx={{
          px: 2.5,
          borderRight:
            (index + 1) % 4 !== 0 ? "1px solid #e5e7eb" : "none",
          "&:nth-of-type(4n+1)": {
            pl: 0,
          },
        }}
      >
        <DetailField
          label={field.label}
          value={
            field.value === null ||
            field.value === undefined ||
            field.value === ""
              ? "-"
              : field.value
          }
        />
      </Box>
    ))}
  </Box>
);

export default FormSectionGrid;