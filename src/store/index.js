import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './categorySlice';
import billSlice from './billSlice';
import statsSlice from './statsSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    category: categorySlice,
    bill: billSlice,
    stats: statsSlice,
    user: userSlice,
  },
});
