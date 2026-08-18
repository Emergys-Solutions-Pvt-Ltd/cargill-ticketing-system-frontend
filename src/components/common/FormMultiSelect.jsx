import { Box, Typography, Select, MenuItem, FormControl, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "../../assets/icons/close.svg";

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
          multiple
          value={value}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: "8px",
            backgroundColor: "#F9FAFB",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D1D5DB",
            },
            "& .MuiSelect-select": {
              py: value.length > 0 ? 0.75 : undefined,
            },
            ...sx,
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <Box component="span" sx={{ color: "#9CA3AF", fontWeight: 400, fontSize: "14px" }}>
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
                      deleteIcon={<img src={CloseIcon} alt="" width={12} height={12} />}
                      sx={{
                        borderRadius: "6px",
                        backgroundColor: "#E0F2FE",
                        color: "#1E429F",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                    />
                  );
                })}
              </Box>
            );
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
                {value.includes(option.value) && <CheckIcon sx={{ fontSize: 18, color: "#111928" }} />}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormMultiSelect;
