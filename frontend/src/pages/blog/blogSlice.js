import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBlogs } from '../../shared/api';

const PAGE_LIMIT = 5;

export const fetchMoreBlogsThunk = createAsyncThunk(
  'blog/fetchMoreBlogs',
  (cursor) => fetchBlogs(PAGE_LIMIT, cursor)
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    status: 'idle',
    posts: [],
    nextCursor: null,
    hasMore: true,
    error: null,
  },
  reducers: {
    reset(state) {
      state.status = 'idle';
      state.posts = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.error = null;
    },
    prependPost(state, action) {
      state.posts = [action.payload, ...state.posts];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoreBlogsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMoreBlogsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = [...state.posts, ...action.payload.posts];
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.nextCursor !== null;
      })
      .addCase(fetchMoreBlogsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reset, prependPost } = blogSlice.actions;
export default blogSlice.reducer;
