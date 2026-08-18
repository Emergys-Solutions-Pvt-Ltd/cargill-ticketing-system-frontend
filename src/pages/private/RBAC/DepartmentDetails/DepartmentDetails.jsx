import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import BackNavigation from "../../../../components/common/BackNavigation";
import EntityHeaderCard from "../../../../components/common/EntityHeaderCard";
import SectionCard from "../../../../components/SectionCard";
import DepartmentGroupsTab, { mapGroup } from "./DepartmentGroupsTab";
import DepartmentUsersTab from "./DepartmentUsersTab";
import { getUsers, getGroups } from "../../../../api/apiRequests";
import { nameFromEmail, formatRelativeTime } from "../../../../utils/format";

const DEFAULT_DEPARTMENT = {
  name: "Human Resources",
  description: "Handles all operational service requests and processes across regions.",
  superUsers: 8,
  users: 62,
  queues: 12,
};

const mapUser = (record, departmentId) => ({
  id: record.userId,
  name: record.userName || nameFromEmail(record.email),
  email: record.email,
  role: record.roleCode === "SUPERUSER" ? "Super User" : record.roleName || "User",
  departmentId,
  reportsTo: record.reportsToName || "Unassigned",
  groupsAssigned: record.groupsAssigned ?? 0,
  status: record.isActive ? "Active" : "Inactive",
  lastLogin: formatRelativeTime(record.lastLogin),
});

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departmentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [department, setDepartment] = useState(location.state?.department || DEFAULT_DEPARTMENT);

  useEffect(() => {
    if (location.state?.department) {
      setDepartment(location.state.department);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, location.state?.department]);

  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadedDepartmentId, setLoadedDepartmentId] = useState(null);
  if (departmentId !== loadedDepartmentId && !loadingUsers) {
    setLoadingUsers(true);
  }

  const fetchUsers = () => {
    setLoadingUsers(true);
    return getUsers({ departmentId: Number(departmentId) })
      .then((response) => {
        if (!response?.data?.users) {
          setUsers(null);
          return;
        }

        const userRecords = response.data.users.filter((record) => record.roleCode === "USER");

        const numericDepartmentId = Number(departmentId);
        setUsers(userRecords.map((record) => mapUser(record, numericDepartmentId)));
      })
      .catch(() => {
        setUsers(null);
      })
      .finally(() => {
        setLoadingUsers(false);
        setLoadedDepartmentId(departmentId);
      });
  };

  const [groups, setGroups] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const fetchGroups = () => {
    setLoadingGroups(true);
    return getGroups({ departmentId: Number(departmentId) })
      .then((response) => {
        setGroups(response?.data?.groups?.length ? response.data.groups.map(mapGroup) : null);
      })
      .catch(() => {
        setGroups(null);
      })
      .finally(() => {
        setLoadingGroups(false);
      });
  };

  // Both sub-tabs' data is fetched once per department at this page level, so
  // switching between the Groups/Users sub-tabs doesn't re-trigger either call.
  useEffect(() => {
    fetchUsers();
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  const tabs = [
    {
      key: "groups",
      label: "Groups",
      content: (
        <DepartmentGroupsTab
          departmentId={Number(departmentId)}
          departmentName={department.name}
          groups={groups}
          loading={loadingGroups}
          onGroupsChanged={fetchGroups}
        />
      ),
    },
    {
      key: "users",
      label: "Users",
      content: (
        <DepartmentUsersTab
          users={users}
          departmentId={Number(departmentId)}
          departmentName={department.name}
          loading={loadingUsers}
          onUserAdded={fetchUsers}
        />
      ),
    },
  ];

  const activeTabIndex = Math.max(
    tabs.findIndex((tab) => tab.key === searchParams.get("tab")),
    0,
  );

  const handleTabChange = (index) => {
    setSearchParams({ tab: tabs[index].key }, { replace: true });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <BackNavigation label="Back to List of Departments" onClick={() => navigate(-1)} />

      <EntityHeaderCard
        title={department.name}
        description={department.description}
        stats={[
          { label: "Super User", value: department.superUsers },
          { label: "Users", value: department.users },
          { label: "Groups", value: department.queues },
        ]}
      />

      <SectionCard
        tabs={tabs}
        value={activeTabIndex}
        onChange={handleTabChange}
        sx={{ flexGrow: 1, minHeight: 0 }}
      />
    </Box>
  );
};

export default DepartmentDetails;
