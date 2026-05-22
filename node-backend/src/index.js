const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const settingsRouter = require('./routes/settings');
const blogsRouter = require('./routes/blogs');
const requireAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Node.js API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', requireAuth, usersRouter);
app.use('/api/settings', requireAuth, settingsRouter);
app.use('/api/blogs', requireAuth, blogsRouter);

app.listen(PORT, () => {
  console.log(`Node.js API listening on http://localhost:${PORT}`);
});
