import { getAuthHeaders } from "../components/auth/util";

const BASE_URL = "http://localhost:5000/api";

export const branchesService = {
  getBranches: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/branches?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branches");
    return response.json();
  },

  createBranch: async (data) => {
    const response = await fetch(`${BASE_URL}/branches`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create branch");
    return response.json();
  }
};
