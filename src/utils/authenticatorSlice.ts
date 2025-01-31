// Example: authenticatorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  sync: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,
};

const authenticator = createSlice({
  name: "authenticator",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;

      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    handleSync: (state) => {
      state.sync = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout, handleSync } = authenticator.actions;
export const selectLogin = (state: any) => state.authenticator.isAuthenticated;
export const selectSync = (state: any) => state.authenticator.sync;

export default authenticator.reducer;
