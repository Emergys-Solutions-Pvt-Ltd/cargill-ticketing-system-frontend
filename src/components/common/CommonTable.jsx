import { useState } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import Pagination from "../Pagination";

const CommonTable = ({
  columns = [],
  rows = [],
  onRowClick,
  loading = false,
  emptyMessage = "No matching records found.",
  pagination,
  sortable = false,
  sortBy: controlledSortBy,
  sortDirection: controlledSortDirection,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = "id",
  actions,
  actionsLabel = "Actions",
  stickyHeader = false,
  minWidth = 650,
  sx: rootSx = {},
  tableContainerSx = {},
  tableSx = {},
  ariaLabel = "data table",
}) => {
  const [internalSortBy, setInternalSortBy] = useState("");
  const [internalSortDirection, setInternalSortDirection] = useState("asc");

  const activeSortBy =
    controlledSortBy !== undefined ? controlledSortBy : internalSortBy;
  const activeSortDirection =
    controlledSortDirection !== undefined
      ? controlledSortDirection
      : internalSortDirection;

  const getRowKey = (row) => {
    if (typeof rowKey === "function") return rowKey(row);
    return row[rowKey];
  };

  const totalColumns =
    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const handleSort = (columnKey) => {
    if (onSort) {
      onSort(columnKey);
    } else {
      const isAsc =
        activeSortBy === columnKey && activeSortDirection === "asc";
      setInternalSortBy(columnKey);
      setInternalSortDirection(isAsc ? "desc" : "asc");
    }
  };

  // Client-side sort when uncontrolled
  let displayRows = rows;
  if (sortable && !onSort && activeSortBy) {
    displayRows = [...rows].sort((a, b) => {
      const aVal = a[activeSortBy] ?? "";
      const bVal = b[activeSortBy] ?? "";
      if (aVal < bVal) return activeSortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return activeSortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSelectAll = (event) => {
    if (!onSelectionChange) return;
    if (event.target.checked) {
      onSelectionChange(rows.map(getRowKey));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (event, row) => {
    event.stopPropagation();
    if (!onSelectionChange) return;
    const key = getRowKey(row);
    const newSelected = selectedRows.includes(key)
      ? selectedRows.filter((k) => k !== key)
      : [...selectedRows, key];
    onSelectionChange(newSelected);
  };

  const isSelected = (row) => selectedRows.includes(getRowKey(row));

  return (
    <Box sx={rootSx}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "8px",
          border: "1px solid #D1D5DB",
          ...tableContainerSx,
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          sx={{
            minWidth,
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #E5E7EB",
            },
            ...tableSx,
          }}
          aria-label={ariaLabel}
        >
          {/* ─── Table Head ─── */}
          <TableHead>
            <TableRow>
              {/* Checkbox header */}
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.75rem",
                  }}
                >
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < rows.length
                    }
                    checked={
                      rows.length > 0 && selectedRows.length === rows.length
                    }
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}

              {/* Data column headers */}
              {columns.map((col) => {
                const isSortable = sortable && col.sortable !== false;
                return (
                  <TableCell
                    key={col.key}
                    align={col.align || "left"}
                    sortDirection={
                      isSortable && activeSortBy === col.key
                        ? activeSortDirection
                        : false
                    }
                    sx={{
                      fontWeight: 600,
                      color: "#6B7280",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      py: 1.5,
                      ...(col.headerSx || {}),
                    }}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={activeSortBy === col.key}
                        direction={
                          activeSortBy === col.key
                            ? activeSortDirection
                            : "asc"
                        }
                        onClick={() => handleSort(col.key)}
                        sx={{
                          color: "#6B7280 !important",
                          "&.Mui-active": { color: "#6B7280" },
                          "& .MuiTableSortLabel-icon": {
                            color: "#6B7280 !important",
                          },
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}

              {/* Actions header */}
              {actions && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    py: 1.5,
                  }}
                >
                  {actionsLabel}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {/* ─── Table Body ─── */}
          <TableBody>
            {/* Loading state */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : displayRows.length === 0 ? (
              /* Empty state */
              <TableRow>
                <TableCell colSpan={totalColumns} align="center" sx={{ py: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              /* Data rows */
              displayRows.map((row) => {
                const key = getRowKey(row);
                const selected = selectable && isSelected(row);
                return (
                  <TableRow
                    key={key}
                    hover
                    selected={selected}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {/* Row checkbox */}
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected}
                          onChange={(e) => handleSelectRow(e, row)}
                          size="small"
                        />
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.align || "left"}
                        {...(col.cellProps || {})}
                        sx={col.cellSx || {}}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key] ?? ""}
                      </TableCell>
                    ))}

                    {/* Row actions */}
                    {actions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Integrated pagination */}
      {pagination && (
        <Pagination
          count={pagination.count}
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        />
      )}
    </Box>
  );
};

export default CommonTable;
