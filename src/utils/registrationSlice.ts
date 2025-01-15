// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for registration
interface RegistrationState {
  email: string;
  password: string;
  rePassword: string;
  emailError: boolean;
}

const initialState: RegistrationState = {
  email: "",
  password: "",
  rePassword: "",
  emailError: false,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
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
} = registrationSlice.actions;

export const selectEmailError = (state: { registration: RegistrationState }) =>
  state.registration.emailError;

export default registrationSlice.reducer;
