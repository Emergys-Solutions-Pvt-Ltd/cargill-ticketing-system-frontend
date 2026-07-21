import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * A reusable custom select component wrapping Material-UI's Select.
 *
 * @param {object} props The component props.
 * @param {string} props.label - The label for the select input.
 * @param {string|number} props.value - The current value of the select.
 * @param {Array<object>} props.options - An array of options to display. Each option is an object with 'label' and 'value'.
 * @param {string} [props.placeholder] - The placeholder text to show when no value is selected.
 * @param {function} props.onChange - The callback function to call when the value changes.
 * @param {boolean} [props.disabled=false] - If true, the select will be disabled.
 * @param {boolean} [props.required=false] - If true, the select will be required.
 * @param {boolean} [props.error=false] - If true, the select will be in an error state.
 * @param {string} [props.helperText] - The helper text to display below the select.
 * @param {boolean} [props.fullWidth=false] - If true, the select will take up the full width of its container.
 * @param {'small'|'medium'} [props.size='small'] - The size of the select component.
 * @param {object} [props.sx={}] - Custom styles to be applied to the component.
 * @returns {React.ReactElement} The rendered select component.
 */
const CustomSelect = ({
  label,
  value,
  options = [],
  placeholder,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
  fullWidth = false,
  size = "small",
  sx = {},
}) => {
  return (
    <Box sx={sx}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          mb: 0.5,
          color: "text.primary",
        }}
      >
        {label}
      </Typography>
      <FormControl
        fullWidth={fullWidth}
        error={error}
        size={size}
        required={required}
        disabled={disabled}
      >
        <Select
          value={value}
          onChange={onChange}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            borderRadius: "8px",
            backgroundColor: "background.paper",
            "& .MuiSelect-select": {
              fontSize: "0.875rem",
              fontWeight: 400,
            },
            "& .MuiSvgIcon-root": {
              color: "action.active",
            },
            ".MuiOutlinedInput-notchedOutline": {
              // For a cleaner look, you can make the default border lighter
              borderColor: "rgba(0, 0, 0, 0.12)",
            },
          }}
          renderValue={(selectedValue) => {
            if (
              selectedValue === "" ||
              selectedValue === null ||
              selectedValue === undefined
            ) {
              return (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {placeholder || "Select..."}
                </Box>
              );
            }
            const selectedOption = options.find(
              (option) => option.value === selectedValue,
            );
            return selectedOption ? selectedOption.label : selectedValue;
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default CustomSelect;
