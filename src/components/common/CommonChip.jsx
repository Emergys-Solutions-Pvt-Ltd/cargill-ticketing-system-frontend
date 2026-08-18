import Chip from "@mui/material/Chip";

const STATUS_STYLES = {
    "in progress": {
        backgroundColor: "#E1EFFE",
        color: "#3B82F6",
        border: "1px solid #C3DDFD",
    },

    pending: {
        backgroundColor: "#FEECDC",
        color: "#C97601",
        border: "1px solid #FCD9BD",
    },

    "on hold": {
        backgroundColor: "#FEECDC",
        color: "#C97601",
        border: "1px solid #FCD9BD",
    },

    completed: {
        backgroundColor: "#DEF7EC",
        color: "#0E9F6E",
        border: "1px solid #BCF0DA",
    },

    closed: {
        backgroundColor: "#DEF7EC",
        color: "#0E9F6E",
        border: "#BCF0DA",
    },

    open: {
        backgroundColor: "#E1EFFE",
        color: "#3B82F6",
        border: "1px solid #C3DDFD",
    },

    rejected: {
        backgroundColor: "#FDE8E8",
        color: "#F05252",
        border: "1px solid #F8B4B4",
    },

    cancelled: {
        backgroundColor: "#F3F4F6",
        color: "#6B7280",
        border: "1px solid #D1D5DB",
    },

    active: {
        backgroundColor: "#D1FAE5",
        color: "#059669",
        border: "1px solid #6EE7B7",
    },

    inactive: {
        backgroundColor: "#FEE2E2",
        color: "#EF4444",
        border: "1px solid #FECACA",
    },

    "super user": {
        backgroundColor: "#E9DAFA",
        color: "#8A3FD0",
        border: "1px solid #D8B4FE",
    },

    user: {
        backgroundColor: "#E1EFFE",
        color: "#3B82F6",
        border: "1px solid #C3DDFD",
    },
};

const DEFAULT_STYLE = {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
    border: "1px solid #D1D5DB",
};

const CommonChip = ({
    status = "",
    label,
    size = "small",
    sx = {},
    ...props
}) => {
    const chipStyle =
        STATUS_STYLES[status.toLowerCase()] || DEFAULT_STYLE;

    return (
        <Chip
            label={label || status}
            size={size}
            sx={{
                borderRadius: "50px",
                fontSize: "0.72rem",
                fontWeight: 500,
                height: "24px",
                "& .MuiChip-label": {
                    px: 1.5,
                },
                ...chipStyle,
                ...sx,
            }}
            {...props}
        />
    );
};

export default CommonChip;