const { Router } = require('express');
const db = require('../db');
const router = Router();

router.get('/', (req, res) => {
  const limit  = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

  let posts;
  if (cursor) {
    posts = db.prepare(
      'SELECT * FROM posts WHERE id < ? ORDER BY id DESC LIMIT ?'
    ).all(cursor, limit);
  } else {
    posts = db.prepare(
      'SELECT * FROM posts ORDER BY id DESC LIMIT ?'
    ).all(limit);
  }

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  res.json({ posts, nextCursor });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const result = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title, content);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

module.exports = router;
