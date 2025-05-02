// filepath: /e:/CODE/Lisa/frontend/getpass/src/utils/dateSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const currentDay = new Date();
const formattedDate = `${currentDay.getDate()}${getOrdinalSuffix(
  currentDay.getDate()
)} ${currentDay.toLocaleString("default", {
  month: "long",
})} ${currentDay.getFullYear()}`;

const dateSlice = createSlice({
  name: "date",
  initialState: {
    currentDate: formattedDate,
  },
  reducers: {
    setDate: (state, action) => {
      state.currentDate = action.payload;
    },
  },
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th"; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
