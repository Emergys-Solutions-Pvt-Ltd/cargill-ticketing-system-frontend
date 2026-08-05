import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button, Divider } from "@mui/material";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import BackNavigation from "../../../../components/common/BackNavigation";
import CommonChip from "../../../../components/common/CommonChip";
import SectionCard from "../../../../components/SectionCard";
import UserInformationCard from "./UserInformationCard";
import AssignedQueuesCard from "./AssignedQueuesCard";
import SupervisorUsersTab from "./SupervisorUsersTab";
import DeactivateUserModal from "../DeactivateUserModal";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DEFAULT_USER = {
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
  queues: [
    "HR Support",
    "HR NA Feedback",
    "HR LA PRY Benefits",
    "HR LA PDT Hypercare",
    "HR EMEA Comp & Mobility",
  ],
};

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = { ...DEFAULT_USER, ...(location.state?.user || {}) };
  const isSupervisor = (user.role || "").toLowerCase() === "supervisor";

  const [queues, setQueues] = useState(user.queues || []);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

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
        onAssignQueue={() => {
          // TODO: open assign queue flow
        }}
        onRemoveQueue={(queue) => setQueues((prev) => prev.filter((item) => item !== queue))}
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
              <CommonChip status={user.status} label={user.status} />
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
              onClick={() => setDeactivateOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#E02424",
                borderColor: "#F8B4B4",
                "&:hover": { borderColor: "#E02424", backgroundColor: "#FDF2F2" },
              }}
            >
              Deactivate User
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
          // TODO: call deactivate user API
          setDeactivateOpen(false);
        }}
        userName={user.name}
      />
    </Box>
  );
};

export default UserDetails;
