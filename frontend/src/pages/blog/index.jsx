import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { fetchMoreBlogsThunk } from './blogSlice';

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

function BlogPage() {
  const dispatch = useDispatch();
  const { status, posts, nextCursor, hasMore, error } = useSelector((state) => state.blog);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Blog</h1>
        <p style={styles.sub}>Latest posts from the team.</p>
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
};

const container = document.getElementById('content');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <BlogPage />
    </Provider>
  );
}
