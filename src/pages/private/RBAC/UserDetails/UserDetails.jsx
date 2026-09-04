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
import AssignQueueModal from "./AssignQueueModal";
import AddQueueToGroupModal from "./AddQueueToGroupModal";
import ViewGroupModal from "./ViewGroupModal";
import EditUserModal from "../EditUserModal";
import { buildEditUserPayload } from "../AddUserModal";
import {
  assignGroupToUser,
  removeGroupsFromUser,
  addQueuesToGroup,
  assignQueuesToUser,
  getUserDetails,
  editUser,
} from "../../../../api/apiRequests";
import { formatDate } from "../../../../utils/format";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
  reportsToUserId: 3,
  workLocation: "San Francisco, CA",
  memberSince: "12 Jun 2024",
};

// Note: get-user-details' userInfo has no reportsToName field, so "Reports To" is
// intentionally left out here — it stays whatever was already carried over from the
// row that was clicked (or DEFAULT_USER's mock value). reportsToUserId, if returned,
// is mapped since it drives AssignQueueModal's group-fetch step.
const mapUserDetails = (info) => ({
  id: info.userId,
  userId: info.userId,
  name: info.userName,
  email: info.email,
  phoneNo: info.phoneNo,
  workLocation: info.workLocation,
  department: info.departmentName,
  departmentId: info.departmentId,
  reportsToUserId: info.reportsToUserId,
  status: info.isActive ? "Active" : "Inactive",
  role: info.roleCode === "SUPERUSER" ? "Super User" : info.roleName || "User",
  memberSince: formatDate(info.createdAt),
});

const mapInheritedGroup = (record) => ({
  id: record.groupId,
  name: record.groupName,
  queueCount: record.queuesCount ?? 0,
});

const mapQueue = (record) => ({
  id: record.queueId,
  name: record.queueName,
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

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [normalUserGroups, setNormalUserGroups] = useState([]);
  const [normalUserGroupsLoading, setNormalUserGroupsLoading] = useState(false);
  const [queues, setQueues] = useState([]);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [directReports, setDirectReports] = useState([]);
  const [directReportsLoading, setDirectReportsLoading] = useState(false);

  const [assignGroupOpen, setAssignGroupOpen] = useState(false);
  const [assignGroupLoading, setAssignGroupLoading] = useState(false);
  const [assignQueueOpen, setAssignQueueOpen] = useState(false);
  const [assignQueueLoading, setAssignQueueLoading] = useState(false);

  const [viewGroup, setViewGroup] = useState(null);
  const [removeGroupTarget, setRemoveGroupTarget] = useState(null);
  const [removeGroupLoading, setRemoveGroupLoading] = useState(false);
  const [removeQueueTarget, setRemoveQueueTarget] = useState(null);
  const [removeQueueLoading, setRemoveQueueLoading] = useState(false);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [addQueueToGroupTarget, setAddQueueToGroupTarget] = useState(null);
  const [addQueueToGroupLoading, setAddQueueToGroupLoading] = useState(false);

  const fetchUserDetails = async () => {
    setGroupsLoading(true);
    setQueuesLoading(true);
    setDirectReportsLoading(true);

    try {
      const response = await getUserDetails({ userId: Number(routeUser.id) });
      const data = response?.data;

      if (data?.userInfo) setFetchedUser(mapUserDetails(data.userInfo));
      setGroups(data?.groups?.length ? data.groups.map(mapInheritedGroup) : []);
      setNormalUserGroups(
        data?.groups?.length ? data.groups.map(mapInheritedGroup) : [],
      );
      setQueues(data?.queues?.length ? data.queues.map(mapQueue) : []);
      setDirectReports(
        data?.directReports?.length
          ? data.directReports.map(mapDirectReport)
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setGroups([]);
      setNormalUserGroups([]);
      setQueues([]);
      setDirectReports([]);
    } finally {
      setGroupsLoading(false);
      setQueuesLoading(false);
      setDirectReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeUser.id]);

  const infoFields = [
    { label: "User ID", value: user.userId, icon: UserIdIcon },
    { label: "Phone No", value: user.phoneNo, icon: PhoneNoIcon },
    { label: "Department", value: user.department, icon: DepartmentIcon },
    ...(isSuperUser
      ? []
      : [{ label: "Reports To", value: user.reportsTo, icon: ReportsToIcon }]),
    { label: "Location", value: user.workLocation, icon: LocationIcon },
    { label: "Member since", value: user.memberSince, icon: MemberSinceIcon },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: { xs: 2, md: 4 },
        }}
      >
        <BackNavigation
          label="Back to List of Users"
          onClick={() => navigate(-1)}
        />

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
          <Avatar
            sx={{
              width: 48,
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
              bgcolor: "#00843D",
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "text.primary",
                }}
              >
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
          }}
        >
          <UserInformationCard
            fields={infoFields}
            onEditInfo={() => setEditUserOpen(true)}
          />

          {isSuperUser ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <InheritedGroupsCard
                groups={groups}
                loading={groupsLoading}
                onViewGroup={setViewGroup}
                onAssignGroup={() => setAssignGroupOpen(true)}
              />
              <DirectReportsCard
                reports={directReports}
                loading={directReportsLoading}
              />
            </Box>
          ) : (
            <AssignedGroupsCard
              groups={normalUserGroups}
              loading={normalUserGroupsLoading}
              onViewGroup={setViewGroup}
              onRemoveGroup={setRemoveGroupTarget}
              onAddQueueToGroup={setAddQueueToGroupTarget}
            />
          )}
        </Box>
      </Box>

      <AssignGroupModal
        open={assignGroupOpen}
        onClose={() => setAssignGroupOpen(false)}
        departmentId={user.departmentId}
        assignedGroupIds={
          isSuperUser
            ? groups.map((g) => g.id)
            : normalUserGroups.map((g) => g.id)
        }
        loading={assignGroupLoading}
        onAssign={async (newGroups) => {
          setAssignGroupLoading(true);
          try {
            await assignGroupToUser({
              userId: Number(user.id),
              groupIds: newGroups.map((g) => Number(g.id)),
            });
            if (isSuperUser) {
              setGroups((prev) => [...prev, ...newGroups]);
            } else {
              setNormalUserGroups((prev) => [...prev, ...newGroups]);
            }
            setAssignGroupOpen(false);
          } catch (error) {
            console.error("Failed to assign group:", error);
          } finally {
            setAssignGroupLoading(false);
          }
        }}
      />

      

      <AddQueueToGroupModal
        open={Boolean(addQueueToGroupTarget)}
        onClose={() => setAddQueueToGroupTarget(null)}
        group={addQueueToGroupTarget}
        userId={Number(user.id)}
        loading={addQueueToGroupLoading}
        onAssign={async (selectedQueues) => {
          setAddQueueToGroupLoading(true);

          try {
            await assignQueuesToUser({
              userId: Number(user.id),
              queueIds: selectedQueues.map((q) => Number(q.id)),
            });

            await fetchUserDetails();
            setAddQueueToGroupTarget(null);
          } catch (error) {
            console.error("Failed to assign queue to user:", error);
          } finally {
            setAddQueueToGroupLoading(false);
          }
        }}
      />

      {!isSuperUser && (
        <AssignQueueModal
          open={assignQueueOpen}
          onClose={() => setAssignQueueOpen(false)}
          superUserId={user.reportsToUserId}
          assignedQueueIds={queues.map((queue) => queue.id)}
          loading={assignQueueLoading}
          onAssign={async (newQueues) => {
            setAssignQueueLoading(true);
            try {
              await assignQueuesToUser({
                userId: Number(user.id),
                queueIds: newQueues.map((queue) => Number(queue.id)),
              });
              setQueues((prev) => [...prev, ...newQueues]);
              setAssignQueueOpen(false);
            } catch (error) {
              console.error("Failed to assign queue:", error);
            } finally {
              setAssignQueueLoading(false);
            }
          }}
        />
      )}

      <ViewGroupModal
        open={Boolean(viewGroup)}
        onClose={() => setViewGroup(null)}
        group={viewGroup}
        userId={Number(user.id)}
        onRemoveQueue={(queue) => {
          // Sync parent queues state after successful removal
          setQueues((prev) => prev.filter((q) => q.id !== queue.id));
        }}
      />

      <EditUserModal
        open={editUserOpen}
        user={user}
        loading={editUserLoading}
        onClose={() => setEditUserOpen(false)}
        onSubmit={async (form) => {
          setEditUserLoading(true);
          try {
            await editUser(buildEditUserPayload(form, user.id));
            setEditUserOpen(false);
            await fetchUserDetails();
          } catch (error) {
            console.error("Failed to edit user:", error);
          } finally {
            setEditUserLoading(false);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(removeGroupTarget)}
        onClose={() => setRemoveGroupTarget(null)}
        onConfirm={async () => {
          setRemoveGroupLoading(true);
          try {
            await removeGroupsFromUser({
              userId: Number(user.id),
              groupIds: [Number(removeGroupTarget.id)],
            });
            if (isSuperUser) {
              setGroups((prev) =>
                prev.filter((g) => g.id !== removeGroupTarget.id),
              );
            } else {
              setNormalUserGroups((prev) =>
                prev.filter((g) => g.id !== removeGroupTarget.id),
              );
            }
            setRemoveGroupTarget(null);
          } catch (error) {
            console.error("Failed to remove group:", error);
          } finally {
            setRemoveGroupLoading(false);
          }
        }}
        icon={DeleteOutlineIcon}
        title="Are you sure?"
        message={
          <>
            Do you really want to remove the group "
            <strong>{removeGroupTarget?.name}</strong>" for this user?
          </>
        }
        confirmLabel="Remove"
        confirmColor="danger"
        confirmLoading={removeGroupLoading}
      />

      {!isSuperUser && (
        <ConfirmDialog
          open={Boolean(removeQueueTarget)}
          onClose={() => setRemoveQueueTarget(null)}
          onConfirm={async () => {
            setRemoveQueueLoading(true);
            try {
              await removeQueuesFromUser({
                userId: Number(user.id),
                queueIds: [Number(removeQueueTarget.id)],
              });
              setQueues((prev) =>
                prev.filter((queue) => queue.id !== removeQueueTarget.id),
              );
              setRemoveQueueTarget(null);
            } catch (error) {
              console.error("Failed to remove queue:", error);
            } finally {
              setRemoveQueueLoading(false);
            }
          }}
          icon={DeleteOutlineIcon}
          title="Are you sure?"
          message={
            <>
              Do you really want to remove the queue "
              <strong>{removeQueueTarget?.name}</strong>" for this user?
            </>
          }
          confirmLabel="Remove"
          confirmColor="danger"
          confirmLoading={removeQueueLoading}
        />
      )}
    </Box>
  );
};

export default UserDetails;
