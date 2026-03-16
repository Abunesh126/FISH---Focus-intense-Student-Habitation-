import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// GET /api/circles
router.get('/', requireAuth, (req, res) => {
  const circles = db.prepare(`
    SELECT c.*, 
      (SELECT COUNT(*) FROM circle_members cm WHERE cm.circle_id = c.id) AS member_count,
      (SELECT 1 FROM circle_members cm2 WHERE cm2.circle_id = c.id AND cm2.user_id = ?) AS is_member
    FROM circles c ORDER BY c.created_at DESC
  `).all(req.session.userId);

  return res.json(circles.map(c => ({ ...c, is_member: !!c.is_member })));
});

// POST /api/circles
router.post('/', requireAuth, (req, res) => {
  const { name, description = '' } = req.body;
  if (!name) return res.status(400).json({ message: 'Circle name is required' });

  const result = db.prepare(
    'INSERT INTO circles (name, description, created_by) VALUES (?, ?, ?)'
  ).run(name, description, req.session.userId);

  // Creator automatically joins
  db.prepare('INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES (?, ?)').run(
    result.lastInsertRowid, req.session.userId
  );

  const circle = db.prepare('SELECT * FROM circles WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(circle);
});

// POST /api/circles/:id/join
router.post('/:id/join', requireAuth, (req, res) => {
  const { id } = req.params;
  const circle = db.prepare('SELECT id FROM circles WHERE id = ?').get(id);
  if (!circle) return res.status(404).json({ message: 'Circle not found' });

  db.prepare('INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES (?, ?)').run(
    id, req.session.userId
  );
  return res.json({ success: true });
});

// POST /api/circles/:id/leave
router.post('/:id/leave', requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM circle_members WHERE circle_id = ? AND user_id = ?').run(
    id, req.session.userId
  );
  return res.json({ success: true });
});

export default router;
