import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// GET /api/notes
router.get('/', requireAuth, (req, res) => {
  const { subject, limit = 100, offset = 0 } = req.query;
  let query = 'SELECT * FROM notes WHERE user_id = ?';
  const params = [req.session.userId];

  if (subject) { query += ' AND subject = ?'; params.push(subject); }

  query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const notes = db.prepare(query).all(...params);
  // Convert SQLite integer to boolean
  const mapped = notes.map(n => ({ ...n, is_favorite: !!n.is_favorite }));
  return res.json({ notes: mapped });
});

// POST /api/notes
router.post('/', requireAuth, (req, res) => {
  const { title = 'Untitled', content = '', subject = '' } = req.body;
  const result = db.prepare(
    'INSERT INTO notes (user_id, title, content, subject) VALUES (?, ?, ?, ?)'
  ).run(req.session.userId, title, content, subject);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ note: { ...note, is_favorite: !!note.is_favorite } });
});

// PUT /api/notes/:id
router.put('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(id, req.session.userId);
  if (!existing) return res.status(404).json({ message: 'Note not found' });

  const { title, content, subject, is_favorite } = req.body;
  const updated = {
    title:       title       !== undefined ? title       : existing.title,
    content:     content     !== undefined ? content     : existing.content,
    subject:     subject     !== undefined ? subject     : existing.subject,
    is_favorite: is_favorite !== undefined ? (is_favorite ? 1 : 0) : existing.is_favorite,
  };

  db.prepare(`
    UPDATE notes SET title = ?, content = ?, subject = ?, is_favorite = ?,
    updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(updated.title, updated.content, updated.subject, updated.is_favorite, id);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  return res.json({ note: { ...note, is_favorite: !!note.is_favorite } });
});

// DELETE /api/notes/:id
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM notes WHERE id = ? AND user_id = ?').get(id, req.session.userId);
  if (!existing) return res.status(404).json({ message: 'Note not found' });

  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return res.json({ success: true });
});

export default router;
