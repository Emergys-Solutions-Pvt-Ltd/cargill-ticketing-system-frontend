import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

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
import { submittedFormData } from "../../../api/mockData";
import RequestTabsNav from "../../../components/common/RequestTabsNav";
import FilePreviewModal from "../../../components/filePreviews/FilePreviewModal";
import { objectToFields, getStatusColor } from "./utils/formatters.js";
import {
  getServiceRequestForm,
  getServiceRequestDetails,
  getTaskFormDetails,
  getTaskDetails,
  getSubmittedForm,
  getSlaData,
  downloadFile,
} from "../../../api/apiRequests";
import {
  DETAILS_SECTIONS,
  SECTION_ICON_MAP,
  SERVICE_REQUEST_SECTIONS,
  INCIDENT_REQUEST_SECTIONS,
  TASK_REQUEST_SECTIONS,
  TASK_DETAILS_SECTIONS,
  IS_HR,
} from "../../../utils/constants";

function RequestDetails({ request, cachedData, onCacheUpdate }) {
  const { requestId } = useParams();
  const { user: authUser } = useAuth();
  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [activeTab, setActiveTab] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [formSections, setFormSections] = useState([]);
  const [detailsSections, setDetailsSections] = useState([]);
  const [submittedForm, setSubmittedForm] = useState(null);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [submittedFormLoading, setSubmittedFormLoading] = useState(true);
  const [slaRows, setSlaRows] = useState([]);
  const [slaLoading, setSlaLoading] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const ticketTypeNormalized =
    request?.ticketType === "Task" || request?.ticketType === "task"
      ? "Task"
      : request?.ticketType === "Incident" || request?.ticketType === "incident"
        ? "Incident"
        : "Service";
  const HR_TAB_CONFIG = {
    Service: ["Service Request Form", "Details", "Submitted Form"],
    Incident: ["Incident Form", "Details"],
    Task: ["Task Form", "Details"],
  };
  const NONHR_TAB_CONFIG = {
    Service: ["Service Request Form", "Details", "Submitted Form", "SLA"],
    Incident: ["Incident Form", "Details", "SLA"],
    Task: ["Task Form", "Details"],
  };
  const tabLabels = (IS_HR ? HR_TAB_CONFIG : NONHR_TAB_CONFIG)[
    ticketTypeNormalized
  ];

  const formTabIndex = 0;
  const detailsTabIndex = tabLabels.indexOf("Details");
  const submittedFormTabIndex = tabLabels.indexOf("Submitted Form");
  const slaTabIndex = tabLabels.indexOf("SLA");

  useEffect(() => {
    if (!request?.id || IS_HR) {
      setSlaLoading(false);
      return;
    }

    if (cachedData?.slaRows !== undefined) {
      setSlaRows(cachedData.slaRows);
      setSlaLoading(false);
      return;
    }

    let cancelled = false;
    const fetchSla = async () => {
      setSlaLoading(true);
      try {
        const res = await getSlaData({ ticketId: request.id });
        if (!cancelled && res?.success) {
          setSlaRows(res.data);
          onCacheUpdate?.(request.id, { slaRows: res.data });
        }
      } catch (error) {
        console.error("Failed to fetch SLA data:", error);
      } finally {
        if (!cancelled) setSlaLoading(false);
      }
    };

    fetchSla();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  useEffect(() => {
    if (!request?.id) return;

    if (submittedFormTabIndex === -1) {
      setSubmittedFormLoading(false);
      return;
    }

    if (cachedData?.submittedForm !== undefined) {
      setSubmittedForm(cachedData.submittedForm);
      setSubmittedFormLoading(false);
      return;
    }

    let cancelled = false;
    const fetchSubmittedForm = async () => {
      setSubmittedFormLoading(true);
      try {
        const res = await getSubmittedForm({ ticketId: request.id });
        if (!cancelled && res?.success) {
          setSubmittedForm(res.data);
          onCacheUpdate?.(request.id, { submittedForm: res.data });
        }
      } catch (error) {
        console.error("Failed to fetch submitted form:", error);
      } finally {
        if (!cancelled) setSubmittedFormLoading(false);
      }
    };

    fetchSubmittedForm();
    return () => {
      cancelled = true;
    };
  }, [request?.id]);

  useEffect(() => {
    if (request?.id && authUser) {
      recordTicketView(request.id, authUser);
    }
  }, [request?.id, authUser]);

  useEffect(() => {
    if (!request?.id) return;

    const ticketType = request.ticketType || "Service";
    const isService =
      ticketType === "Service" || ticketType === "serviceRequest";
    const isIncident = ticketType === "Incident" || ticketType === "incident";
    const isServiceLike = isService || isIncident;
    const isTask = ticketType === "Task" || ticketType === "task";

    if (!isServiceLike && !isTask) {
      setSectionsLoading(false);
      setDetailsLoading(false);
      return;
    }

    if (
      cachedData?.formSections !== undefined &&
      cachedData?.detailsSections !== undefined
    ) {
      setFormSections(cachedData.formSections);
      setDetailsSections(cachedData.detailsSections);
      setSectionsLoading(false);
      setDetailsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAll = async () => {
      setSectionsLoading(true);
      setDetailsLoading(true);

      const formPromise = isTask
        ? getTaskFormDetails({ ticketId: request.id })
        : getServiceRequestForm({ ticketId: request.id });

      const detailsPromise = isTask
        ? getTaskDetails({ ticketId: request.id })
        : getServiceRequestDetails({ ticketId: request.id });

      const [formRes, detailsRes] = await Promise.allSettled([
        formPromise,
        detailsPromise,
      ]);

      if (cancelled) return;

      let newFormSections = [];
      let newDetailsSections = [];

      if (formRes.status === "fulfilled" && formRes.value?.success) {
        const apiData = formRes.value?.data || {};
        const sectionConfig = isTask
          ? TASK_REQUEST_SECTIONS
          : isIncident
            ? INCIDENT_REQUEST_SECTIONS
            : SERVICE_REQUEST_SECTIONS;
        newFormSections = sectionConfig.map((section) => ({
          ...section,
          defaultExpanded: true,
          type: "grid",
          gridSize: 3,
          fields: objectToFields(apiData[section.key]),
        }));
      } else if (formRes.status === "rejected") {
        console.error("Failed to fetch form:", formRes.reason);
      }
      setFormSections(newFormSections);
      setSectionsLoading(false);

      if (detailsRes.status === "fulfilled" && detailsRes.value?.success) {
        const apiData = detailsRes.value?.data || {};
        const sectionConfig = isTask ? TASK_DETAILS_SECTIONS : DETAILS_SECTIONS;
        newDetailsSections = sectionConfig.map((section) => {
          const rows = apiData[section.key] || [];
          return {
            ...section,
            defaultExpanded: true,
            type: "table",
            rows,
            columns: rows.length > 0 ? Object.keys(rows[0]) : [],
          };
        });
      } else if (detailsRes.status === "rejected") {
        console.error("Failed to fetch details:", detailsRes.reason);
      }
      setDetailsSections(newDetailsSections);
      setDetailsLoading(false);

      onCacheUpdate?.(request.id, {
        formSections: newFormSections,
        detailsSections: newDetailsSections,
      });
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id, request?.ticketType]);

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

  const handleDownloadFile = async (row) => {
    try {
      console.log("--------------download");
      const file = await downloadFile({ relativePath: row.relativePath });
      if (file?.success && file.data?.url) {
        const link = document.createElement("a");
        link.href = file.data.url;
        link.download = file.data.fileName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Download failed:", file);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleViewFile = async (row) => {
    try {
      const file = await downloadFile({ relativePath: row.relativePath });
      if (file?.success && file.data?.url) {
        setPreviewFile({
          name: row.Title,
          uploadedBy: row.AddedBy || row["Created By"],
          date: row.Date || row["Last Modified"],
          downloadCount: 1,
          previewTitle: row.Title,
          previewUrl: file.data.url,
          contentType: file.data.contentType,
          relativePath: row.relativePath,
        });
        setPreviewModalOpen(true);
      } else {
        console.error("View failed:", file);
      }
    } catch (error) {
      console.error("View error:", error);
    }
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            sx={{ mt: 1, color: "#374151", fontSize: "14px", fontWeight: 300 }}
          >
            {request.title}
          </Typography>
          <Box sx={{ display: "flex", mt: 1.5 }}>
            <Typography
              sx={{ color: "#374151", fontWeight: 400, fontSize: "14px" }}
            >
              Ticket type:{" "}
            </Typography>
            <Typography
              sx={{ color: "#1F2A37", fontWeight: 400, fontSize: "14px" }}
            >
              {request.ticketType}
            </Typography>
          </Box>
        </Box>
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

        {activeTab === formTabIndex && (
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
            {sectionsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              formSections.map((section) => {
                const SectionIcon =
                  SECTION_ICON_MAP[section.icon] || DescriptionOutlinedIcon;

                return (
                  <FormSection
                    key={section.key}
                    title={section.title}
                    icon={SectionIcon}
                    defaultExpanded={section.defaultExpanded}
                  >
                    {section.type === "table" ? (
                      <DetailTable
                        columns={section.columns}
                        rows={section.rows}
                      />
                    ) : (
                      <FormSectionGrid
                        fields={section.fields}
                        gridSize={section.gridSize}
                      />
                    )}
                  </FormSection>
                );
              })
            )}
          </Box>
        )}

        {activeTab === detailsTabIndex && (
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
            {detailsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : (
              detailsSections.map((section) => {
                const SectionIcon =
                  SECTION_ICON_MAP[section.icon] || DescriptionOutlinedIcon;

                return (
                  <FormSection
                    key={section.key}
                    title={section.title}
                    icon={SectionIcon}
                    defaultExpanded={section.defaultExpanded}
                  >
                    <DetailTable
                      columns={section.columns}
                      rows={section.rows}
                      onView={handleViewFile}
                      onDownload={handleDownloadFile}
                    />
                  </FormSection>
                );
              })
            )}
          </Box>
        )}

        {submittedFormTabIndex !== -1 &&
          activeTab === submittedFormTabIndex && (
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
              {submittedFormLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                submittedForm && <SubmittedFormView data={submittedForm} />
              )}
            </Box>
          )}

        {slaTabIndex !== -1 && activeTab === slaTabIndex && (
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
            {slaLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <DetailTable
                columns={slaRows.length > 0 ? Object.keys(slaRows[0]) : []}
                rows={slaRows}
              />
            )}
          </Box>
        )}
        <FilePreviewModal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          file={previewFile}
          onDownload={() => {
            handleDownloadFile(previewFile);
          }}
          onViewHistory={() => console.log("view history", previewFile)}
        />
      </Box>
    </Box>
  );
}

export default RequestDetails;
