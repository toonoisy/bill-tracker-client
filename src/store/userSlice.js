import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  const res = await request.get("/api/user/get_userinfo");
  return res?.data;
});

export const uploadAvatar = createAsyncThunk("user/uploadAvatar", async (file) => {
  console.log(file);
  const formData = new FormData();
  formData.append("file", file.file);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const res = await request.post("/api/upload", formData, { headers });
  return res?.data;
});

const initialState = {
  isAuth: Boolean(localStorage.getItem('token')),
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
    setSignature(state, { payload }) {
      state.signature = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        const { id, username, signature, avatar } = payload;
        state.userId = id;
        state.username = username;
        state.signature = signature;
        state.avatar = avatar;
      })
      .addCase(uploadAvatar.fulfilled, (state, { payload }) => {
        state.avatar = payload;
      });
  },
});

export const { setIsAuth, setSignature } = userSlice.actions;

export default userSlice.reducer;
