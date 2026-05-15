import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBranchId: null,
};

const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    setSelectedBranchId: (state, action) => {
      state.selectedBranchId = action.payload || null;
    },
    clearSelectedBranchId: (state) => {
      state.selectedBranchId = null;
    },
  },
});

export const { setSelectedBranchId, clearSelectedBranchId } = appConfigSlice.actions;

export const selectSelectedBranchId = (state) => state.appConfig.selectedBranchId;
export const selectBranchId = (state) => state.auth.user?.branchId || state.appConfig.selectedBranchId || null;

export default appConfigSlice.reducer;