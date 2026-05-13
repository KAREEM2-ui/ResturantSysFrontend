const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";


export const ordersService = {
  getOrders: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/orders?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  getBranchOrders: async ({ branchId, page = 1 } = {}) => {
    if (!branchId) throw new Error("branchId is required");
    const response = await fetch(`${BASE_URL}/orders/branch/${branchId}?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branch orders");
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  updateOrder: async ({ id, ...data }) => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },
  
  deleteOrder: async (id) => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return response.json();
  }
};
