import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

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
          sx={{ display: "block", mb: 0.5, fontWeight: 500, fontSize: "14px", color: "#111928" }}
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
            backgroundColor: "#F9FAFB",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D1D5DB",
            },
            ...sx,
          }}
          renderValue={(selected) => {
            if (selected === "" || selected === undefined || selected === null) {
              return (
                <Box component="span" sx={{ color: "#9CA3AF", fontWeight: 400, fontSize: "14px" }}>
                  {placeholder}
                </Box>
              );
            }
            const match = options.find((option) => option.value === selected);
            return match ? match.label : selected;
          }}
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: "12px",
                  boxShadow: "0 12px 28px rgba(17, 25, 40, 0.12)",
                  "& .MuiList-root": {
                    py: 1,
                  },
                  "& .MuiMenuItem-root": {
                    py: 1.5,
                    px: 2.5,
                    fontSize: "15px",
                    color: "#111928",
                  },
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "transparent",
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover, & .MuiMenuItem-root:hover": {
                    backgroundColor: "#F9FAFB",
                  },
                },
              },
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                {option.label}
                {option.value === value && <CheckIcon sx={{ fontSize: 18, color: "#111928" }} />}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormSelect;
