import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import DepartmentListItem from "../../../components/common/DepartmentListItem";
import Loader from "../../../components/common/Loader";

export const mapDepartment = (dept) => ({
  id: dept.departmentId,
  code: dept.departmentCode,
  name: dept.departmentName,
  description: dept.departmentDescription || "",
  superUsers: dept.superUserCount,
  users: dept.userCount,
  queues: dept.groupCount,
});

// TODO: remove once the departments API is stable; used as a fallback when the API has no response/errors
export const MOCK_DEPARTMENTS = [
  { id: 1, code: "HR", name: "Human Resources", description: "Handles all operational service requests and processes across regions.", superUsers: 3, users: 24, queues: 5 },
  { id: 2, code: "IT", name: "IT Support", description: "Handles technical support requests and infrastructure incidents.", superUsers: 4, users: 31, queues: 7 },
  { id: 3, code: "SEC", name: "Security Operations", description: "Handles security incidents and access control requests.", superUsers: 2, users: 12, queues: 3 },
  { id: 4, code: "INFRA", name: "IT Infrastructure", description: "Handles infrastructure provisioning and maintenance requests.", superUsers: 3, users: 18, queues: 4 },
];

// Data is fetched once at the page level (Rbac.jsx) so switching tabs doesn't
// re-trigger the API call — this tab just renders whatever it's handed.
const DepartmentsTab = ({ departments = [], loading = false }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary", mb: 2 }}>
        List of Departments
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <Loader size={28} />
        </Box>
      ) : departments.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No departments to display yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: departments.length === 1 ? "1fr" : "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          {departments.map((dept) => (
            <DepartmentListItem
              key={dept.id}
              name={dept.name}
              superUsers={dept.superUsers}
              users={dept.users}
              queues={dept.queues}
              onClick={() =>
                navigate(`/rbac/departments/${dept.id}`, { state: { department: dept } })
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DepartmentsTab;
