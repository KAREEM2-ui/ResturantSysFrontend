import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(
        (item) => item.name === action.payload.name
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },

    removeItem: (state, action) => {
      const item = state.items[action.payload];

      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        state.items = state.items.filter((_, i) => i !== action.payload);
      }
    },

    clearBill: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearBill } = billSlice.actions;
export default billSlice.reducer;