import { Outlet } from "react-router-dom";
import { useCan } from "../../hooks/useCan";

export function RequirePermission({ permission, children }) {
  const can = useCan();

  if (!can(permission)) {
    return (
      <div className="grid min-h-[50vh] place-items-center p-6">
        <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
