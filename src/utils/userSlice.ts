// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name?: string; // User name
  email?: string; // User email
  gender?: string; // Gender
  country?: string; // Country
  isVerified: boolean; // Verification status
  phoneNumber: string;
  isLogin: boolean;
  next: boolean;
}

const initialState: UserState = {
  name: "",
  email: "",
  gender: "",
  country: "",
  phoneNumber: "",
  isVerified: false,
  isLogin: false,
  next: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set user data
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },

    // Action to update a specific field
    updateUserField(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },

    // Action to clear/reset user data
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, updateUserField, clearUser, setIsLogin } =
  userSlice.actions;
export const selectIsLogin = (state: { user: UserState }) => state.user.isLogin;

export default userSlice.reducer;
