import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    navigate("/login", { replace: true });
    return;
  }

  return children ? children : <Outlet />;
}
