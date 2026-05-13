
import { getAuthHeaders } from "../components/auth/util";


export const promotionsService = {
  getPromotions: async ({ page = 1 } = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/promotions?page=${page}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch promotions");
    return response.json();
  },
  createPromotion: async (data) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/promotions`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!response.ok) throw new Error("Failed to create promotion");
    return response.json();
  }
};