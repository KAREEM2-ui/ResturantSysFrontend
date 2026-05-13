import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      return await authService.login({ username, password });
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to login",
        status: error.status || 500,
      });
    }
  }
);


const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  permissions: JSON.parse(localStorage.getItem("permissions")) || [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.permissions = action.payload.user.permissions || [];
      
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("permissions", JSON.stringify(state.permissions));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.permissions = [];
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.permissions = action.payload.user.permissions || [];

        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("permissions", JSON.stringify(state.permissions));
      })
      .addCase(login.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.permissions = [];
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;