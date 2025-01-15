// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for registration
interface RegistrationState {
  email: string;
  password: string;
  rePassword: string;
  emailError: boolean;
  token: string;
  firstName: string;
  secondName: string;
  lastName: string;
  gender: string;
  country: string;
  phoneNumber: string;
}

const initialState: RegistrationState = {
  email: "",
  password: "",
  rePassword: "",
  firstName: "",
  secondName: "",
  lastName: "",
  gender: "",
  country: "",
  phoneNumber: "",
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
    setGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setSecondName(state, action: PayloadAction<string>) {
      state.secondName = action.payload;
    },
    setPhoneNumber(state, action: PayloadAction<string>) {
      state.phoneNumber = action.payload;
    },
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
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
  setCountry,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setSecondName,
  setGender,
} = registrationSlice.actions;

export const selectEmailError = (state: { registration: RegistrationState }) =>
  state.registration.emailError;

export const selectEmail = (state: { registration: RegistrationState }) =>
  state.registration.email;
export const selectToken = (state: { registration: RegistrationState }) =>
  state.registration.token;
export const selectFirstName = (state: { registration: RegistrationState }) =>
  state.registration.firstName;
export const selectSecondName = (state: { registration: RegistrationState }) =>
  state.registration.secondName;
export const selectLastName = (state: { registration: RegistrationState }) =>
  state.registration.lastName;

export const selectGender = (state: { registration: RegistrationState }) =>
  state.registration.gender;
export const selectCountry = (state: { registration: RegistrationState }) =>
  state.registration.country;
export const selectPhoneNumber = (state: { registration: RegistrationState }) =>
  state.registration.phoneNumber;
export const selectPassword = (state: { registration: RegistrationState }) =>
  state.registration.password;
export const selectRePassword = (state: { registration: RegistrationState }) =>
  state.registration.rePassword;

export default registrationSlice.reducer;
