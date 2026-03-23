import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import store from './store';
import { fetchUsersThunk, setDataState } from './usersSlice';

function UsersPage() {
  const dispatch = useDispatch();
  const { status, data, total, error, dataState } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsersThunk(dataState));
  }, [dispatch, dataState]);

  if (error) return <p style={{ color: '#dc2626', padding: '2rem' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '50%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>Users</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          List of users fetched from the Node.js API.
        </p>
        <Grid
          data={data}
          total={total}
          skip={dataState.skip}
          take={dataState.take}
          filter={dataState.filter}
          pageable={{ info: true, pageSizes: [20, 50, 100] }}
          filterable={{ mode: 'row' }}
          resizable
          onDataStateChange={(e) => dispatch(setDataState(e.dataState))}
        >
          <Column field="id"    title="ID"    filterable={false} />
          <Column field="name"  title="Name"  />
          <Column field="email" title="Email" />
          <Column field="role"  title="Role"  />
        </Grid>
        {status === 'loading' && (
          <p style={{ marginTop: '0.5rem', color: '#94a3b8' }}>Loading...</p>
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <UsersPage />
    </Provider>
  );
}
