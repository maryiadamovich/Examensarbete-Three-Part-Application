import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers } from '../../shared/api';

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchUsers',
  (dataState) => {
    const page = Math.floor(dataState.skip / dataState.take) + 1;
    return fetchUsers(page, dataState.take, dataState.filter);
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle',
    data: [],
    total: 0,
    error: null,
    dataState: { skip: 0, take: 20, filter: null },
  },
  reducers: {
    setDataState(state, action) {
      state.dataState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setDataState } = usersSlice.actions;
export default usersSlice.reducer;
