export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    "x-permission": user.role === "admin" ? "admin" : user.permissions.join(","),

  }
}

