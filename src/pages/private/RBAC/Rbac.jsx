import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SectionCard from "../../../components/SectionCard";
import DepartmentsTab, { mapDepartment, MOCK_DEPARTMENTS } from "./DepartmentsTab";
import UsersTab, { mapUser, MOCK_USERS } from "./UsersTab";
import GroupsTab, { mapGroup, MOCK_GROUPS } from "./GroupsTab";
import { getDepartments, getUsers, getGroups } from "../../../api/apiRequests";

const Rbac = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [groups, setGroups] = useState(null);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const fetchDepartments = () => {
    setDepartmentsLoading(true);
    return getDepartments()
      .then((response) => {
        setDepartments(response?.data?.length ? response.data.map(mapDepartment) : MOCK_DEPARTMENTS);
      })
      .catch(() => {
        setDepartments(MOCK_DEPARTMENTS);
      })
      .finally(() => {
        setDepartmentsLoading(false);
      });
  };

  const fetchUsers = () => {
    setUsersLoading(true);
    return getUsers()
      .then((response) => {
        setUsers(response?.data?.users ? response.data.users.map(mapUser) : null);
      })
      .catch(() => {
        setUsers(null);
      })
      .finally(() => {
        setUsersLoading(false);
      });
  };

  const fetchGroups = () => {
    setGroupsLoading(true);
    return getGroups()
      .then((response) => {
        setGroups(response?.data?.groups?.length ? response.data.groups.map(mapGroup) : null);
      })
      .catch(() => {
        setGroups(null);
      })
      .finally(() => {
        setGroupsLoading(false);
      });
  };

  // Fetched once at the page level, independent of which tab is active, so
  // switching between Departments/Users/Groups no longer re-triggers these calls.
  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    {
      key: "departments",
      label: "Departments",
      content: <DepartmentsTab departments={departments} loading={departmentsLoading} />,
    },
    {
      key: "users",
      label: "Users",
      content: <UsersTab users={users} loading={usersLoading} onUsersChanged={fetchUsers} />,
    },
    {
      key: "groups",
      label: "Groups",
      content: <GroupsTab groups={groups} loading={groupsLoading} onGroupsChanged={fetchGroups} />,
    },
  ];

  const activeIndex = Math.max(
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
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}>
          Access Control
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 400, fontSize: "13px" }}
        >
          Manage user access rights and role-based permissions policies.
        </Typography>
      </Box>

      <SectionCard
        tabs={tabs}
        value={activeIndex}
        onChange={handleTabChange}
        sx={{ flexGrow: 1, minHeight: 0 }}
      />
    </Box>
  );
};

export default Rbac;
