import { useAuth } from "../context/AuthContext";
import { permissions } from "../utils/permissions";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;

    return permissions[user.role]?.includes(permission);
  };

  return { hasPermission };
};
