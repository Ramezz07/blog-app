import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { background: '#fff', border: '1px solid #e0d8cc', borderRadius: '4px', padding: '48px', width: '100%', maxWidth: '420px' },
  eyebrow: { fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c0392b', fontWeight: 700, marginBottom: '12px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, marginBottom: '32px', color: '#0f0f0f' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', marginBottom: '20px', background: '#faf8f4', transition: 'border-color 0.2s' },
  btn: { width: '100%', padding: '14px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#888' },
  link: { color: '#c0392b', fontWeight: 700 },
  error: { background: '#fdecea', color: '#c0392b', padding: '12px 16px', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '20px', border: '1px solid #f5c6c0' }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Welcome back</p>
        <h1 style={styles.title}>Sign In</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}
