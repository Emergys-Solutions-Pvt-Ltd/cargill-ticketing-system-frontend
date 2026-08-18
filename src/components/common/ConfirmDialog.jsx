import { Dialog, Box, Typography, Button } from "@mui/material";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";

const CONFIRM_COLOR_STYLES = {
  primary: {
    backgroundColor: "#1B3D41",
    "&:hover": { backgroundColor: "#12292C" },
  },
  success: {
    backgroundColor: "#00843D",
    "&:hover": { backgroundColor: "#046C33" },
  },
  danger: {
    backgroundColor: "#E02424",
    "&:hover": { backgroundColor: "#C81E1E" },
  },
  activate: {
    backgroundColor: "#057A55",
    "&:hover": { backgroundColor: "#046C4A" },
  },
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  icon: Icon = PersonRemoveOutlinedIcon,
  iconColor = "#F05252",
  iconBackgroundColor = "#FEECEC",
  title = "Are you sure?",
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmColor = "danger",
  confirmLoading = false,
}) => {
  const isImageIcon = typeof Icon === "string";
  const confirmStyle = CONFIRM_COLOR_STYLES[confirmColor] || CONFIRM_COLOR_STYLES.danger;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 360,
            maxWidth: "90vw",
            borderRadius: "12px",
            p: 3,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2 }}>
        {isImageIcon ? (
          <Box component="img" src={Icon} alt="" sx={{ width: 64, height: 64 }} />
        ) : (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: iconBackgroundColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: iconColor, fontSize: 28 }} />
          </Box>
        )}
        <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "text.primary" }}>
          {title}
        </Typography>
        {message && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {message}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "4px",
              borderColor: "divider",
              color: "text.primary",
              minWidth: 100,
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={confirmLoading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "4px",
              color: "#fff",
              minWidth: 100,
              ...confirmStyle,
            }}
          >
            {confirmLabel}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
