import { Box } from "@mui/material";
import DetailField from "./DetailField";

const LONG_TEXT_THRESHOLD = 60;

const FormSectionGrid = ({ fields = [] }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      rowGap: 3,
    }}
  >
    {fields.map((field, index) => {
      const value =
        field.value === null || field.value === undefined || field.value === ""
          ? "-"
          : field.value;

      const isLong =
        typeof value === "string" && value.length > LONG_TEXT_THRESHOLD;

      return (
        <Box
          key={field.key || field.label || index}
          sx={{
            px: 2.5,
            gridColumn: isLong ? "1 / -1" : "auto",
            borderRight:
              !isLong && (index + 1) % 4 !== 0 ? "1px solid #e5e7eb" : "none",

            minWidth: 0, // stop grid item forcing col width from long text
            // border: "1px red solid",
          }}
        >
          <DetailField
            label={field.label}
            value={value}
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          />
        </Box>
      );
    })}
  </Box>
);

export default FormSectionGrid;
