import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define possible toast types and reset state
interface ToastState {
  message: string;
  type: "success" | "error" | "reset"; // Adding 'reset' to handle reset state
}

const initialState: ToastState = {
  message: "",
  type: "reset", // Default type should be 'reset'
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastState>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    resetToast: (state) => {
      state.message = "";
      state.type = "reset"; // Reset to 'reset' type
    },
  },
});

export const { showToast, resetToast } = toastSlice.actions;

export default toastSlice.reducer;
