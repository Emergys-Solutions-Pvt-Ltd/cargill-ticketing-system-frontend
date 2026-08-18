import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SectionCard from "../../../components/SectionCard";
import DepartmentsTab from "./DepartmentsTab";
import UsersTab from "./UsersTab";
import GroupsTab from "./GroupsTab";

const tabs = [
  { key: "departments", label: "Departments", content: <DepartmentsTab /> },
  { key: "users", label: "Users", content: <UsersTab /> },
  { key: "groups", label: "Groups", content: <GroupsTab /> },
];

const Rbac = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
