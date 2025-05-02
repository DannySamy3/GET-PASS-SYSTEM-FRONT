import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./dateSlice";
import toastReducer from "./toastSlice";
import registrationReducer from "./registrationSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";
import authenticator from "./authenticatorSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    toast: toastReducer,
    user: userSlice,
    auth: authSlice,
    authenticator: authenticator,
    registration: registrationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
