import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { fetchMoreBlogsThunk, prependPost } from './blogSlice';
import { createBlogPost } from '../../shared/api';

function PostItem({ dataItem }) {
  return (
    <div style={styles.post}>
      <h2 style={styles.postTitle}>{dataItem.title}</h2>
      <p style={styles.postMeta}>
        {new Date(dataItem.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </p>
      <p style={styles.postContent}>{dataItem.content}</p>
    </div>
  );
}

function AddPostModal({ onClose, onPublished }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const post = await createBlogPost(title.trim(), content.trim());
      onPublished(post);
    } catch (e) {
      setSubmitError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalTitle}>New Post</div>
        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          placeholder="Post title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label style={styles.label}>Content</label>
        <textarea
          style={styles.textarea}
          placeholder="Write your post..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        {submitError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{submitError}</p>}
        <div style={styles.modalActions}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            style={{ ...styles.publishBtn, opacity: submitting ? 0.7 : 1 }}
            onClick={handlePublish}
            disabled={submitting || !title.trim() || !content.trim()}
          >
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogPage() {
  const dispatch = useDispatch();
  const { status, posts, nextCursor, hasMore, error } = useSelector((state) => state.blog);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMoreBlogsThunk(null));
    }
  }, [dispatch, status]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && status !== 'loading') {
        dispatch(fetchMoreBlogsThunk(nextCursor));
      }
    }, { threshold: 0.1 });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current && observerRef.current.disconnect();
  }, [dispatch, hasMore, status, nextCursor]);

  if (error) return <p style={{ color: '#dc2626', padding: '2rem' }}>Error: {error}</p>;

  function handlePublished(post) {
    dispatch(prependPost(post));
    setModalOpen(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Blog</h1>
        <p style={styles.sub}>Latest posts from the team.</p>
        <div style={styles.headerRow}>
          <button style={styles.addBtn} onClick={() => setModalOpen(true)}>Add a new post</button>
        </div>
        {modalOpen && <AddPostModal onClose={() => setModalOpen(false)} onPublished={handlePublished} />}
        <div>
          {posts.map(post => (
            <PostItem key={post.id} dataItem={post} />
          ))}
        </div>
        <div ref={sentinelRef} style={{ height: 1 }} />
        {status === 'loading' && <p style={styles.status}>Loading...</p>}
        {!hasMore && status !== 'loading' && posts.length > 0 && (
          <p style={styles.status}>No more posts</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '2rem 1rem',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
    color: '#1e293b',
  },
  sub: {
    color: '#475569',
    marginBottom: '2rem',
  },
  post: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  postTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0',
  },
  postMeta: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '0 0 0.75rem 0',
  },
  postContent: {
    color: '#475569',
    lineHeight: '1.6',
    margin: 0,
  },
  status: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '1rem 0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },
  addBtn: {
    background: 'none',
    border: 'none',
    color: '#1e293b',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  modalTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    resize: 'vertical',
    minHeight: '100px',
    marginBottom: '1rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  cancelBtn: {
    padding: '0.4rem 0.9rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '0.85rem',
  },
  publishBtn: {
    padding: '0.4rem 0.9rem',
    background: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <BlogPage />
    </Provider>
  );
}
