import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICurrentUserResponse } from '../user/schemas/current-user-schema';
import { USER_ROLE } from '@/types/user-role-type';

interface IInitialState {
  user: ICurrentUserResponse | null;
}

const initialState: IInitialState = {
  user: {
    username: 'Matths',
    role: USER_ROLE.ADMIN,
    token: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
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
