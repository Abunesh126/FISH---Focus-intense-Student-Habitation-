import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'fish.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL,
    first_name  TEXT    NOT NULL DEFAULT '',
    last_name   TEXT    NOT NULL DEFAULT '',
    preferences TEXT    NOT NULL DEFAULT '{}',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS study_sessions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         TEXT    NOT NULL DEFAULT 'pomodoro',
    started_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT    NOT NULL,
    description  TEXT    NOT NULL DEFAULT '',
    status       TEXT    NOT NULL DEFAULT 'pending',
    priority     TEXT    NOT NULL DEFAULT 'medium',
    due_date     TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS notes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL DEFAULT 'Untitled',
    content     TEXT    NOT NULL DEFAULT '',
    subject     TEXT    NOT NULL DEFAULT '',
    is_favorite INTEGER NOT NULL DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS circles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS circle_members (
    circle_id  INTEGER NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (circle_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS ai_conversations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL DEFAULT 'New Conversation',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ai_messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            TEXT    NOT NULL,
    content         TEXT    NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action     TEXT    NOT NULL,
    metadata   TEXT    NOT NULL DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username    TEXT    NOT NULL,
    score       INTEGER NOT NULL DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ─── Demo seed ──────────────────────────────────────────────────────────────
const DEMO_EMAIL = 'demo@fish.edu';
const DEMO_PASSWORD = 'demo123';

const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get(DEMO_EMAIL);
if (!existingDemo) {
  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const result = db.prepare(
    'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)'
  ).run(DEMO_EMAIL, hash, 'Demo', 'User');

  // Seed demo leaderboard entry
  db.prepare('INSERT OR IGNORE INTO leaderboard (user_id, username, score) VALUES (?, ?, ?)').run(
    result.lastInsertRowid, 'Demo_User', 500
  );

  // Seed some leaderboard entries for display
  const fakeUsers = [
    { email: 'deep@fish.edu', fn: 'Deep', ln: 'Work', username: 'DeepWork_Master', score: 9800 },
    { email: 'beta@fish.edu', fn: 'Scholar', ln: 'Beta', username: 'Scholar_Beta', score: 7400 },
    { email: 'focus@fish.edu', fn: 'Focus', ln: 'Queen', username: 'Focus_Queen', score: 6200 },
    { email: 'grind@fish.edu', fn: 'Study', ln: 'Grind', username: 'StudyGrind99', score: 5100 },
    { email: 'apex@fish.edu', fn: 'Apex', ln: 'Scholar', username: 'ApexScholar', score: 3900 },
  ];
  for (const u of fakeUsers) {
    const fakeHash = bcrypt.hashSync('placeholder', 6);
    const uid = db.prepare(
      'INSERT OR IGNORE INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)'
    ).run(u.email, fakeHash, u.fn, u.ln).lastInsertRowid;
    if (uid) {
      db.prepare('INSERT OR IGNORE INTO leaderboard (user_id, username, score) VALUES (?, ?, ?)').run(
        uid, u.username, u.score
      );
    }
  }
}

export default db;
