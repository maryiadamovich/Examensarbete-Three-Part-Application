import { createRoot } from 'react-dom/client';

function Nav() {
  const current = window.location.pathname;
  const role = localStorage.getItem('userRole');

  if (!role && current !== '/') {
    window.location.href = '/';
    return null;
  }

  const links = [];
  if (role && current !== '/') {
    links.push({ href: '/blog', label: 'Blog' });
    if (role === 'Admin') {
      links.push({ href: '/users', label: 'Users' });
    }
  }

  return (
    <nav style={styles.nav}>
      <a href="/" style={styles.brand}>MyApp</a>
      <ul style={styles.list}>
        {links.map(({ href, label }) => (
          <li key={href} style={styles.item}>
            <a
              href={href}
              style={{
                ...styles.link,
                ...(current === href ? styles.active : {}),
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '0.75rem 1.5rem',
    background: '#1e293b',
    color: '#f8fafc',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    letterSpacing: '0.05em',
    color: '#f8fafc',
    textDecoration: 'none',
  },
  list: {
    display: 'flex',
    gap: '1rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {},
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: '500',
  },
  active: {
    color: '#f8fafc',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '2px',
  },
};

const container = document.getElementById('nav');
if (container) {
  createRoot(container).render(<Nav />);
}
