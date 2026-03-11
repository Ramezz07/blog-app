import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

const CATEGORIES = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Sports', 'Entertainment', 'Other'];

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '48px 24px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, marginBottom: '32px', color: '#0f0f0f' },
  label: { display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', marginTop: '20px' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4', fontFamily: "'Source Sans 3', sans-serif" },
  textarea: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4', minHeight: '320px', resize: 'vertical', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.7 },
  select: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4' },
  actions: { display: 'flex', gap: '12px', marginTop: '32px' },
  publishBtn: { padding: '14px 32px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' },
  cancelBtn: { padding: '14px 24px', background: 'transparent', border: '1px solid #e0d8cc', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#666' },
  error: { background: '#fdecea', color: '#c0392b', padding: '12px 16px', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '20px' }
};

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'Technology', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await createPost({ ...form, tags });
      navigate(`/post/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Write a New Post</h1>
      {error && <div style={s.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Title *</label>
        <input style={s.input} placeholder="An engaging title..."
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

        <label style={s.label}>Excerpt * (short summary, max 300 chars)</label>
        <input style={s.input} placeholder="A brief summary of your post..."
          maxLength={300} value={form.excerpt}
          onChange={e => setForm({ ...form, excerpt: e.target.value })} required />

        <label style={s.label}>Category *</label>
        <select style={s.select} value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={s.label}>Content *</label>
        <textarea style={s.textarea} placeholder="Write your full post here..."
          value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />

        <label style={s.label}>Tags (comma separated)</label>
        <input style={s.input} placeholder="react, devops, aws"
          value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />

        <div style={s.actions}>
          <button style={s.publishBtn} type="submit" disabled={loading}>
            {loading ? 'Publishing...' : '🚀 Publish Post'}
          </button>
          <button style={s.cancelBtn} type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
