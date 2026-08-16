import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";

const DeleteQueueModal = ({ open, onClose, onConfirm, queueName, loading = false }) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={DeleteOutlineIcon}
      title="Are you sure?"
      message={
        <>
          Do you really want to delete this queue "<strong>{queueName}</strong>"?
        </>
      }
      confirmLabel="Delete"
      confirmColor="danger"
      confirmLoading={loading}
    />
  );
};

export default DeleteQueueModal;
