import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers, updateUser } from '../../shared/api';

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchUsers',
  (dataState) => {
    const page = Math.floor(dataState.skip / dataState.take) + 1;
    return fetchUsers(page, dataState.take, dataState.filter, dataState.sort);
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  ({ id, data }) => updateUser(id, data)
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle',
    data: [],
    total: 0,
    error: null,
    dataState: { skip: 0, take: 20, filter: null, sort: [] },
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
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.data.findIndex((u) => u.id === updated.id);
        if (idx !== -1) state.data[idx] = updated;
      });
  },
});

export const { setDataState } = usersSlice.actions;
export default usersSlice.reducer;
