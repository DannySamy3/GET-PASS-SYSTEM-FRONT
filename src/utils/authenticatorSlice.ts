// Example: authenticatorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authenticator = createSlice({
  name: "authenticator",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authenticator.actions;
export const selectLogin = (state: any) => state.authenticator.isAuthenticated;

export default authenticator.reducer;
