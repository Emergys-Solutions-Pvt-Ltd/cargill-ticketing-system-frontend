import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import BackNavigation from "../../../../components/common/BackNavigation";
import EntityHeaderCard from "../../../../components/common/EntityHeaderCard";
import SectionCard from "../../../../components/SectionCard";
import DepartmentGroupsTab from "./DepartmentGroupsTab";
import DepartmentUsersTab from "./DepartmentUsersTab";
import { getDepartmentUsers } from "../../../../api/apiRequests";
import { nameFromEmail, formatRelativeTime } from "../../../../utils/format";

const DEFAULT_DEPARTMENT = {
  name: "Human Resources",
  description: "Handles all operational service requests and processes across regions.",
  supervisors: 8,
  users: 62,
  queues: 12,
};

const mapUser = (record, departmentId) => ({
  id: record.userId,
  name: record.userName || nameFromEmail(record.email),
  email: record.email,
  role: record.roleName || "User",
  departmentId,
  supervisor: record.supervisorName || "Unassigned",
  queuesAssigned: record.queuesAssigned ?? 0,
  status: record.isActive ? "Active" : "Inactive",
  lastLogin: formatRelativeTime(record.lastLogin),
});

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departmentId } = useParams();

  const department = location.state?.department || DEFAULT_DEPARTMENT;

  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadedDepartmentId, setLoadedDepartmentId] = useState(null);
  if (departmentId !== loadedDepartmentId && !loadingUsers) {
    setLoadingUsers(true);
  }

  useEffect(() => {
    let active = true;
    getDepartmentUsers({ departmentId: Number(departmentId) })
      .then((response) => {
        if (!active) return;
        if (!response || !response.data) {
          setUsers(null);
          return;
        }

        const records = response.data;
        const userRecords = records.filter((record) => record.roleCode === "USER");

        const numericDepartmentId = Number(departmentId);
        setUsers(userRecords.map((record) => mapUser(record, numericDepartmentId)));
      })
      .catch(() => {
        if (!active) return;
        setUsers(null);
      })
      .finally(() => {
        if (!active) return;
        setLoadingUsers(false);
        setLoadedDepartmentId(departmentId);
      });
    return () => {
      active = false;
    };
  }, [departmentId]);

  const tabs = [
    {
      label: "Groups",
      content: (
        <DepartmentGroupsTab
          departmentId={Number(departmentId)}
          departmentName={department.name}
        />
      ),
    },
    {
      label: "Users",
      content: (
        <DepartmentUsersTab
          users={users}
          departmentId={Number(departmentId)}
          loading={loadingUsers}
        />
      ),
    },
  ];

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
      <BackNavigation label="Back to List of Departments" onClick={() => navigate("/rbac")} />

      <EntityHeaderCard
        title={department.name}
        description={department.description}
        stats={[
          { label: "Super User", value: department.supervisors },
          { label: "Users", value: department.users },
          { label: "Groups", value: department.queues },
        ]}
      />

      <SectionCard tabs={tabs} sx={{ flexGrow: 1, minHeight: 0 }} />
    </Box>
  );
};

export default DepartmentDetails;
