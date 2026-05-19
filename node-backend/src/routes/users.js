const { Router } = require('express');
const db = require('../db');
const router = Router();

const ALLOWED_FIELDS = new Set(['id', 'name', 'email', 'role']);

function buildWhere(filter) {
  if (!filter || !filter.filters || filter.filters.length === 0) return { sql: '', params: [] };

  const clauses = [];
  const params = [];

  for (const f of filter.filters) {
    if (!ALLOWED_FIELDS.has(f.field) || f.value == null || f.value === '') continue;
    const col = f.field;
    switch (f.operator) {
      case 'contains':   clauses.push(`${col} LIKE ?`); params.push(`%${f.value}%`); break;
      case 'startswith': clauses.push(`${col} LIKE ?`); params.push(`${f.value}%`);  break;
      case 'endswith':   clauses.push(`${col} LIKE ?`); params.push(`%${f.value}`);  break;
      case 'eq':         clauses.push(`${col} = ?`);    params.push(f.value);        break;
      case 'neq':        clauses.push(`${col} != ?`);   params.push(f.value);        break;
    }
  }

  if (clauses.length === 0) return { sql: '', params: [] };
  const logic = filter.logic === 'or' ? ' OR ' : ' AND ';
  return { sql: 'WHERE ' + clauses.join(logic), params };
}

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ error: 'name, email, and role are required' });
  if (!['admin', 'editor', 'viewer'].includes(role)) return res.status(400).json({ error: 'role must be admin, editor, or viewer' });

  const result = db.prepare('UPDATE users SET name=?, email=?, role=? WHERE id=?').run(name, email, role, id);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });

  const updated = db.prepare('SELECT * FROM users WHERE id=?').get(id);
  res.json(updated);
});

router.get('/', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  let filter;
  try { filter = req.query.filter ? JSON.parse(req.query.filter) : null; }
  catch { filter = null; }

  const { sql: where, params } = buildWhere(filter);

  const ALLOWED_SORT_FIELDS = ['id', 'name', 'email', 'role'];
  let orderBy = '';
  try {
    const sort = req.query.sort ? JSON.parse(req.query.sort) : [];
    if (sort.length > 0) {
      const parts = sort
        .filter(s => ALLOWED_SORT_FIELDS.includes(s.field))
        .map(s => `${s.field} ${s.dir === 'desc' ? 'DESC' : 'ASC'}`);
      if (parts.length) orderBy = `ORDER BY ${parts.join(', ')}`;
    }
  } catch { /* ignore malformed sort */ }

  const users      = db.prepare(`SELECT * FROM users ${where} ${orderBy} LIMIT ? OFFSET ?`).all(...params, limit, offset);
  const { total }  = db.prepare(`SELECT COUNT(*) AS total FROM users ${where}`).get(...params);
  const totalPages = Math.ceil(total / limit);

  res.json({ users, total, page, limit, totalPages });
});

module.exports = router;
