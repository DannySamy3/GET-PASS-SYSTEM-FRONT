// Example: authenticatorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authenticator.actions;
export const selectLogin = (state: any) => state.authenticator.isAuthenticated;

export default authenticator.reducer;
