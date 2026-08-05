import { Box, Typography, Select, MenuItem, FormControl, Chip } from "@mui/material";

const FormMultiSelect = ({
  label,
  required = false,
  value = [],
  onChange,
  options = [],
  placeholder = "Select",
  sx = {},
  fullWidth = true,
  ...props
}) => {
  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    onChange(typeof nextValue === "string" ? nextValue.split(",") : nextValue);
  };

  const handleRemove = (optionValue) => {
    onChange(value.filter((item) => item !== optionValue));
  };

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
          multiple
          value={value}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: "8px",
            backgroundColor: "background.paper",
            "& .MuiSelect-select": {
              py: value.length > 0 ? 0.75 : undefined,
            },
            ...sx,
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {placeholder}
                </Box>
              );
            }
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((selectedValue) => {
                  const match = options.find((option) => option.value === selectedValue);
                  return (
                    <Chip
                      key={selectedValue}
                      label={match ? match.label : selectedValue}
                      size="small"
                      onMouseDown={(event) => event.stopPropagation()}
                      onDelete={() => handleRemove(selectedValue)}
                      sx={{
                        borderRadius: "6px",
                        backgroundColor: "#E0F2FE",
                        color: "#0369A1",
                        fontWeight: 500,
                      }}
                    />
                  );
                })}
              </Box>
            );
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

export default FormMultiSelect;
