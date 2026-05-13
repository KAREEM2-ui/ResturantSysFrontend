
import { getAuthHeaders } from "../components/auth/util";

export const clientsService = {
  getClients: async ({ page = 1 } = {}) => {
    const params = new URLSearchParams();
    params.set("page", String(page));

    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/loyalty-clients?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  },
};
