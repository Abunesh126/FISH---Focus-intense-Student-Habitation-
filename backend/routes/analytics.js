import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// GET /api/analytics/dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  const userId = req.session.userId;

  const studyHoursRow = db.prepare(`
    SELECT COALESCE(
      ROUND(SUM(
        (JULIANDAY(COALESCE(completed_at, datetime('now'))) - JULIANDAY(started_at)) * 24
      ), 1), 0) AS hours
    FROM study_sessions
    WHERE user_id = ? AND started_at >= datetime('now', '-7 days')
  `).get(userId);

  const completedTasksRow = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE user_id = ? AND status = 'completed' AND updated_at >= datetime('now', '-7 days')
  `).get(userId);

  const streakRow = db.prepare(`
    SELECT COUNT(*) as count FROM (
      SELECT DISTINCT date(completed_at) as day
      FROM study_sessions
      WHERE user_id = ? AND completed_at IS NOT NULL
      ORDER BY day DESC LIMIT 30
    )
  `).get(userId);

  const scoreRow = db.prepare('SELECT score FROM leaderboard WHERE user_id = ?').get(userId);

  return res.json({
    study_hours_week: studyHoursRow.hours || 0,
    completed_tasks_week: completedTasksRow.count || 0,
    study_streak_days: streakRow.count || 0,
    focus_score_avg: Math.min(100, Math.round(70 + (scoreRow?.score || 0) / 200)),
  });
});

// GET /api/analytics/activity
router.get('/activity', requireAuth, (req, res) => {
  const { limit = 20 } = req.query;
  const activities = db.prepare(
    'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(req.session.userId, Number(limit));

  return res.json({
    activities: activities.map(a => ({
      ...a,
      metadata: JSON.parse(a.metadata || '{}'),
    })),
  });
});

// POST /api/analytics/performance
router.post('/performance', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const { dateRange } = req.body;

  const sessionsRow = db.prepare(
    "SELECT COUNT(*) as count FROM study_sessions WHERE user_id = ? AND completed_at IS NOT NULL"
  ).get(userId);

  const tasksRow = db.prepare(
    "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'"
  ).get(userId);

  return res.json({
    total_sessions: sessionsRow.count,
    total_tasks_completed: tasksRow.count,
    date_range: dateRange || null,
  });
});

export default router;
