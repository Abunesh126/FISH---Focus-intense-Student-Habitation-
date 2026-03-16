import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// GET /api/tasks
router.get('/', requireAuth, (req, res) => {
  const { status, priority, limit = 100, offset = 0 } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.session.userId];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (priority) { query += ' AND priority = ?'; params.push(priority); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const tasks = db.prepare(query).all(...params);
  return res.json({ tasks });
});

// POST /api/tasks
router.post('/', requireAuth, (req, res) => {
  const { title, description = '', status = 'pending', priority = 'medium', due_date } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const result = db.prepare(
    'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.session.userId, title, description, status, priority, due_date || null);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  db.prepare("INSERT INTO activity_log (user_id, action, metadata) VALUES (?, 'task_created', ?)")
    .run(req.session.userId, JSON.stringify({ task_id: task.id, title }));

  return res.status(201).json({ task });
});

// PUT /api/tasks/:id
router.put('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.session.userId);
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  const { title, description, status, priority, due_date } = req.body;
  const updated = {
    title:       title       !== undefined ? title       : existing.title,
    description: description !== undefined ? description : existing.description,
    status:      status      !== undefined ? status      : existing.status,
    priority:    priority    !== undefined ? priority    : existing.priority,
    due_date:    due_date    !== undefined ? due_date    : existing.due_date,
    completed_at: (status === 'completed' && existing.status !== 'completed')
      ? new Date().toISOString()
      : (status && status !== 'completed' ? null : existing.completed_at),
  };

  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?,
    completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(updated.title, updated.description, updated.status, updated.priority,
         updated.due_date, updated.completed_at, id);

  if (status === 'completed' && existing.status !== 'completed') {
    db.prepare("INSERT INTO activity_log (user_id, action, metadata) VALUES (?, 'task_completed', ?)")
      .run(req.session.userId, JSON.stringify({ task_id: id }));

    // Award points
    db.prepare(`
      INSERT INTO leaderboard (user_id, username, score, last_active)
      VALUES (?, (SELECT first_name || '_' || id FROM users WHERE id = ?), 5, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET score = score + 5, last_active = CURRENT_TIMESTAMP
    `).run(req.session.userId, req.session.userId);
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return res.json({ task });
});

// DELETE /api/tasks/:id
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(id, req.session.userId);
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return res.json({ success: true });
});

export default router;
