import { Navigate, Outlet } from "react-router-dom";
import { useCan } from "../../hooks/useCan";

export function RequirePermission({ permission, children }) {
  const can = useCan();

  if (!can(permission)) {
    // Redirect to a neutral page or show generic forbidden
    return <div>Unauthorized</div>;
  }

  return children ? children : <h2 className="grid grid-cols-1 items-center">{"Unauthorized"}</h2>;
}
