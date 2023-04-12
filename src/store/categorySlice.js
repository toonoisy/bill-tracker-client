import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";
import { PAY_TYPES } from "@/constants";

export const getCategoryList = createAsyncThunk(
  "category/getCategoryList",
  async () => {
    const res = await request.get("/api/type/list");
    return res.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryList: [],
    expenseTagList: [],
    incomeTagList: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryList.fulfilled, (state, { payload }) => {
        state.categoryList = payload;
        state.expenseTagList = payload.filter(
          (e) => e.pay_type === PAY_TYPES.EXPENSE
        );
        state.incomeTagList = payload.filter(
          (e) => e.pay_type === PAY_TYPES.INCOME
        );
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.categoryList = [];
        state.expenseTagList = [];
        state.incomeTagList = [];
      });
  },
});

export default categorySlice.reducer;
