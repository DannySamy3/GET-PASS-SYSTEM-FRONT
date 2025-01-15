// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
  hideLogin: boolean;
}

const initialState: AuthState = {
  isLogin: false,
  hideLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },
    setHideLogin(state, action: PayloadAction<boolean>) {
      state.hideLogin = action.payload;
    },

    // Action to clear/reset user data
    clearAuth() {
      return initialState;
    },
  },
});

export const { setHideLogin, clearAuth, setIsLogin } = authSlice.actions;
export const selectIsLogin = (state: { auth: AuthState }) => state.auth.isLogin;
export const selectHideLogin = (state: { auth: AuthState }) =>
  state.auth.hideLogin;

export default authSlice.reducer;
