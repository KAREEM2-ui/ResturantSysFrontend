const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util.js";

export const inventoryService = {
  getInventoryItems: async ({ page = 1, limit = 10 } = {}) => {
    const response = await fetch(`${BASE_URL}/inventory-items?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch inventory items");
    return response.json();
  },

  createInventoryItem: async (data) => {
    const response = await fetch(`${BASE_URL}/inventory-items`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create inventory item");
    return response.json();
  },

  updateInventoryItem: async (id, data) => {
    const response = await fetch(`${BASE_URL}/inventory-items/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update inventory item");
    return response.json();
  },

  getBranchProducts: async (branchId) => {
  const response = await fetch(`${BASE_URL}/products/branch/${branchId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch branch products");
  return response.json();
}
};
