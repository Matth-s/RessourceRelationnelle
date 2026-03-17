import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ICurrentUserResponse } from "../user/schemas/current-user-schema";

interface IInitialState {
  user: ICurrentUserResponse | null;
}

const initialState: IInitialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<ICurrentUserResponse>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
