import { createRoot } from 'react-dom/client';

function Nav() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/users', label: 'Users' },
    { href: '/blog', label: 'Blog' },
  ];

  const current = window.location.pathname;

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>MyApp</span>
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
