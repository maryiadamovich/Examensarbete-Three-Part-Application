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

router.get('/', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  let filter;
  try { filter = req.query.filter ? JSON.parse(req.query.filter) : null; }
  catch { filter = null; }

  const { sql: where, params } = buildWhere(filter);

  const users      = db.prepare(`SELECT * FROM users ${where} LIMIT ? OFFSET ?`).all(...params, limit, offset);
  const { total }  = db.prepare(`SELECT COUNT(*) AS total FROM users ${where}`).get(...params);
  const totalPages = Math.ceil(total / limit);

  res.json({ users, total, page, limit, totalPages });
});

module.exports = router;
