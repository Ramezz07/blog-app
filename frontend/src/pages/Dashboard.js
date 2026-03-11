import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost, getMyStats } from '../api';
import { useAuth } from '../context/AuthContext';

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: '#0f0f0f' },
  subtitle: { color: '#888', fontSize: '0.875rem', marginTop: '4px' },
  writeBtn: { padding: '12px 24px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' },
  statCard: { background: '#fff', border: '1px solid #e0d8cc', borderRadius: '4px', padding: '24px', textAlign: 'center' },
  statVal: { fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: '#0f0f0f' },
  statLabel: { color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0d8cc' },
  postRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0ebe3', gap: '16px' },
  postTitle: { fontWeight: 600, color: '#0f0f0f', fontSize: '0.95rem', flex: 1 },
  postMeta: { color: '#999', fontSize: '0.8rem', marginTop: '4px' },
  rowActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  editBtn: { padding: '6px 14px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' },
  deleteBtn: { padding: '6px 14px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', color: '#aaa' }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [postsRes, statsRes] = await Promise.all([getPosts({ limit: 50 }), getMyStats()]);
      const myPosts = postsRes.data.posts.filter(p => p.author?._id === user._id);
      setPosts(myPosts);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deletePost(id);
      load();
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Dashboard</h1>
          <p style={s.subtitle}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/create" style={s.writeBtn}>+ New Post</Link>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { val: stats.totalPosts, label: 'Total Posts' },
          { val: stats.totalViews, label: 'Total Views' },
          { val: stats.totalLikes, label: 'Total Likes' }
        ].map(({ val, label }) => (
          <div key={label} style={s.statCard}>
            <div style={s.statVal}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* My Posts */}
      <h2 style={s.sectionTitle}>My Posts ({posts.length})</h2>
      {loading ? (
        <div style={s.empty}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✍️</div>
          <p>No posts yet. Write your first post!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post._id} style={s.postRow}>
            <div>
              <div style={s.postTitle}>{post.title}</div>
              <div style={s.postMeta}>
                {post.category} · 👁 {post.views} · ❤️ {post.likes?.length || 0} ·{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={s.rowActions}>
              <Link to={`/post/${post._id}`}><button style={{ ...s.editBtn, background: 'transparent', color: '#555', border: '1px solid #e0d8cc' }}>View</button></Link>
              <Link to={`/edit/${post._id}`}><button style={s.editBtn}>Edit</button></Link>
              <button style={s.deleteBtn} onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
