import { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';

const CATEGORIES = ['All', 'Technology', 'Travel', 'Food', 'Health', 'Business', 'Sports', 'Entertainment', 'Other'];

const styles = {
  hero: {
    background: '#0f0f0f',
    padding: '80px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #222'
  },
  heroEyebrow: {
    fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase',
    color: '#c0392b', fontWeight: 700, marginBottom: '16px'
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 900, color: '#faf8f4',
    lineHeight: 1.1, marginBottom: '20px'
  },
  heroSub: { color: '#888', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' },
  filterBar: {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
    marginBottom: '40px', alignItems: 'center'
  },
  filterBtn: {
    padding: '7px 18px', borderRadius: '20px', border: '1px solid #e0d8cc',
    background: '#fff', fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px'
  },
  searchInput: {
    padding: '8px 16px', border: '1px solid #e0d8cc', borderRadius: '20px',
    fontSize: '0.875rem', marginLeft: 'auto', width: '220px', background: '#fff'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '28px'
  },
  empty: {
    textAlign: 'center', padding: '80px 24px',
    color: '#999', gridColumn: '1/-1'
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '16px' },
  pagination: {
    display: 'flex', gap: '8px', justifyContent: 'center',
    marginTop: '48px', alignItems: 'center'
  },
  pageBtn: {
    padding: '8px 16px', border: '1px solid #e0d8cc',
    borderRadius: '4px', background: '#fff', fontSize: '0.875rem',
    cursor: 'pointer', transition: 'all 0.2s'
  }
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await getPosts(params);
      setPosts(data.posts);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, category, page]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchPosts(); }, 500);
    return () => clearTimeout(timer);
  }, [fetchPosts, search]);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <p style={styles.heroEyebrow}>Independent Publishing</p>
        <h1 style={styles.heroTitle}>Stories That<br /><em>Matter</em></h1>
        <p style={styles.heroSub}>Discover thoughtful writing on technology, culture, life and everything in between.</p>
      </div>

      {/* Main content */}
      <main style={styles.main}>
        {/* Filter & Search */}
        <div style={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              style={{
                ...styles.filterBtn,
                background: category === cat ? '#0f0f0f' : '#fff',
                color: category === cat ? '#fff' : '#555',
                borderColor: category === cat ? '#0f0f0f' : '#e0d8cc'
              }}
              onClick={() => { setCategory(cat); setPage(1); }}>
              {cat}
            </button>
          ))}
          <input style={styles.searchInput} placeholder="🔍  Search posts..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Loading posts...
          </div>
        ) : (
          <div style={styles.grid}>
            {posts.length > 0 ? posts.map(post => (
              <PostCard key={post._id} post={post} />
            )) : (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>📭</div>
                <p>No posts found. Be the first to write!</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1}
              onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ color: '#888', fontSize: '0.875rem' }}>
              Page {page} of {totalPages}
            </span>
            <button style={styles.pageBtn} disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
