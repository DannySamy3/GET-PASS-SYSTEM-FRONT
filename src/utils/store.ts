// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/store.ts
import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./dateSlice";
import toastReducer from "./toastSlice"; // Import toast slice

export const store = configureStore({
  reducer: {
    date: dateReducer,
    toast: toastReducer, // Add toast reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
