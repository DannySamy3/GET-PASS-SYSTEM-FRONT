import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  sync: false,
  loading: false,
  error: null,
};

// This will check if we're in the browser (client-side)
if (typeof window !== "undefined") {
  initialState.isAuthenticated = !!localStorage.getItem("authToken");
  initialState.sync = !!localStorage.getItem("authToken");
}

const authenticator = createSlice({
  name: "authenticator",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      // Save to localStorage on the client-side only
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },

    handleSync: (state) => {
      state.sync = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Clear localStorage on the client-side only
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout, handleSync } = authenticator.actions;
export const selectLogin = (state: any) => state.authenticator.isAuthenticated;
export const selectSync = (state: any) => state.authenticator.sync;

export default authenticator.reducer;
