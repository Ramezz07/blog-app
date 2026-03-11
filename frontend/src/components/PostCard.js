import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Technology: '#2980b9', Travel: '#27ae60', Food: '#e67e22',
  Health: '#8e44ad', Business: '#2c3e50', Sports: '#16a085',
  Entertainment: '#c0392b', Other: '#7f8c8d'
};

const styles = {
  card: {
    background: '#fff', border: '1px solid #e0d8cc',
    borderRadius: '2px', overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column'
  },
  coverPlaceholder: {
    height: '180px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '2.5rem', background: '#f2ede4'
  },
  body: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
  category: {
    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    padding: '3px 10px', borderRadius: '2px', color: '#fff', marginBottom: '10px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35,
    marginBottom: '8px', color: '#0f0f0f'
  },
  excerpt: {
    color: '#666', fontSize: '0.875rem', lineHeight: 1.6,
    marginBottom: '16px', flex: 1,
    display: '-webkit-box', WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical', overflow: 'hidden'
  },
  meta: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: '12px',
    borderTop: '1px solid #f0ebe3', fontSize: '0.78rem', color: '#999'
  },
  author: { fontWeight: 600, color: '#555' },
  stats: { display: 'flex', gap: '12px' }
};

const CATEGORY_EMOJI = {
  Technology: '💻', Travel: '✈️', Food: '🍽️',
  Health: '💪', Business: '📊', Sports: '⚽',
  Entertainment: '🎬', Other: '📝'
};

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post._id}`}>
      <div style={styles.card}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ ...styles.coverPlaceholder, background: `${CATEGORY_COLORS[post.category]}18` }}>
          {CATEGORY_EMOJI[post.category] || '📝'}
        </div>
        <div style={styles.body}>
          <span style={{ ...styles.category, background: CATEGORY_COLORS[post.category] || '#7f8c8d' }}>
            {post.category}
          </span>
          <h3 style={styles.title}>{post.title}</h3>
          <p style={styles.excerpt}>{post.excerpt}</p>
          <div style={styles.meta}>
            <span style={styles.author}>By {post.author?.name || 'Anonymous'}</span>
            <div style={styles.stats}>
              <span>👁 {post.views}</span>
              <span>❤️ {post.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
