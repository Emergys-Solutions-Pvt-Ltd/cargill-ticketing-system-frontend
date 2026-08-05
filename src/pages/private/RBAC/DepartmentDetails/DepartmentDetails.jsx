import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import BackNavigation from "../../../../components/common/BackNavigation";
import EntityHeaderCard from "../../../../components/common/EntityHeaderCard";
import SectionCard from "../../../../components/SectionCard";
import AdminInformationTab from "./AdminInformationTab";
import SupervisorsTab from "./SupervisorsTab";
import DepartmentUsersTab from "./DepartmentUsersTab";
import ChangeDepartmentAdminModal from "./ChangeDepartmentAdminModal";
import { getDepartmentUsers } from "../../../../api/apiRequests";
import { nameFromEmail, formatRelativeTime, formatMonthYear } from "../../../../utils/format";

const DEFAULT_DEPARTMENT = {
  name: "Human Resources",
  description: "Handles all operational service requests and processes across regions.",
  supervisors: 8,
  users: 62,
  queues: 12,
  adminInfo: {
    adminName: "John Smith",
    userId: "USR-10482",
    phoneNo: "+1 (415) 555-0138",
    email: "john.smith@cargill.com",
    workLocation: "San Francisco, CA",
    memberSince: "Jun 2024",
  },
};

const mapAdmin = (record) => ({
  adminName: record.userName || nameFromEmail(record.email),
  userId: `USR-${record.userId}`,
  phoneNo: record.phone || "Not provided",
  email: record.email,
  workLocation: record.workLocation || "Not provided",
  memberSince: formatMonthYear(record.createdAt),
});

const mapSupervisor = (record) => ({
  id: record.userId,
  name: record.userName || nameFromEmail(record.email),
  email: record.email,
  usersAssigned: record.usersAssigned ?? 0,
  queuesManaged: record.queuesManaged ?? 0,
  status: record.isActive ? "Active" : "Inactive",
  lastLogin: formatRelativeTime(record.lastLogin),
});

const mapUser = (record) => ({
  id: record.userId,
  name: record.userName || nameFromEmail(record.email),
  email: record.email,
  role: record.roleName || "User",
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

  const [adminInfo, setAdminInfo] = useState(DEFAULT_DEPARTMENT.adminInfo);
  const [supervisors, setSupervisors] = useState(null);
  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadedDepartmentId, setLoadedDepartmentId] = useState(null);
  const [changeAdminOpen, setChangeAdminOpen] = useState(false);
  if (departmentId !== loadedDepartmentId && !loadingUsers) {
    setLoadingUsers(true);
  }

  useEffect(() => {
    let active = true;
    getDepartmentUsers({ departmentId: Number(departmentId) })
      .then((response) => {
        if (!active) return;
        if (!response || !response.data) {
          setAdminInfo(DEFAULT_DEPARTMENT.adminInfo);
          setSupervisors(null);
          setUsers(null);
          return;
        }

        const records = response.data;
        const adminRecord = records.find((record) => record.roleCode === "DEPARTMENT_ADMIN");
        const supervisorRecords = records.filter((record) => record.roleCode === "SUPERVISOR");
        const userRecords = records.filter((record) => record.roleCode === "USER");

        setAdminInfo(adminRecord ? mapAdmin(adminRecord) : DEFAULT_DEPARTMENT.adminInfo);
        setSupervisors(supervisorRecords.map(mapSupervisor));
        setUsers(userRecords.map(mapUser));
      })
      .catch(() => {
        if (!active) return;
        setAdminInfo(DEFAULT_DEPARTMENT.adminInfo);
        setSupervisors(null);
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
    { label: "Admin Information", content: <AdminInformationTab adminInfo={adminInfo} /> },
    {
      label: "Supervisors",
      content: (
        <SupervisorsTab
          departmentName={department.name}
          supervisors={supervisors}
          loading={loadingUsers}
        />
      ),
    },
    { label: "Users", content: <DepartmentUsersTab users={users} loading={loadingUsers} /> },
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
        actionLabel="Change Admin"
        onAction={() => setChangeAdminOpen(true)}
        stats={[
          { label: "Supervisors", value: department.supervisors },
          { label: "Users", value: department.users },
          { label: "Queues", value: department.queues },
        ]}
      />

      <SectionCard tabs={tabs} sx={{ flexGrow: 1, minHeight: 0 }} />

      <ChangeDepartmentAdminModal
        open={changeAdminOpen}
        onClose={() => setChangeAdminOpen(false)}
        onConfirm={() => {
          // TODO: call change department admin API
          setChangeAdminOpen(false);
        }}
        currentAdmin={{
          name: adminInfo.adminName,
          email: adminInfo.email,
          role: "Department Admin",
        }}
      />
    </Box>
  );
};

export default DepartmentDetails;
