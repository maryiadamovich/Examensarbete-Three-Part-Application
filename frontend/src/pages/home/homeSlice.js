import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../shared/api';

export const loginThunk = createAsyncThunk(
  'home/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginUser(email, password);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: { status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending,   (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginThunk.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(loginThunk.rejected,  (state, action) => {
        state.status = 'failed';
        state.error  = action.payload ?? 'Login failed';
      });
  },
});

export default homeSlice.reducer;
