import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import request from '../utils/request';
import dayjs from 'dayjs';
import { REFRESH_STATE, LOAD_STATE } from '../constants';
import { BillDetail, Bill, BillListData } from '../types';

interface BillState {
  billList: Bill[];
  detail: BillDetail | null;
  date: string;
  page: number;
  page_size: number;
  type_id: string;
  totalPage: number;
  totalExpense: number;
  totalIncome: number;
  refreshing: number;
  loading: number;
  isInit: boolean;
}

export const getBillList = createAsyncThunk<
  BillListData,
  void,
  { state: { bill: BillState } }
>('bill/getBillList', async (_, { getState }) => {
  const { date, page, page_size, type_id } = getState().bill;
  const params = {
    date,
    page,
    page_size,
    type_id,
  };
  const res = await request.get('/api/bill/list', { params });
  return res.data;
});

export const getBillDetail = createAsyncThunk(
  'bill/getBillDetail',
  async (id) => {
    const params = { id };
    const { data } = await request.get('/api/bill/item', { params });
    const t = data.mtime || data.ctime;
    data.lastModifiedTime = dayjs(Number(t)).format('YYYY-MM-DD HH:mm');
    return data;
  }
);

const initialState: BillState = {
  billList: [],
  detail: null,
  date: dayjs().format('YYYY-MM'),
  page: 1,
  page_size: 5,
  type_id: 'all',
  totalPage: 0,
  totalExpense: 0,
  totalIncome: 0,
  refreshing: REFRESH_STATE.normal,
  loading: LOAD_STATE.normal,
  isInit: true,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setTypeId(state, action: PayloadAction<string>) {
      state.type_id = action.payload;
    },
    setRefreshing(state, action: PayloadAction<number>) {
      state.refreshing = action.payload;
    },
    setLoading(state, action: PayloadAction<number>) {
      state.loading = action.payload;
    },
    setIsInit(state, action: PayloadAction<boolean>) {
      state.isInit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getBillList.fulfilled,
        (state, action: PayloadAction<BillListData>) => {
          const {
            list = [],
            totalPage = 0,
            totalExpense = 0,
            totalIncome = 0,
          } = action.payload;
          if (state.page == 1) {
            state.billList = list;
          } else {
            state.billList = state.billList.concat(list);
          }
          state.totalPage = totalPage;
          state.totalExpense = totalExpense;
          state.totalIncome = totalIncome;
          /* 
        a weird bug with zarm <Pull />, 
        the success message remains visible the first time it loads non-empty data successfully,
        better to set the load state to normal
        */
          state.loading = LOAD_STATE.normal;
          state.refreshing = REFRESH_STATE.normal;
        }
      )
      .addCase(getBillList.rejected, (state) => {
        state.loading = LOAD_STATE.failure;
        state.refreshing = REFRESH_STATE.failure;
      })
      .addCase(
        getBillDetail.fulfilled,
        (state, action: PayloadAction<BillDetail>) => {
          state.detail = action.payload;
        }
      );
  },
});

export const {
  setPage,
  setDate,
  setTypeId,
  setRefreshing,
  setLoading,
  setIsInit,
} = billSlice.actions;

export default billSlice.reducer;
