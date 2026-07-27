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

/**
 * CommonTable — Reusable data table component.
 *
 * Extracted from the Request List page to serve as a shared table across the application.
 * Preserves the exact visual design: borders, header typography, row hover, empty state, and pagination.
 *
 * Column definition shape:
 * {
 *   key:        string            — Data field name used to read the value from each row object.
 *   label:      string            — Header text displayed in the column header.
 *   render?:    (value, row) => ReactNode — Custom cell renderer. Receives the cell value and full row.
 *   cellSx?:    object            — MUI `sx` overrides applied to every body <TableCell> in this column.
 *   cellProps?: object            — Additional props spread onto the body <TableCell> (e.g. component="th").
 *   headerSx?:  object            — MUI `sx` overrides for the header <TableCell>.
 *   align?:     "left"|"center"|"right" — Text alignment for both header and body cells.
 *   sortable?:  boolean           — Per-column opt-out when global `sortable` is true. Defaults to true.
 * }
 *
 * @param {Object}   props
 * @param {Array}    props.columns              — Column definitions (see shape above).
 * @param {Array}    props.rows                 — Data rows to display.
 * @param {Function} [props.onRowClick]         — Row click handler. Receives the row object.
 * @param {boolean}  [props.loading=false]      — Show a centered spinner instead of rows.
 * @param {string}   [props.emptyMessage]       — Message when rows array is empty.
 * @param {Object}   [props.pagination]         — Pagination config: { count, page, onPageChange, rowsPerPage, onRowsPerPageChange }.
 * @param {boolean}  [props.sortable=false]     — Enable column sorting globally.
 * @param {string}   [props.sortBy]             — Controlled: currently sorted column key.
 * @param {string}   [props.sortDirection]      — Controlled: "asc" or "desc".
 * @param {Function} [props.onSort]             — Controlled sort handler. Receives column key.
 * @param {boolean}  [props.selectable=false]   — Show a checkbox column for row selection.
 * @param {Array}    [props.selectedRows=[]]    — Array of selected row keys.
 * @param {Function} [props.onSelectionChange]  — Selection change handler. Receives updated keys array.
 * @param {string|Function} [props.rowKey="id"] — Field name or function to derive a unique key per row.
 * @param {Function} [props.actions]            — Actions column renderer. Receives row, returns ReactNode.
 * @param {string}   [props.actionsLabel]       — Header label for the actions column.
 * @param {boolean}  [props.stickyHeader=false] — Enable sticky table header.
 * @param {number|string} [props.minWidth=650]  — Minimum table width.
 * @param {Object}   [props.sx]                 — Sx for the root Box wrapper.
 * @param {Object}   [props.tableContainerSx]   — Sx merged into the TableContainer.
 * @param {Object}   [props.tableSx]            — Sx merged into the Table element.
 * @param {string}   [props.ariaLabel]          — aria-label for the <table>.
 */
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
  // ───────── Internal sort state (uncontrolled mode) ─────────
  const [internalSortBy, setInternalSortBy] = useState("");
  const [internalSortDirection, setInternalSortDirection] = useState("asc");

  const activeSortBy =
    controlledSortBy !== undefined ? controlledSortBy : internalSortBy;
  const activeSortDirection =
    controlledSortDirection !== undefined
      ? controlledSortDirection
      : internalSortDirection;

  // ───────── Helpers ─────────
  const getRowKey = (row) => {
    if (typeof rowKey === "function") return rowKey(row);
    return row[rowKey];
  };

  const totalColumns =
    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  // ───────── Sort handlers ─────────
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

  // ───────── Selection handlers ─────────
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

  // ───────── Render ─────────
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
