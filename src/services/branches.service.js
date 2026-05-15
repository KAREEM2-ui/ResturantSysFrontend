import { getAuthHeaders } from "../components/auth/util";


export const branchesService = {
  getBranches: async ({ page = 1 } = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/branches?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branches");
    return response.json();
  },

  createBranch: async (data) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/branches`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create branch");
    return response.json();
  },


  TrygetUserBranchByLocation: async () => {


    const response = await fetch(`${import.meta.env.VITE_GEO_API_URL}`, {
      method: "GET",
    });
    if (!response.ok) 
      {
        console.error("Failed to fetch user branch by location", response);
        throw new Error("Failed to fetch user branch by location");
      }


    return response.json();
  }
};
