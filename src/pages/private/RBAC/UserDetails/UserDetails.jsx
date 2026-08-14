import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import UserIdIcon from "../../../../assets/icons/userId.svg";
import PhoneNoIcon from "../../../../assets/icons/phoneNo.svg";
import DepartmentIcon from "../../../../assets/icons/department.svg";
import ReportsToIcon from "../../../../assets/icons/reportsTo.svg";
import LocationIcon from "../../../../assets/icons/location.svg";
import MemberSinceIcon from "../../../../assets/icons/memberSince.svg";
import BackNavigation from "../../../../components/common/BackNavigation";
import CommonChip from "../../../../components/common/CommonChip";
import UserInformationCard from "./UserInformationCard";
import AssignedGroupsCard from "./AssignedGroupsCard";
import AssignGroupModal from "./AssignGroupModal";
import { getQueues } from "../../../../api/apiRequests";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DEFAULT_GROUPS = [
  { id: 1, name: "Technical Support", queueCount: 8 },
  { id: 2, name: "Escalation Team", queueCount: 15 },
  { id: 3, name: "Quality Assurance", queueCount: 5 },
  { id: 4, name: "Operations Team", queueCount: 22 },
  { id: 5, name: "Business Development", queueCount: 11 },
  { id: 6, name: "Sales Operations", queueCount: 3 },
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
  reportsTo: "John Smith",
  workLocation: "San Francisco, CA",
  memberSince: "12 Jun 2024",
};

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = { ...DEFAULT_USER, ...(location.state?.user || {}) };

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [assignGroupOpen, setAssignGroupOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setGroupsLoading(true);
    getQueues({ userId: user.id })
      .then((response) => {
        if (!active) return;
        const records = response?.data || [];
        setGroups(
          records.length > 0
            ? records.map((record) => ({
                id: record.queueId,
                name: record.queueName,
                queueCount: record.queueCount ?? 0,
              }))
            : DEFAULT_GROUPS,
        );
      })
      .catch(() => {
        if (!active) return;
        setGroups(DEFAULT_GROUPS);
      })
      .finally(() => {
        if (active) setGroupsLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const infoFields = [
    { label: "User ID", value: user.userId, icon: UserIdIcon },
    { label: "Phone No", value: user.phoneNo, icon: PhoneNoIcon },
    { label: "Department", value: user.department, icon: DepartmentIcon },
    { label: "Reports To", value: user.reportsTo, icon: ReportsToIcon },
    { label: "Location", value: user.workLocation, icon: LocationIcon },
    { label: "Member since", value: user.memberSince, icon: MemberSinceIcon },
  ];

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
          gap: 2,
          p: 2,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
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
            Role: {user.role} | Email: {user.email}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <UserInformationCard fields={infoFields} />
        <AssignedGroupsCard
          groups={groups}
          loading={groupsLoading}
          onAssignGroup={() => setAssignGroupOpen(true)}
        />
      </Box>

      <AssignGroupModal
        open={assignGroupOpen}
        onClose={() => setAssignGroupOpen(false)}
        departmentId={user.departmentId}
        assignedGroupIds={groups.map((group) => group.id)}
        onAssign={(newGroups) => {
          setGroups((prev) => [...prev, ...newGroups]);
          setAssignGroupOpen(false);
        }}
      />
    </Box>
  );
};

export default UserDetails;
