import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";

const FormSelect = ({
  label,
  required = false,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  sx = {},
  fullWidth = true,
  ...props
}) => {
  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 0.5, fontWeight: 500, color: "text.secondary" }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      <FormControl fullWidth={fullWidth} size="small">
        <Select
          value={value ?? ""}
          onChange={onChange}
          displayEmpty
          sx={{
            borderRadius: "8px",
            backgroundColor: "background.paper",
            ...sx,
          }}
          renderValue={(selected) => {
            if (selected === "" || selected === undefined || selected === null) {
              return (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {placeholder}
                </Box>
              );
            }
            const match = options.find((option) => option.value === selected);
            return match ? match.label : selected;
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormSelect;
