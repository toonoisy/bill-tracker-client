import { configureStore } from "@reduxjs/toolkit";
import categorySlice from './categorySlice';

export default configureStore({
  reducer: {
    category: categorySlice,
  },
});
