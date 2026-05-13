import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersService } from "../services/orders.service";

// Async thunk to save the order via the respective service
export const saveOrder = createAsyncThunk(
  "pos/saveOrder",
  async ({ windowId, orderData }, { rejectWithValue }) => {
    try {
      const response = await ordersService.createOrder(orderData);
      return { windowId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  windows: [], // Array of POS windows/tabs
  activeWindowId: null,
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    // Run this in useEffect([]) to initialize a tab
    createNewWindow: (state, action) => {
      const newWindowId = action.payload || `window-${Date.now()}`;
      
      // Ensure we don't accidentally create duplicates if strict mode double-invokes useEffect
      const exists = state.windows.find((w) => w.id === newWindowId);
      if (!exists) {
        state.windows.push({
          id: newWindowId,
          items: [],
          coupon: null,
          orderType: "dine_in"
        });
        state.activeWindowId = newWindowId;
      }
    },
    setActiveWindow: (state, action) => {
      state.activeWindowId = action.payload;
    },
    closeWindow: (state, action) => {
      const windowId = action.payload;
      state.windows = state.windows.filter((w) => w.id !== windowId);
      
      // Reassign active window if the closed one was active
      if (state.activeWindowId === windowId) {
        state.activeWindowId = state.windows.length > 0 ? state.windows[state.windows.length - 1].id : null;
      }
    },
    addItem: (state, action) => {
      const { windowId, item } = action.payload;
      const posWindow = state.windows.find((w) => w.id === windowId);
      if (posWindow) {
        const existingItem = posWindow.items.find(i => i._id === item._id);
        if (existingItem) {
          existingItem.qty += (item.qty || 1);
        } else {
          posWindow.items.push(item);
        }
      }
    },
    removeItem: (state, action) => {
      // itemId to remove
      const { windowId, itemIndex } = action.payload; 
      const posWindow = state.windows.find((w) => w.id === windowId);
      if (posWindow) {
        posWindow.items.splice(itemIndex, 1);
      }
    },
    addCoupon: (state, action) => {
      const { windowId, coupon } = action.payload;
      const posWindow = state.windows.find((w) => w.id === windowId);
      if (posWindow) {
        posWindow.coupon = coupon;
      }
    },
    removeCoupon: (state, action) => {
      const { windowId } = action.payload;
      const posWindow = state.windows.find((w) => w.id === windowId);
      if (posWindow) {
        posWindow.coupon = null;
      }
    },
    setOrderType: (state, action) => {
      const { windowId, orderType } = action.payload;
      const posWindow = state.windows.find((w) => w.id === windowId);
        if (posWindow) {
            posWindow.orderType = orderType; //  "dine-in", "takeaway"
        }
  },
  
 
},

extraReducers: (builder) => {
    builder
      .addCase(saveOrder.pending, (state,action) => {
        state.status = "loading";
        const posWindow = state.windows.find((w) => w.id === action.meta.arg.windowId);
        if (posWindow) {
          posWindow.isLoading = true;
          posWindow.orderError = null;
        }
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { windowId } = action.payload;
        
        // Optionally clear the cart of the window after a successful save
        const posWindow = state.windows.find((w) => w.id === windowId);
        if (posWindow) {
          posWindow.items = [];
          posWindow.coupon = null;
          posWindow.isLoading = false;
        }
      })
      .addCase(saveOrder.rejected, (state, action) => {
        const { windowId } = action.meta.arg;
        const posWindow = state.windows.find((w) => w.id === windowId);
        if (posWindow) {
          posWindow.isLoading = false;
          posWindow.orderError = action.payload || "Failed to save order";
        }
        
      });
  },
});

export const {
  createNewWindow,
  setActiveWindow,
  closeWindow,
  addItem,
  removeItem,
  addCoupon,
  removeCoupon,
  setOrderType
} = posSlice.actions;

export default posSlice.reducer;
