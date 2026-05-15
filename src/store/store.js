import { configureStore } from "@reduxjs/toolkit";
import posReducer from "../features_State/posSlice";

import authReducer from "../features_State/authSlice";
import appConfigReducer from "../features_State/appConfigSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pos: posReducer,
    appConfig: appConfigReducer,
  },
});