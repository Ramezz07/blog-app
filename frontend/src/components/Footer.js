const styles = {
  footer: {
    background: '#0f0f0f', color: '#666',
    padding: '32px 24px', marginTop: '80px',
    textAlign: 'center', borderTop: '3px solid #c0392b'
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem', fontWeight: 900, color: '#faf8f4',
    marginBottom: '8px'
  },
  accent: { color: '#c0392b' },
  tagline: { fontSize: '0.85rem', color: '#555' }
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.brand}>THE<span style={styles.accent}>BLOG</span></div>
      <p style={styles.tagline}>Stories worth reading · © {new Date().getFullYear()}</p>
    </footer>
  );
}
