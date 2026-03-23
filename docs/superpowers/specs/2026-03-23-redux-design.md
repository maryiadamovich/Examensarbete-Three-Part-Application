# Redux Integration Design

**Date:** 2026-03-23

## Context

The app uses separate Webpack bundles per page (multi-entry). Each page is an independent React tree, so each bundle gets its own Redux store — no cross-bundle store sharing.

Before this change, all state was `useState` + `useEffect` with API logic mixed into components. This design introduces Redux Toolkit to:
1. Demonstrate Redux best practices for the thesis
2. Separate API logic from components
3. Cache data within a page session (avoid re-fetching)
4. Persist Kendo Grid filter/pagination state across re-renders

---

## Packages Added

```
@reduxjs/toolkit
react-redux
```

---

## File Structure

```
frontend/src/
├── pages/
│   ├── home/
│   │   ├── index.jsx       (updated)
│   │   ├── homeSlice.js    (new)
│   │   └── store.js        (new)
│   ├── users/
│   │   ├── index.jsx       (updated)
│   │   ├── usersSlice.js   (new)
│   │   └── store.js        (new)
│   └── blog/
│       ├── index.jsx       (updated)
│       ├── blogSlice.js    (new)
│       └── store.js        (new)
└── base/
    └── index.jsx           (no change)
shared/api.js               (no change — API functions reused in thunks)
```

---

## State Shapes

### homeSlice
```js
{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  message: null,
  error: null
}
```

### usersSlice
```js
{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  data: [],
  total: 0,
  error: null,
  dataState: { skip: 0, take: 10, filter: null }   // persisted Kendo grid state
}
```

### blogSlice
```js
{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  posts: [],
  nextCursor: null,
  hasMore: true,
  error: null
}
```

---

## Data Flow Pattern

```
Component mounts
  → dispatch(thunkAction())
      → thunk calls existing api.js function
          → pending:   status = 'loading'
          → fulfilled: stores data, status = 'succeeded'
          → rejected:  stores error, status = 'failed'
Component reads state via useSelector
User interaction → dispatch(syncAction or thunkAction)
```

---

## Thunks

| Thunk | API call | Dispatched when |
|---|---|---|
| `fetchGreeting` | `api.fetchGreeting()` | Home mounts |
| `fetchUsers(dataState)` | `api.fetchUsers(...)` | dataState changes |
| `fetchMoreBlogs(cursor)` | `api.fetchBlogs(...)` | Mount + "Load more" / IntersectionObserver |

---

## Error Handling

All async errors are caught in `rejected` lifecycle cases in each slice. Components read `state.*.error` and render inline error messages. No try/catch in components.

---

## Redux DevTools

`configureStore` (RTK) auto-enables Redux DevTools in development — no extra config needed.
