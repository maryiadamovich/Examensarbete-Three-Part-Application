import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGreeting } from '../../shared/api';

export const fetchGreetingThunk = createAsyncThunk(
  'home/fetchGreeting',
  () => fetchGreeting()
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    status: 'idle',
    message: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGreetingThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGreetingThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(fetchGreetingThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
