const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";

export const usersService = {
  getUsers: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/users?page=${page}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },
  createUser: async (data) => {
    const response = await fetch(`${BASE_URL}/users`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },
  updateUser: async ({ id, ...data }) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, { method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },
};