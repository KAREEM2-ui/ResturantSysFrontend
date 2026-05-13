const BASE_URL = "http://localhost:5000/api";

import { getAuthHeaders } from "../components/auth/util";

export const productsService = {
  getProducts: async ({ page = 1 } = {}) => {
    const response = await fetch(`${BASE_URL}/products?page=${page}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        const error = new Error("Unauthorized");
        error.status = response.status;
        throw error;
      }

      const error = new Error("Failed to fetch products");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  createProduct: async (data) => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  updateProduct: async ({ id, ...data }) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },
  
  deleteProduct: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },

  getBranchProducts: async ({ branchId } = {}) => {
    if (!branchId) throw new Error("branchId is required");
    const response = await fetch(`${BASE_URL}/products/branch/${branchId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch branch products");
    return response.json();
  },
};
