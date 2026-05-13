import { configureStore } from "@reduxjs/toolkit";
import posReducer from "../features_State/posSlice";

import authReducer from "../features_State/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pos: posReducer
  },
});