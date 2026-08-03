import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BackNavigation from "../../../components/common/BackNavigation";
import EntityHeaderCard from "../../../components/common/EntityHeaderCard";
import SectionCard from "../../../components/SectionCard";

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

const AdminInformation = ({ adminInfo }) => {
  const fields = [
    { label: "Admin Name", value: adminInfo.adminName },
    { label: "User ID", value: adminInfo.userId },
    { label: "Phone No", value: adminInfo.phoneNo },
    { label: "Email", value: adminInfo.email },
    { label: "Work Location", value: adminInfo.workLocation },
    { label: "Member since", value: adminInfo.memberSince },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          User Information
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", cursor: "pointer" }}>
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Edit Info
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          rowGap: 3,
          columnGap: 4,
        }}
      >
        {fields.map((field) => (
          <Box key={field.label}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5 }}>
              {field.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const PlaceholderTab = ({ message }) => (
  <Typography variant="body2" sx={{ color: "text.secondary" }}>
    {message}
  </Typography>
);

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: fetch department by :departmentId
  const department = location.state?.department || DEFAULT_DEPARTMENT;
  const adminInfo = department.adminInfo || DEFAULT_DEPARTMENT.adminInfo;

  const tabs = [
    { label: "Admin Information", content: <AdminInformation adminInfo={adminInfo} /> },
    { label: "Supervisors", content: <PlaceholderTab message="No supervisors to display yet." /> },
    { label: "Users", content: <PlaceholderTab message="No users to display yet." /> },
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
        onAction={() => {
          // TODO: add change admin flow
        }}
        stats={[
          { label: "Supervisors", value: department.supervisors },
          { label: "Users", value: department.users },
          { label: "Queues", value: department.queues },
        ]}
      />

      <SectionCard tabs={tabs} sx={{ flexGrow: 1, minHeight: 0 }} />
    </Box>
  );
};

export default DepartmentDetails;
