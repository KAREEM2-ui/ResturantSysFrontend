const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";

export const productionEventsService = {
  // Get all production events (paginated)
  getProductionEvents: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/production-events?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch production events");
    return response.json();
  },

  // Get single production event
  getProductionEvent: async (id) => {
    const response = await fetch(`${BASE_URL}/production-events/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch production event");
    return response.json();
  },

  // Create production event
  createProductionEvent: async (payload) => {
    const response = await fetch(`${BASE_URL}/production-events`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create production event");
    return response.json();
  },

  // Update production event
  updateProductionEvent: async ({ id, ...payload }) => {
    console.log("calling update produce");
    
    const response = await fetch(`${BASE_URL}/production-events/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    console.log("update produce response:", response);
    if (!response.ok) throw new Error("Failed to update production event");
    return response.json();
  },

  // Delete production event
  deleteProductionEvent: async (id) => {
    const response = await fetch(`${BASE_URL}/production-events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete production event");
    return response.json();
  },

  // Fetch all producible inventory items
  getProducibleItems: async () => {
    const response = await fetch(`${BASE_URL}/inventory-items`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch inventory items");
    const data = await response.json();
    // Filter for producible items
    const items = Array.isArray(data?.data?.inventoryItems) ? data.data.inventoryItems : [];
    return items.filter(item => item.itemType === "producible");
  },

  // Fetch single inventory item with ingredients populated
  getInventoryItem: async (id) => {
    const response = await fetch(`${BASE_URL}/inventory-items/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch inventory item");
    return response.json();
  },
};
