import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/users.service";

export const useUserFormViewModel = (user, onSaved) => {
  const [formData, setFormData] = useState(() => ({
    fullName: user?.fullName || "",
    username: user?.username || "",
    password: "",
    branchId: user?.branchId || "",
    role: user?.role || "",
  }));

  const [permissions, setPermissions] = useState(() => {
    const base = {
      "view-dashboard": false,
      "view-reports": false,
      "view-orders": false,
      "manage-order-operations": false,
      "view-clients": false,
      "manage-clients": false,
      "view-products": false,
      "manage-products": false,
      "view-inventory": false,
      "manage-inventory-items": false,
      "manage-stock-operations": false,
      "create-purchase-orders": false,
      "view-users": false,
      "manage-users": false,
      "manage-user-authorities": false,
      "view-roles": false,
      "manage-roles": false,
      "view-branches": false,
      "manage-branches": false,
      "view-promotions": false,
      "manage-promotions": false,
      "view-discounts": false,
      "manage-discounts": false,
    };

    

    // check for 'permissions' 
    if (user?.permissions && Array.isArray(user.permissions)) {
      for (const perm of user.permissions) {
          base[perm] = true;
        
      }
    }

    return base;
  });

  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const { mutateAsync: saveUser, isPending: isSaving } = useMutation({
    mutationFn: (payload) => {
      if (user?.id || user?._id) {
        return usersService.updateUser({ id: user.id || user._id, ...payload });
      }
      return usersService.createUser(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onSaved?.();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!user && !formData.password) {
      setError("Password is required for new users");
      return;
    }

    if (!formData.branchId) {
      setError("Branch is required");
      return;
    }

    if (!formData.role) {
      setError("Role is required");
      return;
    }

    // Build authorities array from permissions
    const authorities = Object.entries(permissions)
      .filter(([_, checked]) => checked)
      .map(([key, _]) => key);

    const payload = {
      fullName: formData.fullName,
      username: formData.username,
      branchId: formData.branchId,
      role: formData.role,
      permissions: authorities,
      passwordHash: formData.password == "" ? user.passwordHash : formData.password,
    };

    console.log(`payload before in submit ${payload.permissions}`);
    

    try {
      await saveUser(payload);
    } catch (err) {
      setError(err.message || "Failed to save user");
    }
  };

  return {
    // Form state
    formData,
    handleChange,
    handleSubmit,

    // Permissions
    permissions,
    handlePermissionChange,

    // Status
    isSaving,
    error,
    setError,
  };
};
