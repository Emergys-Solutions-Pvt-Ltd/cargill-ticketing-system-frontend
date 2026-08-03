import { Box, Typography } from "@mui/material";
import SectionCard from "../../../components/SectionCard";
import DepartmentsTab from "./DepartmentsTab";
import UsersTab from "./UsersTab";

const tabs = [
  { label: "Departments", content: <DepartmentsTab /> },
  { label: "Users", content: <UsersTab /> },
];

const Rbac = () => {
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

      <SectionCard tabs={tabs} sx={{ flexGrow: 1, minHeight: 0 }} />
    </Box>
  );
};

export default Rbac;
