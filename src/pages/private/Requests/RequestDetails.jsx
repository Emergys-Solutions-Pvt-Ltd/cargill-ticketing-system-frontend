import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";

import {
  getStoredTickets,
  getStoredTicketsAsync,
  setStoredTickets,
} from "../../../utils/rbacData";

import { recordTicketView } from "../../../utils/fileActionTracker";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";
import SubmittedFormView from "../../../components/common/SubmittedFormView";
import DetailTable from "../../../components/common/DetailTable";
import FormSection from "../../../components/common/FormSection";
import FormSectionGrid from "../../../components/common/FormSectionGrid";
import {
  detailsTabSections,
  requestFormSections,
  submittedFormData,
} from "../../../api/mockData";
import RequestTabsNav from "../../../components/common/RequestTabsNav";
import FilePreviewModal from "../../../components/filePreviews/FilePreviewModal";

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "new":
    case "open":
      return { bg: "#e6f4ea", text: "#137333", border: "#ceead6" };
    case "in progress":
      return { bg: "#e8f0fe", text: "#1a73e8", border: "#d2e3fc" };
    case "pending":
    case "on hold":
      return { bg: "#fef7e0", text: "#b06000", border: "#feebd0" };
    case "resolved":
      return { bg: "#e2f1e8", text: "#0f9d58", border: "#c6ecdb" };
    case "closed":
      return { bg: "#f1f3f4", text: "#5f6368", border: "#dadce0" };
    default:
      return { bg: "#f1f3f4", text: "#5f6368", border: "#dadce0" };
  }
};

function RequestDetails({ request }) {
  const { requestId } = useParams();
  const { user: authUser } = useAuth();

  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [activeTab, setActiveTab] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);

  console.log("RequestDetails requestId in requestDetails:", request);
  useEffect(() => {
    if (request?.id && authUser) {
      recordTicketView(request.id, authUser);
    }
  }, [request?.id, authUser]);

  if (!request) return null;

  useEffect(() => {
    if (tickets.length === 0) {
      getStoredTicketsAsync().then((fetchedTickets) => {
        setTickets(fetchedTickets);
      });
    }
  }, [tickets.length]);

  useEffect(() => {
    if (requestId && authUser) {
      recordTicketView(requestId, authUser);
    }
  }, [requestId, authUser]);

  // const request = useMemo(() => {
  //   return (
  //     tickets.find((r) => r.id === requestId) || {
  //       id: requestId || "SR0000000",
  //       title: "Request to initiate dynamic scan on SXR QA Environment",
  //       status: "Pending",
  //       priority: "Medium",
  //       created: "",
  //       updated: "",
  //       comments: [],
  //       assignee: "Loading...",
  //       category: "General Support",
  //       department: "Enterprise Services",
  //       contact: "John Doe",
  //       employee: "Samuel Tarley",
  //       requester: "John Doe",
  //       selfServiceRequester: "John Doe",
  //       incident: "",
  //       statusAndPriority: "",
  //       startDate: "",
  //       startTime: "",
  //       endDate: "",
  //       endTime: "",
  //       assignmentGroup: "",
  //       assignedTo: "",
  //     }
  //   );
  // }, [tickets, requestId]);

  const statusColors = getStatusColor(request.status);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleResolveTicket = () => {
    const updatedRequest = {
      ...request,
      status: "Resolved",
      updated: "Just now",
    };
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === request.id ? updatedRequest : ticket,
    );
    setTickets(updatedTickets);
    setStoredTickets(updatedTickets);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        gap: 2.5,
        overflow: "hidden",
      }}
    >
      {/* Request Header */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          p: 2,

          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontWeight: 700, color: "#101828" }}
          >
            {request.id}
          </Typography>
          <Chip
            label={request.status}
            size="small"
            sx={{
              height: 24,
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              border: `1px solid ${statusColors.border}`,
              fontWeight: 600,
              fontSize: "10px",
              borderRadius: "14px",
              "& .MuiChip-label": { px: 1.1 },
            }}
          />
        </Box>
        <Typography
          sx={{ mt: 1, color: "#374151", fontSize: "14px", fontWeight: 300 }}
        >
          {request.title}
        </Typography>
      </Card>

      {/* Main Service Request Form */}
      <Box
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <RequestTabsNav
          ticketType={request.ticketType || "Service"}
          value={activeTab}
          onChange={handleTabChange}
        />

        {activeTab === 0 && (
          <Box
            sx={{
              py: 3,
              px: 2.5,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              flex: 1,
              minHeight: 0,
            }}
          >
            {requestFormSections.map((section) => (
              <FormSection
                key={section.title}
                title={section.title}
                icon={section.icon}
                defaultExpanded={section.defaultExpanded}
              >
                <FormSectionGrid
                  fields={section.fields(request)}
                  gridSize={section.gridSize}
                />
              </FormSection>
            ))}
          </Box>
        )}

        {activeTab === 1 && (
          <Box
            sx={{
              py: 3,
              px: 2.5,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {detailsTabSections.map((section) => (
              <FormSection
                key={section.title}
                title={section.title}
                icon={section.icon}
                defaultExpanded={section.defaultExpanded}
              >
                <DetailTable
                  columns={section.columns}
                  rows={section.rows(request)}
                  onView={(row) =>
                    setPreviewFile({
                      name: row.Title,
                      uploadedBy: "Alex Morgan",
                      date: "Jan 17, 2026 · 09:21 AM",
                      downloadCount: 1,
                      previewTitle:
                        "Cargill Ticketing System - Security Scan Requirements Checklist",
                      previewLines: [
                        "Verify CORS policies on all SXR QA endpoints.",
                        "Run dynamic application scan against HTTP API.",
                        "Validate session timeout parameters.",
                        "Verify SSL/TLS cipher suites.",
                        "Check RBAC roles for privilege escalation holes.",
                        "Verify encryption settings for sensitive parameters.",
                      ],
                    })
                  }
                  onDelete={(row) => console.log("delete", row)}
                />
                <FilePreviewModal
                  open={!!previewFile}
                  file={previewFile}
                  onClose={() => setPreviewFile(null)}
                  onDownload={() => console.log("download", previewFile)}
                  onViewHistory={() => console.log("history", previewFile)}
                />
              </FormSection>
            ))}
          </Box>
        )}

        {activeTab === 2 && (
          <Box
            sx={{
              py: 3,
              px: 2.5,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <SubmittedFormView data={submittedFormData} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RequestDetails;
