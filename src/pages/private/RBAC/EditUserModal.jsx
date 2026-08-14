import AddUserModal from "./AddUserModal";

// Edit User reuses the Add User form (same fields/layout), just pre-filled
// from `user` with Email/Department locked and an extra Work Location field.
const EditUserModal = ({ open, onClose, onSubmit, user, loading = false }) => (
  <AddUserModal open={open} onClose={onClose} onSubmit={onSubmit} user={user} loading={loading} />
);

export default EditUserModal;
