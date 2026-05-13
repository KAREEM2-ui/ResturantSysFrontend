
import { getAuthHeaders } from "../components/auth/util";


export const rolesService = {
  getRoles: async ({ page = 1 } = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/roles?page=${page}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch roles");
    return response.json();
  },
  createRole: async (data) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/roles`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to create role");
    return response.json();
  }
};