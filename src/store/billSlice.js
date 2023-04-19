import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";
import dayjs from "dayjs";
import { REFRESH_STATE, LOAD_STATE } from "@/constants";

export const getBillList = createAsyncThunk(
  "bill/getBillList",
  async (_, { getState }) => {
    const { date, page, page_size, type_id } = getState().bill;
    const params = {
      date,
      page,
      page_size,
      type_id,
    };
    const res = await request.get("/api/bill/list", { params });
    return res.data;
  }
);

export const getBillDetail = createAsyncThunk(
  "bill/getBillDetail",
  async (id) => {
    const params = { id };
    const { data } = await request.get("/api/bill/item", { params });
    const t = data.mtime || data.ctime;
    data.lastModifiedTime = dayjs(Number(t)).format("YYYY-MM-DD HH:mm");
    return data;
  }
);

const initialState = {
  billList: [],
  detail: {},
  date: dayjs().format("YYYY-MM"),
  page: 1,
  page_size: 5,
  type_id: "all",
  totalPage: 0,
  totalExpense: 0,
  totalIncome: 0,
  refreshing: REFRESH_STATE.normal,
  loading: LOAD_STATE.normal,
  isInit: true,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setPage(state, { payload }) {
      state.page = payload;
    },
    setDate(state, { payload }) {
      state.date = payload;
    },
    setTypeId(state, { payload }) {
      state.type_id = payload;
    },
    setRefreshing(state, { payload }) {
      state.refreshing = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBillList.fulfilled, (state, { payload }) => {
        const {
          list = [],
          totalPage = 0,
          totalExpense = 0,
          totalIncome = 0,
        } = payload;
        if (state.page == 1) {
          state.billList = list;
        } else {
          state.billList = state.billList.concat(list);
        }
        state.totalPage = totalPage;
        state.totalExpense = totalExpense;
        state.totalIncome = totalIncome;
        if (!state.isInit) {
          state.loading = LOAD_STATE.success;
          state.refreshing = REFRESH_STATE.success;
        }
        state.isInit = false;
      })
      .addCase(getBillList.rejected, (state) => {
        state.loading = LOAD_STATE.failure;
        state.refreshing = REFRESH_STATE.failure;
      })
      .addCase(getBillDetail.fulfilled, (state, { payload }) => {
        state.detail = payload;
      });
  },
});

export const { setPage, setDate, setTypeId, setRefreshing, setLoading } =
  billSlice.actions;

export default billSlice.reducer;
