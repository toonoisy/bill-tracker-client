import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  const res = await request.get("/api/user/get_userinfo");
  return res?.data;
});

const initialState = {
  isAuth: false,
  userId: "",
  username: "",
  signature: "",
  avatar: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuth(state, { payload }) {
      state.isAuth = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      const { id, username, signature, avatar } = payload;
      state.userId = id;
      state.username = username;
      state.signature = signature;
      state.avatar = avatar;
    });
  },
});

export const { setIsAuth } = userSlice.actions;

export default userSlice.reducer;
