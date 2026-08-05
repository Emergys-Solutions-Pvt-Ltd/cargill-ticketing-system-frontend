import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DeactivateUserIcon from "../../../assets/icons/deactivateUser.svg";

const DeactivateUserModal = ({ open, onClose, onConfirm, userName, loading = false }) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={DeactivateUserIcon}
      title="Are you sure?"
      message={
        <>
          Do you really want to deactivate this user "<strong>{userName}</strong>"?
        </>
      }
      confirmLabel="Deactivate"
      confirmColor="danger"
      confirmLoading={loading}
    />
  );
};

export default DeactivateUserModal;
