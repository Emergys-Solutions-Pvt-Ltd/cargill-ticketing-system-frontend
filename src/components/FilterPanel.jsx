import {
  Box,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Section header row w/ chevron (visual only, sections stay open — wire up
// collapse state later if needed)
const SectionHeader = ({ label }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1.5,
    }}
  >
    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>{label}</Typography>
    <ExpandMoreIcon sx={{ fontSize: 18, color: "text.secondary" }} />
  </Box>
);

const FieldLabel = ({ children }) => (
  <Typography
    variant="caption"
    sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
  >
    {children}
  </Typography>
);

const FIELD_HEIGHT = "2.125rem";

const selectSx = {
  width: "100%",
  height: FIELD_HEIGHT,
  borderRadius: "8px",
};

const textFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": { borderRadius: "8px", height: FIELD_HEIGHT },
};

const FilterPanel = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
  activeFilterCount = 0,
  queueOptions = [],
  ticketTypeOptions = ["All", "Service", "Incident", "Task"],
  priorityOptions = ["Low", "Medium", "High", "Critical"],
  statusOptions = ["Open", "In Progress", "Resolved", "Closed"],
  employeeOptions = [],
  requestorOptions = [],
}) => {
  const set = (key) => (e) => onFilterChange(key, e.target.value);
  const setDate = (key) => (e) => onFilterChange(key, e.target.value);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(15, 23, 42, 0.5)" }, // dim/blue overlay
        },
      }}
      PaperProps={{
        sx: {
        //   width: "360px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
        },
      }}
      sx={{
        width:"520px"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: "1px solid #E5E7EB",
          width:"520px"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Box
              sx={{
                minWidth: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#1B7F37",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "4px",
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5 }}>
        {/* Ticket Details */}
        <SectionHeader label="Ticket Details" />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <FieldLabel>Queue</FieldLabel>
            <Select
              displayEmpty
              value={filters.queue ?? ""}
              onChange={set("queue")}
              sx={selectSx}
              renderValue={(v) => v || "Select queue"}
            >
              {queueOptions.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <FieldLabel>Ticket Type</FieldLabel>
            <Select
              value={filters.ticketType ?? "All"}
              onChange={set("ticketType")}
              sx={selectSx}
            >
              {ticketTypeOptions.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <FieldLabel>Priority</FieldLabel>
            <Select
              displayEmpty
              value={filters.priority ?? ""}
              onChange={set("priority")}
              sx={selectSx}
              renderValue={(v) => v || "Select priority"}
            >
              {priorityOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <FieldLabel>Status</FieldLabel>
            <Select
              displayEmpty
              value={filters.status ?? ""}
              onChange={set("status")}
              sx={selectSx}
              renderValue={(v) => v || "Select status"}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <FieldLabel>Short Description</FieldLabel>
            <TextField
              placeholder="Search short description"
              value={filters.shortDescription ?? ""}
              onChange={set("shortDescription")}
              size="small"
              sx={textFieldSx}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <FieldLabel>Description</FieldLabel>
            <TextField
              placeholder="Search description"
              value={filters.description ?? ""}
              onChange={set("description")}
              size="small"
              sx={textFieldSx}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <FieldLabel>Resolution</FieldLabel>
            <TextField
              placeholder="Search resolution"
              value={filters.resolution ?? ""}
              onChange={set("resolution")}
              size="small"
              sx={textFieldSx}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date Range */}
        <SectionHeader label="Date Range" />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <FieldLabel>Open Date</FieldLabel>
            <TextField
              type="date"
              value={filters.openDate ?? ""}
              onChange={setDate("openDate")}
              size="small"
              sx={textFieldSx}
              placeholder="Select range"
            />
          </Box>
          <Box>
            <FieldLabel>Due Date</FieldLabel>
            <TextField
              type="date"
              value={filters.dueDate ?? ""}
              onChange={setDate("dueDate")}
              size="small"
              sx={textFieldSx}
            />
          </Box>
          <Box>
            <FieldLabel>Resolve Date</FieldLabel>
            <TextField
              type="date"
              value={filters.resolveDate ?? ""}
              onChange={setDate("resolveDate")}
              size="small"
              sx={textFieldSx}
            />
          </Box>
          <Box>
            <FieldLabel>Closed Date</FieldLabel>
            <TextField
              type="date"
              value={filters.closedDate ?? ""}
              onChange={setDate("closedDate")}
              size="small"
              sx={textFieldSx}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* People */}
        <SectionHeader label="People" />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <FieldLabel>Employee</FieldLabel>
            <Select
              displayEmpty
              value={filters.employee ?? ""}
              onChange={set("employee")}
              sx={selectSx}
              renderValue={(v) => v || "Select employee"}
            >
              {employeeOptions.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <FieldLabel>Requestor</FieldLabel>
            <Select
              displayEmpty
              value={filters.requestor ?? ""}
              onChange={set("requestor")}
              sx={selectSx}
              renderValue={(v) => v || "Select requestor"}
            >
              {requestorOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <Button
          onClick={onReset}
          sx={{ color: "#1B7F37", textTransform: "none", fontWeight: 500 }}
        >
          Reset
        </Button>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#D1D5DB",
              color: "text.primary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onApply}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#1B7F37",
              "&:hover": { backgroundColor: "#166430" },
            }}
          >
            Apply Filter
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterPanel;
