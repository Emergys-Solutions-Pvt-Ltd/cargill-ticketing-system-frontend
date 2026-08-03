import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import DepartmentListItem from "../../../components/common/DepartmentListItem";
import { getDepartments } from "../../../api/apiRequests";

const mapDepartment = (dept) => ({
  id: dept.departmentId,
  name: dept.departmentName,
  supervisors: dept.supervisorCount,
  users: dept.userCount,
  queues: dept.queueCount,
  adminName: dept.departmentAdminName || "Unassigned",
});

// TODO: remove once the departments API is stable; used as a fallback when the API has no response/errors
const MOCK_DEPARTMENTS = [
  { id: 1, name: "Human Resources", supervisors: 3, users: 24, queues: 5, adminName: "John Smith" },
  { id: 2, name: "IT Support", supervisors: 4, users: 31, queues: 7, adminName: "Alex Johnson" },
  { id: 3, name: "Security Operations", supervisors: 2, users: 12, queues: 3, adminName: "Priya Sharma" },
  { id: 4, name: "IT Infrastructure", supervisors: 3, users: 18, queues: 4, adminName: "Michael Chen" },
];

const DepartmentsTab = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDepartments({
      departmentId: 3,
    })
      .then((response) => {
        if (!active) return;
        if (!response || !response.data) {
          setDepartments(MOCK_DEPARTMENTS);
        } else {
          setDepartments(response.data.map(mapDepartment));
        }
      })
      .catch(() => {
        if (!active) return;
        setDepartments(MOCK_DEPARTMENTS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary", mb: 2 }}>
        List of Departments
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : departments.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No departments to display yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {departments.map((dept) => (
            <DepartmentListItem
              key={dept.id}
              name={dept.name}
              supervisors={dept.supervisors}
              users={dept.users}
              queues={dept.queues}
              adminName={dept.adminName}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DepartmentsTab;
