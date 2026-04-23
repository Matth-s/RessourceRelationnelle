import { configureStore } from '@reduxjs/toolkit';

import authSlice from '@/features/auth/auth.slice';
import  asideSlice  from './slices/aside-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    aside: asideSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
