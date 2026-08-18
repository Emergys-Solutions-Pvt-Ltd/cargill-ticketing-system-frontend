import { Box, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DetailTable = ({ columns, rows, onView, onDelete }) => (
  <Box
    sx={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "6px" }}
  >
    <Box
      component="table"
      sx={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
    >
      <Box component="thead">
        <Box component="tr" sx={{ backgroundColor: "#f3f4f6" }}>
          {columns.map((col) => (
            <Box
              component="th"
              key={col}
              sx={{
                textAlign: col === "Action" ? "right" : "left",
                fontSize: "11px",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                px: 2,
                py: 1.25,
                whiteSpace: "nowrap",
              }}
            >
              {col}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {rows.map((row, i) => (
          <Box component="tr" key={i} sx={{ borderTop: "1px solid #e5e7eb" }}>
            {columns.map((col) =>
              col === "Action" ? (
                <Box
                  component="td"
                  key={col}
                  sx={{
                    px: 2,
                    py: 1,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  <IconButton size="small" onClick={() => onView?.(row)}>
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 18, color: "#6b7280" }}
                    />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(row)}>
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 18, color: "#d92d20" }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  component="td"
                  key={col}
                  sx={{
                    fontSize: "13px",
                    color: "#374151",
                    px: 2,
                    py: 1.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row[col] ?? "-"}
                </Box>
              ),
            )}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default DetailTable;
