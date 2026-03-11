import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { background: '#fff', border: '1px solid #e0d8cc', borderRadius: '4px', padding: '48px', width: '100%', maxWidth: '420px' },
  eyebrow: { fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c0392b', fontWeight: 700, marginBottom: '12px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, marginBottom: '32px', color: '#0f0f0f' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', marginBottom: '20px', background: '#faf8f4' },
  btn: { width: '100%', padding: '14px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#888' },
  link: { color: '#c0392b', fontWeight: 700 },
  error: { background: '#fdecea', color: '#c0392b', padding: '12px 16px', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '20px', border: '1px solid #f5c6c0' }
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.eyebrow}>Join us today</p>
        <h1 style={s.title}>Create Account</h1>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} type="text" placeholder="Your name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Min. 6 characters"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={s.footer}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
