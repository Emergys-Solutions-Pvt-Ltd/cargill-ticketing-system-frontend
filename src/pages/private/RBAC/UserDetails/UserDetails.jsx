import { useEffect, useState } from "react";
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
import InheritedGroupsCard from "./InheritedGroupsCard";
import DirectReportsCard from "./DirectReportsCard";
import AssignGroupModal from "./AssignGroupModal";
import ViewGroupModal from "./ViewGroupModal";
import EditUserModal from "../EditUserModal";
import { buildEditUserPayload } from "../AddUserModal";
import { assignGroupToUser, getUserDetails, editUser } from "../../../../api/apiRequests";
import { formatDate } from "../../../../utils/format";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Mock fallback for get-user-details' inheritedGroups, used if the API errors/returns empty.
const DEFAULT_GROUPS = [
  { id: 1, name: "Technical Support", queueCount: 8 },
  { id: 2, name: "Escalation Team", queueCount: 15 },
  { id: 3, name: "Quality Assurance", queueCount: 5 },
  { id: 4, name: "Operations Team", queueCount: 22 },
  { id: 5, name: "Business Development", queueCount: 11 },
  { id: 6, name: "Sales Operations", queueCount: 3 },
];

// Mock fallback for get-user-details' directReports, used if the API errors/returns empty.
const DEFAULT_DIRECT_REPORTS = [
  { id: 3, name: "John Smith", email: "john.smith@cargill.com" },
  { id: 4, name: "Alex Johnson", email: "alex.johnson@cargill.com" },
  { id: 5, name: "Rahul Patel", email: "rahul.patel@cargill.com" },
  { id: 6, name: "Michael Chen", email: "michael.chen@cargill.com" },
  { id: 7, name: "Lisa Anderson", email: "lisa.anderson@cargill.com" },
  { id: 8, name: "James Wilson", email: "james.wilson@cargill.com" },
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

// Note: get-user-details' userInfo has no reportsToName field, so "Reports To" is
// intentionally left out here — it stays whatever was already carried over from the
// row that was clicked (or DEFAULT_USER's mock value).
const mapUserDetails = (info) => ({
  id: info.userId,
  userId: info.userId,
  name: info.userName,
  email: info.email,
  phoneNo: info.phoneNo,
  workLocation: info.workLocation,
  department: info.departmentName,
  departmentId: info.departmentId,
  status: info.isActive ? "Active" : "Inactive",
  role: info.roleCode === "SUPERUSER" ? "Super User" : info.roleName || "User",
  memberSince: formatDate(info.createdAt),
});

const mapInheritedGroup = (record) => ({
  id: record.groupId,
  name: record.groupName,
  queueCount: record.queuesCount ?? 0,
});

// Field names inferred from the get-users/get-department-users convention — the
// sample get-user-details response only showed an empty directReports array.
const mapDirectReport = (record) => ({
  id: record.userId,
  name: record.userName,
  email: record.email,
});

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeUser = { ...DEFAULT_USER, ...(location.state?.user || {}) };
  const [fetchedUser, setFetchedUser] = useState({});
  const user = { ...routeUser, ...fetchedUser };
  const isSuperUser = (user.role || "").toLowerCase().includes("super");
  // John Smith (id 1) is the first Super User in the mock user list — kept empty on
  // purpose to demo the "no inherited groups / no direct reports" empty states.
  const isEmptySuperUserDemo = Number(routeUser.id) === 1;

  const [groups, setGroups] = useState(isEmptySuperUserDemo ? [] : DEFAULT_GROUPS);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [directReports, setDirectReports] = useState(isEmptySuperUserDemo ? [] : DEFAULT_DIRECT_REPORTS);
  const [directReportsLoading, setDirectReportsLoading] = useState(false);
  const [assignGroupOpen, setAssignGroupOpen] = useState(false);
  const [assignGroupLoading, setAssignGroupLoading] = useState(false);
  const [viewGroup, setViewGroup] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);

  const fetchUserDetails = () => {
    setGroupsLoading(true);
    setDirectReportsLoading(true);
    return getUserDetails({ userId: Number(routeUser.id) })
      .then((response) => {
        const data = response?.data;
        if (data?.userInfo) setFetchedUser(mapUserDetails(data.userInfo));
        // Only overwrite the mock fallback when the API actually returned entries —
        // an empty/missing list keeps whatever mock state was already initialized above.
        if (data?.inheritedGroups?.length) setGroups(data.inheritedGroups.map(mapInheritedGroup));
        if (data?.directReports?.length) setDirectReports(data.directReports.map(mapDirectReport));
      })
      .catch(() => {})
      .finally(() => {
        setGroupsLoading(false);
        setDirectReportsLoading(false);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeUser.id]);

  const infoFields = [
    { label: "User ID", value: user.userId, icon: UserIdIcon },
    { label: "Phone No", value: user.phoneNo, icon: PhoneNoIcon },
    { label: "Department", value: user.department, icon: DepartmentIcon },
    ...(isSuperUser ? [] : [{ label: "Reports To", value: user.reportsTo, icon: ReportsToIcon }]),
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
        <UserInformationCard fields={infoFields} onEditInfo={() => setEditUserOpen(true)} />

        {isSuperUser ? (
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
            <InheritedGroupsCard
              groups={groups}
              loading={groupsLoading}
              onViewGroup={setViewGroup}
            />
            <DirectReportsCard reports={directReports} loading={directReportsLoading} />
          </Box>
        ) : (
          <AssignedGroupsCard
            groups={groups}
            loading={groupsLoading}
            onAssignGroup={() => setAssignGroupOpen(true)}
            onViewGroup={setViewGroup}
            onRemoveGroup={setRemoveTarget}
          />
        )}
      </Box>

      {!isSuperUser && (
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
      )}

      <ViewGroupModal
        open={Boolean(viewGroup)}
        onClose={() => setViewGroup(null)}
        group={viewGroup}
      />

      <EditUserModal
        open={editUserOpen}
        user={user}
        loading={editUserLoading}
        onClose={() => setEditUserOpen(false)}
        onSubmit={(form) => {
          setEditUserLoading(true);
          editUser(buildEditUserPayload(form, user.id))
            .then(() => {
              setEditUserOpen(false);
              return fetchUserDetails();
            })
            .catch(() => {})
            .finally(() => setEditUserLoading(false));
        }}
      />

      {!isSuperUser && (
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
      )}
    </Box>
  );
};

export default UserDetails;
