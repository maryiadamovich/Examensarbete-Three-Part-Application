const API_BASE = 'http://localhost:3001';

function authHeaders(extra = {}) {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra };
}

async function handleResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/';
    throw new Error('Session expired');
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchUsers(page = 1, limit = 20, filter = null, sort = null) {
  const params = new URLSearchParams({ page, limit });
  if (filter) params.set('filter', JSON.stringify(filter));
  if (sort && sort.length) params.set('sort', JSON.stringify(sort));
  const res = await fetch(`${API_BASE}/api/users?${params}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateUser(id, { name, email, role }) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ name, email, role }),
  });
  return handleResponse(res);
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/api/settings`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchBlogs(limit = 10, cursor = null) {
  const params = new URLSearchParams({ limit });
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${API_BASE}/api/blogs?${params}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function createBlogPost(title, content) {
  const res = await fetch(`${API_BASE}/api/blogs`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

export async function fetchGreeting() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Failed to fetch greeting');
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }
  return res.json(); // { token, role, name }
}
