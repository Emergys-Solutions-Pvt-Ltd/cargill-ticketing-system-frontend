import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "../../../assets/icons/edit.svg";
import CommonTable from "../../../components/common/CommonTable";
import AddButton from "../../../components/common/AddButton";
import SearchIcon from "../../../assets/icons/search.svg";
import CreateGroupModal, { buildCreateGroupPayload } from "./CreateGroupModal";
import EditGroupModal, { buildEditGroupPayload } from "./EditGroupModal";
import { addGroup, editGroup } from "../../../api/apiRequests";

const AVATAR_COLORS = [
  { bgcolor: "#E0F2FE", color: "#0369A1" },
  { bgcolor: "#EDE9FE", color: "#6D28D9" },
  { bgcolor: "#FFEDD5", color: "#C2410C" },
  { bgcolor: "#CFFAFE", color: "#0E7490" },
  { bgcolor: "#FEE2E2", color: "#DC2626" },
  { bgcolor: "#FCE7F3", color: "#BE185D" },
  { bgcolor: "#DBEAFE", color: "#1D4ED8" },
  { bgcolor: "#DCFCE7", color: "#15803D" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const truncateCellSx = {
  maxWidth: 320,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const GROUP_TEMPLATES = [
  { name: "Technical Support", description: "Handles general customer inquiries and first-level issue resolution.", department: "Human Resources", queues: 5, assignedUsers: 18 },
  { name: "Escalation Team", description: "Provides technical troubleshooting and advanced issue resolution.", department: "Human Resources", queues: 4, assignedUsers: 12 },
  { name: "Quality Assurance", description: "Manages complex cases escalated from support teams.", department: "Human Resources", queues: 2, assignedUsers: 10 },
  { name: "Operations Team", description: "Reviews service quality and ensures compliance with operational standards.", department: "Human Resources", queues: 2, assignedUsers: 8 },
  { name: "Business Development", description: "Oversees daily operational processes and workflow execution.", department: "Human Resources", queues: 3, assignedUsers: 7 },
  { name: "Sales Operations", description: "Identifies new business opportunities and manages strategic partnerships.", department: "Human Resources", queues: 1, assignedUsers: 3 },
  { name: "Product Management", description: "Leads product strategy, roadmap, and cross-functional coordination.", department: "Human Resources", queues: 3, assignedUsers: 9 },
  { name: "Customer Success", description: "Focuses on customer retention and maximizing product value for clients.", department: "Human Resources", queues: 4, assignedUsers: 11 },
];

export const MOCK_GROUPS = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  ...GROUP_TEMPLATES[index % GROUP_TEMPLATES.length],
}));

export const mapGroup = (record) => ({
  id: record.groupId,
  name: record.groupName,
  description: record.groupDescription || "",
  department: record.departmentName || "Unassigned",
  departmentId: record.departmentId,
  queues: record.queuesAssigned ?? 0,
  assignedUsers: record.usersAssigned ?? 0,
});

// Data is fetched once at the page level (Rbac.jsx) so switching tabs doesn't
// re-trigger the API call. `onGroupsChanged` re-runs that page-level fetch after a
// mutation (create/edit group) succeeds here.
const GroupsTab = ({ groups = null, loading = false, onGroupsChanged }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editGroupLoading, setEditGroupLoading] = useState(false);

  const groupRows = groups ?? MOCK_GROUPS;

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groupRows;
    return groupRows.filter((group) => group.name.toLowerCase().includes(query));
  }, [search, groupRows]);

  const paginatedGroups = filteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "GROUP NAME",
        render: (value, row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.75rem",
                fontWeight: 600,
                ...AVATAR_COLORS[row.id % AVATAR_COLORS.length],
              }}
            >
              {getInitials(value)}
            </Avatar>
            <Typography variant="body2" sx={{ color: "#1C64F2", fontWeight: 500 }}>
              {value}
            </Typography>
          </Box>
        ),
      },
      {
        key: "description",
        label: "DESCRIPTION",
        cellSx: truncateCellSx,
      },
      { key: "department", label: "DEPARTMENT" },
      { key: "queues", label: "QUEUES", sortable: false },
      { key: "assignedUsers", label: "ASSIGNED TO USERS", sortable: false },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.primary" }}>
          Groups ({filteredGroups.length})
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder="Search group..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: "260px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "2.125rem",
              },
              backgroundColor: "background.paper",
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="" width={16} height={16} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <AddButton onClick={() => setCreateGroupOpen(true)}>New Group</AddButton>
        </Box>
      </Box>

      <CommonTable
        sx={{ flexGrow: 1, minHeight: 0 }}
        columns={columns}
        rows={paginatedGroups}
        onRowClick={(row) => navigate(`/rbac/groups/${row.id}`, { state: { group: row } })}
        loading={loading}
        sortable
        emptyMessage="No groups to display yet."
        ariaLabel="Groups list"
        actions={(row) => (
          <IconButton
            size="small"
            onClick={() => setEditTarget(row)}
            aria-label="Edit group"
          >
            <img src={EditIcon} alt="" width={16} height={16} />
          </IconButton>
        )}
        pagination={{
          count: filteredGroups.length,
          page,
          onPageChange: setPage,
          rowsPerPage,
          onRowsPerPageChange: (value) => {
            setRowsPerPage(value);
            setPage(0);
          },
        }}
      />

      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        loading={createGroupLoading}
        existingGroupNames={groupRows.map((group) => group.name)}
        onSubmit={(form) => {
          setCreateGroupLoading(true);
          addGroup(buildCreateGroupPayload(form))
            .then(() => {
              setCreateGroupOpen(false);
              return onGroupsChanged?.();
            })
            .catch(() => {})
            .finally(() => setCreateGroupLoading(false));
        }}
      />

      <EditGroupModal
        open={Boolean(editTarget)}
        group={editTarget}
        loading={editGroupLoading}
        onClose={() => setEditTarget(null)}
        existingGroupNames={groupRows.filter((group) => group.id !== editTarget?.id).map(
          (group) => group.name,
        )}
        onSubmit={(form) => {
          setEditGroupLoading(true);
          editGroup(buildEditGroupPayload(form, editTarget.id))
            .then(() => {
              setEditTarget(null);
              return onGroupsChanged?.();
            })
            .catch(() => {})
            .finally(() => setEditGroupLoading(false));
        }}
      />
    </Box>
  );
};

export default GroupsTab;
