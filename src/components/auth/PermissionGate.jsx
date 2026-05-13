import { useCan } from "../../hooks/useCan";

export function PermissionGate({ permission, children, fallback = null }) {
  const can = useCan();

  if (!can(permission)) {
    return fallback;
  }

  return children;
}
