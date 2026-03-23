const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

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
