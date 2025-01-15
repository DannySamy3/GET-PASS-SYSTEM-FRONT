// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for registration
interface RegistrationState {
  email: string;
  password: string;
  rePassword: string;
  emailError: boolean;
  token: string;
}

const initialState: RegistrationState = {
  email: "",
  password: "",
  rePassword: "",
  emailError: false,
  token: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setRePassword(state, action: PayloadAction<string>) {
      state.rePassword = action.payload;
    },
    setEmailError(state, action: PayloadAction<boolean>) {
      state.emailError = action.payload;
    },
    clearRegistration(state) {
      state.email = "";
      state.password = "";
      state.rePassword = "";
      state.emailError = false;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setRePassword,
  setEmailError,
  clearRegistration,
  setToken,
} = registrationSlice.actions;

export const selectEmailError = (state: { registration: RegistrationState }) =>
  state.registration.emailError;

export const selectEmail = (state: { registration: RegistrationState }) =>
  state.registration.email;
export const selectToken = (state: { registration: RegistrationState }) =>
  state.registration.token;

export default registrationSlice.reducer;
