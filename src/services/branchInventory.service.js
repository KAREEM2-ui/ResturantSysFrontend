const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";

export const branchInventoryService = {
  // Get all branch inventory records (paginated)
  getBranchInventory: async (page = 1, take = 10) => {
    const response = await fetch(`${BASE_URL}/branch-inventory?page=${page}&take=${take}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branch inventory");
    return response.json();
  },

  // Get inventory for a specific branch (paginated)
  getBranchInventoryByBranch: async (branchId, page = 1, take = 10) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/${branchId}?page=${page}&take=${take}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branch inventory");
    return response.json();
  },

  // Get producible inventory items for a specific branch
  getProducibleItemsByBranch: async (branchId) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/${branchId}?type=producible`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch producible branch inventory");
    const data = await response.json();
    return Array.isArray(data?.data?.branchInventory) ? data.data.branchInventory : [];
  },

  // Create branch inventory record
  createBranchInventory: async (payload) => {
    const response = await fetch(`${BASE_URL}/branch-inventory`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create branch inventory");
    return response.json();
  },

  // Update branch inventory (adjust stock, etc.)
  updateBranchInventory: async (branchInventoryId, payload) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/${branchInventoryId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to update branch inventory");
    return response.json();
  },

  // Delete branch inventory record
  deleteBranchInventory: async (branchInventoryId) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/${branchInventoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete branch inventory");
    return response.json();
  },

  // Transfer stock between branches
  transferStock: async (payload) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/transfer`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to transfer stock");
    return response.json();
  },

  // Adjust stock for branch
  adjustStock: async (branchInventoryId, quantity) => {
    const response = await fetch(`${BASE_URL}/branch-inventory/${branchInventoryId}/adjust`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to adjust stock");
    return response.json();
  }
};
