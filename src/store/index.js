import { configureStore } from "@reduxjs/toolkit";
import categorySlice from './categorySlice';
import statsSlice from './statsSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    category: categorySlice,
    stats: statsSlice,
    user: userSlice,
  },
});
