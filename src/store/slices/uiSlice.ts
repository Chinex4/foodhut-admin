import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

type UIState = {
  sidebarOpen: boolean;
  isDarkMode: boolean;
};

const initialState: UIState = {
  sidebarOpen: false,
  isDarkMode: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<boolean | undefined>) {
      state.sidebarOpen = action.payload ?? !state.sidebarOpen;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleSidebar, toggleDarkMode } = uiSlice.actions;
export const selectUI = (state: RootState) => state.ui;
export default uiSlice.reducer;
