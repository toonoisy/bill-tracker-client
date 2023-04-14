import { configureStore } from "@reduxjs/toolkit";
import categorySlice from './categorySlice';
import statsSlice from './statsSlice';

export default configureStore({
  reducer: {
    category: categorySlice,
    stats: statsSlice,
  },
});
