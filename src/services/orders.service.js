
import { getAuthHeaders } from "../components/auth/util";


export const ordersService = {
  getOrders: async ({ page = 1 } = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  getBranchOrders: async ({ branchId, page = 1 } = {}) => {
    if (!branchId) throw new Error("branchId is required");
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders/branch/${branchId}?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branch orders");
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  updateOrder: async ({ id, ...data }) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },

  updateOrderStatus: async ({ id, status }) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },
  
  deleteOrder: async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return response.json();
  }
};
