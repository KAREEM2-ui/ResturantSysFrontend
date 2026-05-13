const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";

export const purchaseOrdersService = {
  getPurchaseOrders: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/purchase-orders?page=${page}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch purchase orders");
    return response.json();
  },
  createPurchaseOrder: async (data) => {
    const response = await fetch(`${BASE_URL}/purchase-orders`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to create purchase order");
    return response.json();
  }
};