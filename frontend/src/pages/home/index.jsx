import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { loginThunk } from './homeSlice';

function HomePage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.home);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      localStorage.setItem('authToken', result.payload.token);
      localStorage.setItem('userRole', result.payload.role);
      window.location.href = '/blog';
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Log in</h1>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user1@example.com"
        />
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && <p style={styles.error}>{error}</p>}
        <button
          style={{ ...styles.button, opacity: status === 'loading' ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Logging in…' : 'Log in'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #eff6ff 60%, #f5f3ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: '12px',
    padding: '2.5rem 2rem',
    width: '380px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  heading: { color: '#38bdf8ff', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 400 },
  label: { color: '#475569', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block' },
  input: {
    width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1',
    borderRadius: '6px', fontSize: '1rem', marginBottom: '1.5rem',
    boxSizing: 'border-box',
  },
  error: { color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem', marginTop: '-0.75rem' },
  button: {
    width: '100%', padding: '0.65rem', background: '#38bdf8ff',
    color: 'white', border: 'none', borderRadius: '6px',
    fontSize: '1rem', cursor: 'pointer', fontWeight: 500,
  },
};

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}
