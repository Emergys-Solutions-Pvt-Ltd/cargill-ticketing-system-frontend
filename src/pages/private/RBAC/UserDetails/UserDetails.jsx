import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button, Divider } from "@mui/material";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import BackNavigation from "../../../../components/common/BackNavigation";
import CommonChip from "../../../../components/common/CommonChip";
import SectionCard from "../../../../components/SectionCard";
import UserInformationCard from "./UserInformationCard";
import AssignedQueuesCard from "./AssignedQueuesCard";
import AssignQueueModal from "./AssignQueueModal";
import SupervisorUsersTab from "./SupervisorUsersTab";
import DeactivateUserModal from "../DeactivateUserModal";
import { toggleUserStatus, getQueues } from "../../../../api/apiRequests";
import { isActiveStatus } from "../../../../utils/format";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DEFAULT_QUEUES = [
  { id: 1, name: "HR Support" },
  { id: 2, name: "HR NA Feedback" },
  { id: 3, name: "HR LA PRY Benefits" },
  { id: 4, name: "HR LA PDT Hypercare" },
  { id: 5, name: "HR EMEA Comp & Mobility" },
];

const DEFAULT_USER = {
  id: 2,
  departmentId: 1,
  name: "Alex Johnson",
  email: "alex.johnson@cargill.com",
  status: "Active",
  role: "User",
  userId: "USR-10482",
  phoneNo: "+1 (415) 555-0138",
  department: "Human Resources",
  supervisor: "John Smith",
  reportsTo: "Sarah Lee",
  workLocation: "San Francisco, CA",
  memberSince: "Jun 2024",
  usersAssigned: 18,
  queuesManaged: 4,
};

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = { ...DEFAULT_USER, ...(location.state?.user || {}) };
  const isSupervisor = (user.role || "").toLowerCase() === "supervisor";

  const [queues, setQueues] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(true);
  const [assignQueueOpen, setAssignQueueOpen] = useState(false);
  const [status, setStatus] = useState(user.status);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const isActive = isActiveStatus(status);

  useEffect(() => {
    let active = true;
    setQueuesLoading(true);
    getQueues({ userId: user.id })
      .then((response) => {
        if (!active) return;
        const records = response?.data || [];
        setQueues(
          records.length > 0
            ? records.map((record) => ({ id: record.queueId, name: record.queueName }))
            : DEFAULT_QUEUES,
        );
      })
      .catch(() => {
        if (!active) return;
        setQueues(DEFAULT_QUEUES);
      })
      .finally(() => {
        if (active) setQueuesLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleToggleStatus = () => {
    if (isActive) {
      setDeactivateOpen(true);
      return;
    }

    toggleUserStatus({ userId: user.id, isActive: true }).then(() => setStatus("Active"));
  };

  const infoFields = [
    { label: "User ID", value: user.userId },
    ...(isSupervisor ? [{ label: "Email", value: user.email }] : []),
    { label: "Phone No", value: user.phoneNo },
    { label: "Department", value: user.department },
    { label: isSupervisor ? "Reports To" : "Supervisor", value: isSupervisor ? user.reportsTo : user.supervisor },
    { label: "Work Location", value: user.workLocation },
    { label: "Member since", value: user.memberSince },
  ];

  const informationContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      <UserInformationCard fields={infoFields} />
      <AssignedQueuesCard
        queues={queues}
        loading={queuesLoading}
        onAssignQueue={() => setAssignQueueOpen(true)}
        onRemoveQueue={(queue) => setQueues((prev) => prev.filter((item) => item.id !== queue.id))}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <BackNavigation label="Back to List of Users" onClick={() => navigate(-1)} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48, fontSize: "1rem", fontWeight: 600, bgcolor: "#00843D" }}>
            {getInitials(user.name)}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "text.primary" }}>
                {user.name}
              </Typography>
              <CommonChip status={status} label={status} />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {isSupervisor ? user.role : user.email}
            </Typography>
          </Box>
        </Box>

        {isSupervisor && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonRemoveOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={handleToggleStatus}
              sx={
                isActive
                  ? {
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#E02424",
                      borderColor: "#F8B4B4",
                      "&:hover": { borderColor: "#E02424", backgroundColor: "#FDF2F2" },
                    }
                  : {
                      textTransform: "none",
                      fontWeight: 600,
                      color: "primary.main",
                      borderColor: "divider",
                    }
              }
            >
              {isActive ? "Deactivate User" : "Activate User"}
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {user.usersAssigned}
                </Box>{" "}
                Assigned Users
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ height: "12px", alignSelf: "center" }} />
              <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {String(user.queuesManaged).padStart(2, "0")}
                </Box>{" "}
                Queues Managed
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {isSupervisor ? (
        <SectionCard
          sx={{ flexGrow: 1, minHeight: 0 }}
          tabs={[
            { label: "Supervisor Information", content: informationContent },
            { label: "Users", content: <SupervisorUsersTab /> },
          ]}
        />
      ) : (
        informationContent
      )}

      <DeactivateUserModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => {
          setStatusUpdating(true);
          toggleUserStatus({ userId: user.id, isActive: false })
            .then(() => setStatus("Inactive"))
            .finally(() => {
              setStatusUpdating(false);
              setDeactivateOpen(false);
            });
        }}
        userName={user.name}
        loading={statusUpdating}
      />

      <AssignQueueModal
        open={assignQueueOpen}
        onClose={() => setAssignQueueOpen(false)}
        departmentId={user.departmentId}
        assignedQueueIds={queues.map((queue) => queue.id)}
        onAssign={(newQueues) => {
          setQueues((prev) => [...prev, ...newQueues]);
          setAssignQueueOpen(false);
        }}
      />
    </Box>
  );
};

export default UserDetails;
