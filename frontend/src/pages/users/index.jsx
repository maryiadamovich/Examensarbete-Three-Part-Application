import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import store from './store';
import { fetchUsersThunk, setDataState, updateUserThunk } from './usersSlice';


function UsersPage() {
  const dispatch = useDispatch();
  const { status, data, total, error, dataState } = useSelector((state) => state.users);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'Admin') {
      window.location.href = '/blog';
      return;
    }
    dispatch(fetchUsersThunk(dataState));
  }, [dispatch, dataState]);

  function enterEdit(dataItem) {
    setEditItem({ ...dataItem });
  }

  function handleSave() {
    dispatch(updateUserThunk({ id: editItem.id, data: { name: editItem.name, email: editItem.email, role: editItem.role } }));
    setEditItem(null);
  }

  function handleCancel() {
    setEditItem(null);
  }

  function handleFieldChange(field, value) {
    setEditItem((prev) => ({ ...prev, [field]: value }));
  }

  if (error) return <p style={{ color: '#dc2626', padding: '2rem' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '50%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>Users</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          List of users fetched from the Node.js API. Click a row to edit.
        </p>
        <Grid
          data={data}
          total={total}
          skip={dataState.skip}
          take={dataState.take}
          filter={dataState.filter}
          sort={dataState.sort || []}
          pageable={{ info: true, pageSizes: [20, 50, 100] }}
          filterable={{ mode: 'row' }}
          sortable={true}
          resizable
          onRowClick={(e) => { if (e.dataItem?.id != null) enterEdit(e.dataItem); }}
          onDataStateChange={(e) => dispatch(setDataState(e.dataState))}
        >
          <Column field="id"    title="ID"    filterable={false} />
          <Column field="name"  title="Name" />
          <Column field="email" title="Email" />
          <Column field="role"  title="Role" />
        </Grid>
        {status === 'loading' && (
          <p style={{ marginTop: '0.5rem', color: '#94a3b8' }}>Loading...</p>
        )}
      </div>

      {editItem && (
        <>
          <div
            onClick={handleCancel}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1000,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '1.5rem',
            width: '400px',
            zIndex: 1001,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#1e293b' }}>Edit User</h2>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['name', 'email'].map((field) => (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#475569' }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <input
                    value={editItem[field] ?? ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '1rem', color: '#1e293b' }}
                  />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#475569' }}>
                Role
                <select
                  value={editItem.role ?? 'viewer'}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '1rem', color: '#1e293b' }}
                >
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={handleCancel} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleSave} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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
