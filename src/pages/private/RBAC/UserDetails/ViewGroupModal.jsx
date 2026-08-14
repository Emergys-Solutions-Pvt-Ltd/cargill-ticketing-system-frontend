import { Box, Typography, Button } from "@mui/material";
import Modal from "../../../../components/common/Modal";
import GroupsIcon from "../../../../assets/icons/groups.svg";

// TODO: replace with the real "queues in group" API once available
const MOCK_GROUP_QUEUES = [
  "HR Support",
  "HR NA Feedback",
  "HR LA PRY Benefits",
  "HR LA PDT Hypercare",
  "HR EMEA Comp & Mobility",
  "HR EMEA Comp & Mobility",
  "HR Finance APAC Reporting",
  "HR Marketing EMEA Brand",
];

const ViewGroupModal = ({ open, onClose, group }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          View Group{" "}
          <Box component="span" sx={{ fontStyle: "italic", fontWeight: 400, color: "text.secondary" }}>
            ({group?.name})
          </Box>
        </>
      }
      maxWidth="sm"
      footer={
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          Close
        </Button>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 1.5,
          maxHeight: 360,
          overflowY: "auto",
          pr: 1,
        }}
      >
        {MOCK_GROUP_QUEUES.map((queueName, index) => (
          <Box
            key={`${queueName}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.25,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box component="img" src={GroupsIcon} alt="" sx={{ width: 28, height: 28, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
              {queueName}
            </Typography>
          </Box>
        ))}
      </Box>
    </Modal>
  );
};

export default ViewGroupModal;
