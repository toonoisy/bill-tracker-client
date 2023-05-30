import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './categorySlice';
import billSlice from './billSlice';
import statsSlice from './statsSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    category: categorySlice,
    bill: billSlice,
    stats: statsSlice,
    user: userSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
