import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

// POST /api/ai/conversation
router.post('/conversation', requireAuth, (req, res) => {
  const { title = 'New Conversation' } = req.body;
  const result = db.prepare(
    'INSERT INTO ai_conversations (user_id, title) VALUES (?, ?)'
  ).run(req.session.userId, title);

  const conversation = db.prepare('SELECT * FROM ai_conversations WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(conversation);
});

// POST /api/ai/message
router.post('/message', requireAuth, (req, res) => {
  const { conversation_id, role, content } = req.body;
  if (!conversation_id || !role || !content) {
    return res.status(400).json({ message: 'conversation_id, role, and content are required' });
  }

  // Verify conversation belongs to user
  const conversation = db.prepare(
    'SELECT id FROM ai_conversations WHERE id = ? AND user_id = ?'
  ).get(conversation_id, req.session.userId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const result = db.prepare(
    'INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, ?, ?)'
  ).run(conversation_id, role, content);

  const message = db.prepare('SELECT * FROM ai_messages WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(message);
});

// GET /api/ai/conversation/:id
router.get('/conversation/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const conversation = db.prepare(
    'SELECT * FROM ai_conversations WHERE id = ? AND user_id = ?'
  ).get(id, req.session.userId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const messages = db.prepare(
    'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC'
  ).all(id);

  return res.json({ ...conversation, messages });
});

export default router;
