import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// POST /api/study/session/start
router.post('/session/start', requireAuth, (req, res) => {
  const { type = 'pomodoro' } = req.body;
  const result = db.prepare(
    'INSERT INTO study_sessions (user_id, type, started_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
  ).run(req.session.userId, type);

  const session = db.prepare('SELECT * FROM study_sessions WHERE id = ?').get(result.lastInsertRowid);

  // Log activity
  db.prepare("INSERT INTO activity_log (user_id, action, metadata) VALUES (?, 'study_session_start', ?)")
    .run(req.session.userId, JSON.stringify({ session_id: session.id, type }));

  return res.status(201).json(session);
});

// PUT /api/study/session/:id/complete
router.put('/session/:id/complete', requireAuth, (req, res) => {
  const { id } = req.params;
  const completed_at = req.body.completed_at || new Date().toISOString();

  const session = db.prepare(
    'SELECT * FROM study_sessions WHERE id = ? AND user_id = ?'
  ).get(id, req.session.userId);

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  db.prepare(
    'UPDATE study_sessions SET completed_at = ? WHERE id = ?'
  ).run(completed_at, id);

  // Award points on the leaderboard
  db.prepare(`
    INSERT INTO leaderboard (user_id, username, score, last_active)
    VALUES (?, (SELECT first_name || '_' || id FROM users WHERE id = ?), 10, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET score = score + 10, last_active = CURRENT_TIMESTAMP
  `).run(req.session.userId, req.session.userId);

  // Log activity
  db.prepare("INSERT INTO activity_log (user_id, action, metadata) VALUES (?, 'study_session_complete', ?)")
    .run(req.session.userId, JSON.stringify({ session_id: id }));

  return res.json({ success: true, completed_at });
});

// GET /api/study/sessions
router.get('/sessions', requireAuth, (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const sessions = db.prepare(
    'SELECT * FROM study_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?'
  ).all(req.session.userId, Number(limit), Number(offset));
  return res.json(sessions);
});

// GET /api/study/stats
router.get('/stats', requireAuth, (req, res) => {
  const userId = req.session.userId;

  const total = db.prepare(
    "SELECT COUNT(*) as count FROM study_sessions WHERE user_id = ? AND completed_at IS NOT NULL"
  ).get(userId);

  const today = db.prepare(
    "SELECT COUNT(*) as count FROM study_sessions WHERE user_id = ? AND completed_at IS NOT NULL AND date(completed_at) = date('now')"
  ).get(userId);

  // Simple streak: count consecutive days with completed sessions
  const days = db.prepare(
    "SELECT DISTINCT date(completed_at) as day FROM study_sessions WHERE user_id = ? AND completed_at IS NOT NULL ORDER BY day DESC LIMIT 30"
  ).all(userId);

  let streakDays = 0;
  const now = new Date();
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(now);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (days[i].day === expectedStr) {
      streakDays++;
    } else {
      break;
    }
  }

  return res.json({
    totalSessions: total.count,
    todaySessions: today.count,
    streakDays,
  });
});

export default router;
