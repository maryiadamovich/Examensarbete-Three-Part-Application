const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'database.db');

// Ensure data/ directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role  TEXT NOT NULL
  )
`);

try {
  db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
} catch (e) {
  if (!e.message.includes('duplicate column name')) throw e;
}

// Seed 1000 users if table is empty
const count = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
if (count === 0) {
  const firstNames = ['Alice','Bob','Carol','David','Eva','Frank','Grace','Hans',
    'Ida','Johan','Karin','Lars','Maria','Nils','Olga','Per','Quin','Rita',
    'Sven','Tina','Ulf','Vera','Willy','Xena','Ylva','Zara'];
  const lastNames = ['Svensson','Lindqvist','Nilsson','Eriksson','Johansson',
    'Andersson','Karlsson','Larsson','Olsson','Persson','Gustafsson','Pettersson',
    'Jonsson','Jansson','Hansson','Bengtsson','Jönsson','Lindgren','Jakobsson'];
  const roles = ['admin','editor','viewer'];

  const insert = db.prepare(
    'INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)'
  );
  const insertMany = db.transaction(() => {
    for (let i = 1; i <= 1000; i++) {
      const first = firstNames[(i - 1) % firstNames.length];
      const last  = lastNames[(i - 1) % lastNames.length];
      const name  = `${first} ${last}`;
      const email = `user${i}@example.com`;
      const role  = roles[(i - 1) % roles.length];
      insert.run(i, name, email, role);
    }
  });
  insertMany();
  console.log('Database seeded with 1000 users.');
}

const SEED_HASH = bcrypt.hashSync('password', 4); // cost 4 for speed — demo data only
const usersWithoutHash = db.prepare('SELECT id FROM users WHERE password_hash IS NULL').all();
if (usersWithoutHash.length > 0) {
  const setHash = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
  db.transaction(() => {
    for (const u of usersWithoutHash) setHash.run(SEED_HASH, u.id);
  })();
  console.log(`Seeded password hashes for ${usersWithoutHash.length} users.`);
}

const demoAccounts = [
  { id: 1, email: 'admin@example.com',  password: 'Adm1n@2025!' },
  { id: 2, email: 'editor@example.com', password: 'Ed1t0r#2025!' },
  { id: 3, email: 'viewer@example.com', password: 'V1ew3r$2025!' },
];
const updateDemo = db.prepare('UPDATE users SET email = ?, password_hash = ? WHERE id = ?');
for (const { id, email, password } of demoAccounts) {
  updateDemo.run(email, bcrypt.hashSync(password, 10), id);
}

// Create posts table
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Seed 20 posts if table is empty
const postCount = db.prepare('SELECT COUNT(*) AS cnt FROM posts').get().cnt;
if (postCount === 0) {
  const insertPost = db.prepare(
    'INSERT INTO posts (title, content, created_at) VALUES (?, ?, ?)'
  );
  const seedPosts = db.transaction(() => {
    for (let i = 1; i <= 20; i++) {
      const date = new Date('2025-01-01');
      date.setDate(date.getDate() + (i - 1));
      const created_at = date.toISOString().replace('T', ' ').slice(0, 19);
      insertPost.run(
        `Post ${i}: Getting Started with Web Development`,
        `This is the full content of blog post number ${i}. It covers topics such as modern JavaScript, React components, and building scalable APIs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        created_at
      );
    }
  });
  seedPosts();
  console.log('Database seeded with 20 posts.');
}

module.exports = db;
