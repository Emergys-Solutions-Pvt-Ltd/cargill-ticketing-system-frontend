import { Box, Typography, TextField, InputAdornment } from "@mui/material";

const FormTextField = ({
  label,
  required = false,
  icon,
  iconPosition = "end",
  sx = {},
  fullWidth = true,
  ...props
}) => {
  const adornment = icon ? (
    <InputAdornment position={iconPosition}>
      <img src={icon} alt="" width={16} height={16} />
    </InputAdornment>
  ) : undefined;

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
      <TextField
        fullWidth={fullWidth}
        size="small"
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "background.paper",
          },
          ...sx,
        }}
        slotProps={
          adornment
            ? {
                input: {
                  [iconPosition === "start" ? "startAdornment" : "endAdornment"]: adornment,
                },
              }
            : undefined
        }
        {...props}
      />
    </Box>
  );
};

export default FormTextField;
