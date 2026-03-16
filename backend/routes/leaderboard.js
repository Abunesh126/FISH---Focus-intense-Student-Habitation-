import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

// GET /api/leaderboard
router.get('/', (req, res) => {
  const entries = db.prepare(
    'SELECT id, username, score FROM leaderboard ORDER BY score DESC LIMIT 20'
  ).all();
  return res.json(entries);
});

// POST /api/leaderboard/update  (auth required)
router.post('/update', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const { username, points = 0 } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required' });

  db.prepare(`
    INSERT INTO leaderboard (user_id, username, score, last_active)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET username = ?, score = score + ?, last_active = CURRENT_TIMESTAMP
  `).run(req.session.userId, username, points, username, points);

  return res.json({ success: true });
});

export default router;
