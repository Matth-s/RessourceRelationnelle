import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ILoginResponse } from './schemas/auth-api-response-schema';

interface IInitialState {
  user: ILoginResponse | null;
}

const initialState: IInitialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<ILoginResponse>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
