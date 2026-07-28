import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Pagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePreviousPage = () => {
    onPageChange(page - 1);
  };

  const handleNextPage = () => {
    onPageChange(page + 1);
  };

  const handlePageInputChange = (e) => {
    const newPage = e.target.value ? Number(e.target.value) - 1 : 0;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const handleRowsPerPageChange = (e) => {
    onRowsPerPageChange(parseInt(e.target.value, 10));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
      }}
    >
      {/* Left Section */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {count > 0
            ? `${page * rowsPerPage + 1} - ${Math.min(
                (page + 1) * rowsPerPage,
                count,
              )}`
            : "0"}{" "}
          of {count} items
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            sx={{
              borderRadius: "6px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                height: "100%",
                boxSizing: "border-box",
              },
            }}
          >
            <MenuItem value={8}>8 / page</MenuItem>
            <MenuItem value={10}>10 / page</MenuItem>
            <MenuItem value={25}>25 / page</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Right Section */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={handlePreviousPage}
          disabled={page === 0}
          sx={{
            height: 36,
            minWidth: "auto",
            px: 1.5,
            textTransform: "none",
            color: "text.primary",
          }}
        >
          Previous
        </Button>

        <TextField
          size="small"
          value={page + 1}
          onChange={handlePageInputChange}
          sx={{
            width: 35,
            "& .MuiOutlinedInput-root": {
              height: 35,
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #00843D",
              fontWeight: 500,
              "& input": {
                textAlign: "center",
                padding: 0,
                height: "100%",
              },
              "& fieldset": { border: "none" },
            },
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", height: 36 }}
        >
          of {totalPages}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          sx={{
            height: 36,
            minWidth: "auto",
            px: 1.5,
            textTransform: "none",
            color: "text.primary",
          }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default Pagination;