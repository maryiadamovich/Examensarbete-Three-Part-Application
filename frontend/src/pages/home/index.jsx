import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function HomePage() {
  const [role, setRole] = useState('viewer');

  function handleLogin() {
    localStorage.setItem('userRole', role);
    window.location.href = '/blog';
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Log in</h1>
        <label style={styles.label}>User role</label>
        <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button style={styles.button} onClick={handleLogin}>Log in</button>
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
  select: {
    width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1',
    borderRadius: '6px', fontSize: '1rem', marginBottom: '1.5rem',
  },
  button: {
    width: '100%', padding: '0.65rem', background: '#38bdf8ff',
    color: 'white', border: 'none', borderRadius: '6px',
    fontSize: '1rem', cursor: 'pointer', fontWeight: 500,
  },
};

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(<HomePage />);
}
