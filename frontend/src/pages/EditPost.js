import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../api';

const CATEGORIES = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Sports', 'Entertainment', 'Other'];

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '48px 24px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, marginBottom: '32px' },
  label: { display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', marginTop: '20px' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4', fontFamily: "'Source Sans 3', sans-serif" },
  textarea: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4', minHeight: '320px', resize: 'vertical', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.7 },
  select: { width: '100%', padding: '12px 16px', border: '1px solid #e0d8cc', borderRadius: '4px', fontSize: '1rem', background: '#faf8f4' },
  actions: { display: 'flex', gap: '12px', marginTop: '32px' },
  saveBtn: { padding: '14px 32px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' },
  cancelBtn: { padding: '14px 24px', background: 'transparent', border: '1px solid #e0d8cc', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#666' }
};

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'Technology', tags: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPost(id).then(({ data }) => {
      setForm({
        title: data.title, content: data.content,
        excerpt: data.excerpt, category: data.category,
        tags: data.tags?.join(', ') || ''
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await updatePost(id, { ...form, tags });
      navigate(`/post/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Title *</label>
        <input style={s.input} value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} required />

        <label style={s.label}>Excerpt *</label>
        <input style={s.input} maxLength={300} value={form.excerpt}
          onChange={e => setForm({ ...form, excerpt: e.target.value })} required />

        <label style={s.label}>Category *</label>
        <select style={s.select} value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={s.label}>Content *</label>
        <textarea style={s.textarea} value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })} required />

        <label style={s.label}>Tags (comma separated)</label>
        <input style={s.input} value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })} />

        <div style={s.actions}>
          <button style={s.saveBtn} type="submit" disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button style={s.cancelBtn} type="button" onClick={() => navigate(`/post/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
