import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddButton = ({ children, sx = {}, ...props }) => (
  <Button
    variant="outlined"
    startIcon={<AddIcon />}
    sx={{
      borderRadius: "4px",
      textTransform: "none",
      fontWeight: 600,
      whiteSpace: "nowrap",
      color: "#00843D",
      borderColor: "#00843D",
      backgroundColor: "#F3FAF7",
      "&:hover": {
        borderColor: "#00843D",
        backgroundColor: "#E6F4EC",
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Button>
);

export default AddButton;
