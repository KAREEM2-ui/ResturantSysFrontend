export const authService = {
  login: async ({ username, password }) => {
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = new Error("Failed to login");
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  },
};