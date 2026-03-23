const API_BASE = 'http://localhost:3001';

export async function fetchUsers(page = 1, limit = 20, filter = null) {
  const params = new URLSearchParams({ page, limit });
  if (filter) params.set('filter', JSON.stringify(filter));
  const res = await fetch(`${API_BASE}/api/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/api/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function fetchBlogs(limit = 10, cursor = null) {
  const params = new URLSearchParams({ limit });
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${API_BASE}/api/blogs?${params}`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchGreeting() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Failed to fetch greeting');
  return res.json();
}
