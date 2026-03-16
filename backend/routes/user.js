import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

// Auth guard middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

// GET /api/user/profile
router.get('/profile', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    preferences: JSON.parse(user.preferences || '{}'),
    created_at: user.created_at,
  });
});

// PUT /api/user/preferences
router.put('/preferences', requireAuth, (req, res) => {
  const { preferences } = req.body;
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ message: 'Preferences must be an object' });
  }

  const user = db.prepare('SELECT preferences FROM users WHERE id = ?').get(req.session.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const existing = JSON.parse(user.preferences || '{}');
  const merged = { ...existing, ...preferences };

  db.prepare('UPDATE users SET preferences = ? WHERE id = ?').run(
    JSON.stringify(merged),
    req.session.userId
  );

  return res.json({ success: true, preferences: merged });
});

export default router;
