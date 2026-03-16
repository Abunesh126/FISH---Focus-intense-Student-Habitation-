import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../config/database.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  req.session.userId = user.id;

  const safeUser = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    preferences: JSON.parse(user.preferences || '{}'),
    created_at: user.created_at,
  };

  return res.json({ success: true, message: 'Logged in successfully', user: safeUser });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, first_name = '', last_name = '' } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)'
  ).run(email, hash, first_name, last_name);

  // Create a leaderboard entry for the new user
  db.prepare('INSERT OR IGNORE INTO leaderboard (user_id, username, score) VALUES (?, ?, 0)').run(
    result.lastInsertRowid,
    `${first_name || 'User'}_${result.lastInsertRowid}`
  );

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  req.session.userId = newUser.id;

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      preferences: {},
      created_at: newUser.created_at,
    },
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  if (!req.session.userId) {
    return res.json({ authenticated: false, user: null });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.json({ authenticated: false, user: null });
  }

  return res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      preferences: JSON.parse(user.preferences || '{}'),
      created_at: user.created_at,
    },
  });
});

export default router;
