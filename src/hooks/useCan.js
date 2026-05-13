import { useSelector } from "react-redux";

export function useCan() {
  const user = useSelector((state) => state.auth.user);

  const can = (permission) => {

    console.log("can run : ");
    console.log(`Permission: ${permission}`);
    console.log(`User: ${user.role}`);
    

    // If no permission is required, return true
    if (permission == null || user.role === "admin") return true;
    

    // Check if the user has the required permission
    return user.permissions.includes(permission);
  };

  return can;
}
