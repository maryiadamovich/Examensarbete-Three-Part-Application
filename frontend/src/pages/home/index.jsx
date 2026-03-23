import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { fetchGreetingThunk } from './homeSlice';

function HomePage() {
  const dispatch = useDispatch();
  const { status, message, error } = useSelector((state) => state.home);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGreetingThunk());
    }
  }, [dispatch, status]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Welcome</h1>
      <p style={styles.lead}>
        This application demonstrates React bundled with Webpack,
        served through ASP.NET Core MVC, fetching data from a Node.js API.
      </p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>API Status</h2>
        {error && <p style={styles.error}>Error: {error}</p>}
        {status === 'loading' && <p style={styles.muted}>Connecting to Node.js API...</p>}
        {status === 'succeeded' && (
          <p style={styles.success}>
            Node.js API is online &mdash; {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  heading: { fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' },
  lead: { color: '#475569', marginBottom: '2rem', lineHeight: '1.6' },
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    background: '#f8fafc',
  },
  cardTitle: { marginTop: 0, color: '#1e293b' },
  muted: { color: '#94a3b8' },
  success: { color: '#16a34a', fontWeight: '500' },
  error: { color: '#dc2626', fontWeight: '500' },
};

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}
