import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import request from '../utils/request';
import { UserInfo } from '../types';

interface UserState {
  isAuth: boolean,
  userId: number | null,
  username: string,
  signature: string,
  avatar: string,  
}

export const getUserInfo = createAsyncThunk('user/getUserInfo', async () => {
  const res = await request.get('/api/user/get_userinfo');
  return res?.data;
});

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: string | Blob) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const res = await request.post('/api/upload', formData, { headers });
    return res?.data;
  }
);

const initialState: UserState = {
  isAuth: Boolean(localStorage.getItem('token')),
  userId: null,
  username: '',
  signature: '',
  avatar: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setSignature(state, action: PayloadAction<string>) {
      state.signature = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        const { id, username, signature, avatar } = action.payload;
        state.userId = id;
        state.username = username;
        state.signature = signature;
        state.avatar = avatar;
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        state.avatar = action.payload;
      });
  },
});

export const { setIsAuth, setSignature } = userSlice.actions;

export default userSlice.reducer;
