const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";


export const promotionsService = {
  getPromotions: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/promotions?page=${page}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch promotions");
    return response.json();
  },
  createPromotion: async (data) => {
    const response = await fetch(`${BASE_URL}/promotions`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to create promotion");
    return response.json();
  }
};