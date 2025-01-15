// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/store.ts
import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./dateSlice";
import toastReducer from "./toastSlice";
import registrationReducer from "./registrationSlice"; // Import toast slice
import userSlice from "./userSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    toast: toastReducer,
    user: userSlice,
    auth: authSlice,
    registration: registrationReducer, // Add toast reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
