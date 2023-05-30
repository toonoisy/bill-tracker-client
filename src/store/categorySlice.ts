import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import request from '../utils/request';
import { PAY_TYPES } from '../constants';
import { CategoryList } from '../types';

const initialState = {
  categoryList: [] as CategoryList,
  expenseTagList: [] as CategoryList,
  incomeTagList: [] as CategoryList,
};

export const getCategoryList = createAsyncThunk(
  'category/getCategoryList',
  async () => {
    const res = await request.get('/api/type/list');
    return res.data;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getCategoryList.fulfilled,
        (state, action: PayloadAction<CategoryList>) => {
          state.categoryList = action.payload;
          state.expenseTagList = action.payload.filter(
            (e) => e.pay_type === PAY_TYPES.EXPENSE
          );
          state.incomeTagList = action.payload.filter(
            (e) => e.pay_type === PAY_TYPES.INCOME
          );
        }
      )
      .addCase(getCategoryList.rejected, (state) => {
        state.categoryList = [];
        state.expenseTagList = [];
        state.incomeTagList = [];
      });
  },
});

export default categorySlice.reducer;
