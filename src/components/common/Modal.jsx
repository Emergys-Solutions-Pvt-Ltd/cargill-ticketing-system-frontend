import { Dialog, Box, Typography, IconButton, Divider, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  fullWidth = true,
  showCloseButton = true,
  footer,
  onCancel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmLabel = "Confirm",
  confirmColor = "primary",
  confirmDisabled = false,
  confirmLoading = false,
}) => {
  const confirmStyle = CONFIRM_COLOR_STYLES[confirmColor] || CONFIRM_COLOR_STYLES.primary;
  const showActions = Boolean(footer || onConfirm || onCancel);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: { borderRadius: "12px" },
        },
      }}
    >
      {title && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "text.primary" }}>
              {title}
            </Typography>
            {showCloseButton && (
              <IconButton size="small" onClick={onClose} aria-label="Close">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Divider />
        </>
      )}

      <Box sx={{ px: 3, py: 3 }}>{children}</Box>

      {showActions && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            pb: 3,
          }}
        >
          {footer ?? (
            <>
              <Button
                variant="outlined"
                onClick={onCancel ?? onClose}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "divider",
                  color: "text.primary",
                }}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="contained"
                onClick={onConfirm}
                disabled={confirmDisabled || confirmLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#fff",
                  ...confirmStyle,
                  "&.Mui-disabled": {
                    backgroundColor: confirmStyle.backgroundColor,
                    color: "#fff",
                    opacity: 0.5,
                  },
                }}
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </Box>
      )}
    </Dialog>
  );
};

export default Modal;
