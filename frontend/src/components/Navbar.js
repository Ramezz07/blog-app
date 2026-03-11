import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  header: {
    background: '#0f0f0f',
    borderBottom: '3px solid #c0392b',
    position: 'sticky', top: 0, zIndex: 100
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px'
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem', fontWeight: 900,
    color: '#faf8f4', letterSpacing: '-0.5px'
  },
  brandAccent: { color: '#c0392b' },
  nav: { display: 'flex', gap: '8px', alignItems: 'center' },
  navLink: {
    color: '#ccc', fontSize: '0.875rem', fontWeight: 600,
    padding: '6px 14px', borderRadius: '4px',
    transition: 'color 0.2s', letterSpacing: '0.5px', textTransform: 'uppercase'
  },
  writeBtn: {
    background: '#c0392b', color: '#fff',
    padding: '7px 18px', borderRadius: '4px',
    fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px',
    textTransform: 'uppercase', border: 'none', transition: 'background 0.2s'
  },
  logoutBtn: {
    background: 'transparent', color: '#888',
    border: '1px solid #333', padding: '6px 14px',
    borderRadius: '4px', fontSize: '0.8rem', letterSpacing: '0.5px',
    textTransform: 'uppercase'
  }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <div style={styles.topBar}>
        <Link to="/">
          <span style={styles.brand}>THE<span style={styles.brandAccent}>BLOG</span></span>
        </Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
              <Link to="/create">
                <button style={styles.writeBtn}>+ Write</button>
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register">
                <button style={styles.writeBtn}>Get Started</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
