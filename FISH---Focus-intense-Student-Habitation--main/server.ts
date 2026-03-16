import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('scholarfocus.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    score INTEGER DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.use(express.json());

  // API Routes
  app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { title, description, due_date } = req.body;
    const info = db.prepare('INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)').run(title, description, due_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/tasks/:id', (req, res) => {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/leaderboard', (req, res) => {
    const board = db.prepare('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10').all();
    res.json(board);
  });

  app.post('/api/leaderboard/update', (req, res) => {
    const { username, points } = req.body;
    db.prepare(`
      INSERT INTO leaderboard (username, score) VALUES (?, ?)
      ON CONFLICT(username) DO UPDATE SET score = score + ?, last_active = CURRENT_TIMESTAMP
    `).run(username, points, points);
    res.json({ success: true });
  });

  app.get('/api/notes', (req, res) => {
    const notes = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
    res.json(notes);
  });

  app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    const info = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);
    res.json({ id: info.lastInsertRowid });
  });

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('send-message', (data) => {
      io.to(data.room).emit('receive-message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarFocus server running at http://localhost:${PORT}`);
  });
}

startServer();
