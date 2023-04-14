import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";
import dayjs from "dayjs";
import { PAY_TYPES } from "@/constants";

export const getStatsList = createAsyncThunk(
  "stats/getStatsList",
  async (_, { getState }) => {
    const { date, payType } = getState()?.stats;
    const params = { date, pay_type: payType };
    const res = await request.post("/api/bill/stats", params);
    return res.data;
  }
);

const initialState = {
  date: dayjs().format("YYYY-MM"),
  payType: PAY_TYPES.EXPENSE,
  statsList: [],
  totalExpense: "",
  totalIncome: "",
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setDate(state, { payload }) {
      state.date = payload;
    },
    setPayType(state, { payload }) {
      state.payType = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatsList.fulfilled, (state, { payload }) => {
      const { list, total_expense, total_income } = payload;
      state.statsList = list;
      state.totalExpense = total_expense;
      state.totalIncome = total_income;
    });
  },
});

export const { setDate, setPayType } = statsSlice.actions;

export default statsSlice.reducer;
