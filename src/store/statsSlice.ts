import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import request from '../utils/request';
import dayjs from 'dayjs';
import { PAY_TYPES } from '../constants';
import { Stats, StatsList } from '../types';

interface StatsState {
  date: string;
  payType: number;
  statsList: StatsList;
  totalExpense: string;
  totalIncome: string;
}

const initialState: StatsState = {
  date: dayjs().format('YYYY-MM'),
  payType: PAY_TYPES.EXPENSE,
  statsList: [],
  totalExpense: '',
  totalIncome: '',
};

// payload, arg, and extra parameters
export const getStatsList = createAsyncThunk<
  Stats,
  void,
  { state: { stats: StatsState } }
>('stats/getStatsList', async (_, { getState }) => {
  const { date, payType } = getState().stats;
  const params = { date, pay_type: payType };
  const res = await request.post('/api/bill/stats', params);
  return res.data;
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setPayType(state, action: PayloadAction<number>) {
      state.payType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getStatsList.fulfilled,
      (state, action: PayloadAction<Stats>) => {
        const { list, total_expense, total_income } = action.payload;
        state.statsList = list;
        state.totalExpense = total_expense;
        state.totalIncome = total_income;
      }
    );
  },
});

export const { setDate, setPayType } = statsSlice.actions;

export default statsSlice.reducer;
