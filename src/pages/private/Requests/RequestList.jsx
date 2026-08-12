import { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import {
  getStoredTickets,
  getStoredTicketsAsync,
} from "../../../utils/rbacData";
import SearchIcon from "../../../../src/assets/icons/search.svg";
import FilterIcon from "../../../../src/assets/icons/filter.svg";
import SelectedFilterIcon from "../../../../src/assets/icons/greenFilter.svg";
import CommonTable from "../../../components/common/CommonTable";
import CommonChip from "../../../components/common/CommonChip";
import LabTabs from "../../../components/LabTabs";
import RequestTabs from "./RequestTabs";

// Page-specific: truncation style reused by two columns
const truncateCellSx = {
  maxWidth: 200,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const RequestList = () => {
  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all-requests");
  const [openRequestTabs, setOpenRequestTabs] = useState([]);

  useEffect(() => {
    if (tickets.length === 0) {
      getStoredTicketsAsync().then((fetchedTickets) => {
        setTickets(fetchedTickets);
      });
    }
  }, [tickets]);

  useEffect(() => {
    const count = Number(statusFilter !== "All");
    setActiveFilterCount(count);
  }, [statusFilter]);

  const filteredRequests = tickets.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      row.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpenRequestTab = (row) => {
    setOpenRequestTabs((prevTabs) => {
      const alreadyOpen = prevTabs.some((tab) => tab.id === row.id);
      if (alreadyOpen) {
        setActiveTab(row.id);
        return prevTabs;
      }

      const nextTabs = [...prevTabs, { id: row.id, request: row }];
      setActiveTab(row.id);
      return nextTabs;
    });
  };

  const handleCloseRequestTab = (tabId, event) => {
    event.stopPropagation();
    setOpenRequestTabs((prevTabs) => {
      const remainingTabs = prevTabs.filter((tab) => tab.id !== tabId);
      setActiveTab((currentTab) => {
        if (currentTab === tabId) {
          return remainingTabs.length > 0 ? remainingTabs[0].id : "all-requests";
        }
        return currentTab;
      });
      return remainingTabs;
    });
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "TICKET ID",
        cellProps: { component: "th", scope: "row" },
        cellSx: {
          color: "#1C64F2",
          fontWeight: 500,
          "&:hover": { textDecoration: "underline" },
        },
      },
      {
        key: "title",
        label: "SHORT DESCRIPTION",
        cellSx: truncateCellSx,
      },
      {
        key: "description",
        label: "DESCRIPTION",
        cellSx: truncateCellSx,
        render: (value, row) => row.description || row.title,
      },
      {
        key: "ticketType",
        label: "TICKET TYPE",
        render: (value) => value || "Service",
      },
      {
        key: "formName",
        label: "FORM NAME",
        render: (value) => value || "General Request",
      },
      {
        key: "clientId",
        label: "CLIENT ID",
        render: (value) => value || "N/A",
      },
      {
        key: "contact",
        label: "CONTACT",
        render: (value) => value || "N/A",
      },
      {
        key: "status",
        label: "STATUS",
        render: (_value, row) => <CommonChip status={row.status} label={row.status} />,
      },
      {
        key: "created",
        label: "OPENED DATE",
      },
      {
        key: "assignee",
        label: "STAFF",
        render: (value) => value || "Unassigned",
      },
    ],
    [],
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <RequestTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openRequestTabs={openRequestTabs}
        onCloseTab={handleCloseRequestTab}
      />

      {activeTab === "all-requests" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}>
              Requests
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 400, fontSize: "13px" }}
            >
              Search, review, and stay informed about your active and completed requests.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "260px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "2.125rem",
                },
                backgroundColor: "background.paper",
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={SearchIcon} alt="Search" width={16} height={16} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              onClick={() => {
                setStatusFilter((current) => (current === "All" ? "Open" : "All"));
              }}
              sx={{
                height: "2.125rem",
                borderRadius: "8px",
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                ...(activeFilterCount > 0
                  ? {
                    backgroundColor: "#F3FAF7",
                    border: "1px solid #1B7F37",
                    color: "#1B7F37",
                  }
                  : {
                    backgroundColor: "background.paper",
                    border: "1px solid #D1D5DB",
                  }),
              }}
            >
              <Box
                component="img"
                src={activeFilterCount > 0 ? SelectedFilterIcon : FilterIcon}
                alt="Filter"
              />
              <Typography variant="body2" sx={activeFilterCount > 0 ? { color: "#1B7F37" } : undefined}>
                Filter
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
          </Box>
        </Box>
      )}

      {activeTab === "all-requests" ? (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CommonTable
            sx={{ flexGrow: 1, minHeight: 0 }}
            columns={columns}
            rows={paginatedRequests}
            onRowClick={handleOpenRequestTab}
            emptyMessage="No matching records found in this view."
            tableContainerSx={{ mt: 0 }}
            ariaLabel="Cargill ticket list"
            pagination={{
              count: filteredRequests.length,
              page,
              onPageChange: setPage,
              rowsPerPage,
              onRowsPerPageChange: (value) => {
                setRowsPerPage(value);
                setPage(0);
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            backgroundColor: "background.paper",
            p: { xs: 1, md: 2 },
            flexGrow: 1,
          }}
        >
          {openRequestTabs
            .filter((tab) => tab.id === activeTab)
            .map((tab) => (
              <Box key={tab.id} sx={{ width: "100%" }}>
                <LabTabs comments={tab.request.comments || []} request={tab.request} />
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default RequestList;
