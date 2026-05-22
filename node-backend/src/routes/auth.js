const { Router } = require('express');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db     = require('../db');

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  const user = db
    .prepare('SELECT id, name, role, password_hash FROM users WHERE email = ?')
    .get(email);

  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;
