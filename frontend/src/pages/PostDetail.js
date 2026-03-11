import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, likePost, deletePost } from '../api';
import { useAuth } from '../context/AuthContext';

const styles = {
  wrapper: { maxWidth: '800px', margin: '0 auto', padding: '48px 24px' },
  backLink: { color: '#c0392b', fontSize: '0.875rem', fontWeight: 600, display: 'inline-block', marginBottom: '32px' },
  category: {
    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    padding: '3px 10px', background: '#c0392b', color: '#fff',
    borderRadius: '2px', marginBottom: '16px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 900, lineHeight: 1.2, marginBottom: '20px', color: '#0f0f0f'
  },
  meta: {
    display: 'flex', gap: '20px', color: '#888',
    fontSize: '0.875rem', marginBottom: '32px',
    paddingBottom: '24px', borderBottom: '2px solid #e0d8cc',
    flexWrap: 'wrap', alignItems: 'center'
  },
  author: { fontWeight: 700, color: '#0f0f0f' },
  divider: { color: '#ccc' },
  content: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '1.1rem', lineHeight: 1.85,
    color: '#2c2c2c', whiteSpace: 'pre-line', marginBottom: '40px'
  },
  actions: {
    display: 'flex', gap: '12px', alignItems: 'center',
    paddingTop: '24px', borderTop: '1px solid #e0d8cc'
  },
  likeBtn: {
    padding: '10px 24px', borderRadius: '4px',
    border: '2px solid #c0392b', background: 'transparent',
    color: '#c0392b', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
    transition: 'all 0.2s'
  },
  editBtn: {
    padding: '10px 20px', borderRadius: '4px',
    background: '#0f0f0f', color: '#fff',
    border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
  },
  deleteBtn: {
    padding: '10px 20px', borderRadius: '4px',
    background: '#c0392b', color: '#fff',
    border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
  },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '24px 0' },
  tag: {
    padding: '4px 12px', background: '#f2ede4', borderRadius: '20px',
    fontSize: '0.8rem', color: '#666', fontWeight: 600
  }
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    getPost(id).then(({ data }) => {
      setPost(data);
      setLikeCount(data.likes?.length || 0);
      if (user) setLiked(data.likes?.includes(user._id));
    }).catch(() => navigate('/'));
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    const { data } = await likePost(id);
    setLiked(data.liked);
    setLikeCount(data.likes);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      navigate('/');
    }
  };

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Loading...</div>
  );

  const isOwner = user && post.author?._id === user._id;

  return (
    <div style={styles.wrapper}>
      <Link to="/" style={styles.backLink}>← Back to all posts</Link>

      <span style={styles.category}>{post.category}</span>
      <h1 style={styles.title}>{post.title}</h1>

      <div style={styles.meta}>
        <span>By <span style={styles.author}>{post.author?.name}</span></span>
        <span style={styles.divider}>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span style={styles.divider}>·</span>
        <span>👁 {post.views} views</span>
        <span style={styles.divider}>·</span>
        <span>❤️ {likeCount} likes</span>
      </div>

      <p style={styles.content}>{post.content}</p>

      {post.tags?.length > 0 && (
        <div style={styles.tags}>
          {post.tags.map(tag => <span key={tag} style={styles.tag}>#{tag}</span>)}
        </div>
      )}

      <div style={styles.actions}>
        <button style={{
          ...styles.likeBtn,
          background: liked ? '#c0392b' : 'transparent',
          color: liked ? '#fff' : '#c0392b'
        }} onClick={handleLike}>
          {liked ? '❤️ Liked' : '🤍 Like'} ({likeCount})
        </button>
        {isOwner && (
          <>
            <Link to={`/edit/${id}`}><button style={styles.editBtn}>✏️ Edit</button></Link>
            <button style={styles.deleteBtn} onClick={handleDelete}>🗑 Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
