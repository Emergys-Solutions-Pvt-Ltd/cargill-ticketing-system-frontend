import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UserIdIcon from "../../../../assets/icons/userId.svg";
import PhoneNoIcon from "../../../../assets/icons/phoneNo.svg";
import DepartmentIcon from "../../../../assets/icons/department.svg";
import ReportsToIcon from "../../../../assets/icons/reportsTo.svg";
import LocationIcon from "../../../../assets/icons/location.svg";
import MemberSinceIcon from "../../../../assets/icons/memberSince.svg";
import BackNavigation from "../../../../components/common/BackNavigation";
import CommonChip from "../../../../components/common/CommonChip";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import UserInformationCard from "./UserInformationCard";
import AssignedGroupsCard from "./AssignedGroupsCard";
import AssignGroupModal from "./AssignGroupModal";
import ViewGroupModal from "./ViewGroupModal";
import { assignGroupToUser } from "../../../../api/apiRequests";

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

  // TODO: wire up the real "groups assigned to user" API once available.
  // get-queues only supports { groupId } / { departmentId } filters, not { userId },
  // so this stays on mock data for now rather than firing an invalid request.
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [groupsLoading] = useState(false);
  const [assignGroupOpen, setAssignGroupOpen] = useState(false);
  const [assignGroupLoading, setAssignGroupLoading] = useState(false);
  const [viewGroup, setViewGroup] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

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
          onViewGroup={setViewGroup}
          onRemoveGroup={setRemoveTarget}
        />
      </Box>

      <AssignGroupModal
        open={assignGroupOpen}
        onClose={() => setAssignGroupOpen(false)}
        departmentId={user.departmentId}
        assignedGroupIds={groups.map((group) => group.id)}
        loading={assignGroupLoading}
        onAssign={(newGroups) => {
          setAssignGroupLoading(true);
          assignGroupToUser({
            userId: Number(user.id),
            groupIds: newGroups.map((group) => Number(group.id)),
          })
            .then(() => {
              setGroups((prev) => [...prev, ...newGroups]);
              setAssignGroupOpen(false);
            })
            .catch(() => {})
            .finally(() => setAssignGroupLoading(false));
        }}
      />

      <ViewGroupModal
        open={Boolean(viewGroup)}
        onClose={() => setViewGroup(null)}
        group={viewGroup}
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          // TODO: call remove group API
          setGroups((prev) => prev.filter((group) => group.id !== removeTarget.id));
          setRemoveTarget(null);
        }}
        icon={DeleteOutlineIcon}
        title="Are you sure?"
        message={
          <>
            Do you really want to remove the group "<strong>{removeTarget?.name}</strong>" for this user?
          </>
        }
        confirmLabel="Remove"
        confirmColor="danger"
      />
    </Box>
  );
};

export default UserDetails;
