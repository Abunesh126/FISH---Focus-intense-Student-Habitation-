import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import session from 'express-session';
import ConnectSQLite from 'connect-sqlite3';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import studyRoutes from './routes/study.js';
import taskRoutes from './routes/tasks.js';
import notesRoutes from './routes/notes.js';
import circlesRoutes from './routes/circles.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import leaderboardRoutes from './routes/leaderboard.js';
import healthRoutes from './routes/health.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fish-dev-secret-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);

// ─── Socket.io ──────────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('send-message', (data) => {
    io.to(data.room).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// ─── Rate limiters ──────────────────────────────────────────────────────────
// Strict limiter for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

// ─── CSRF origin guard ───────────────────────────────────────────────────────
// For state-mutating requests, verify the Origin matches the allowed frontend.
function csrfOriginGuard(req, res, next) {
  const method = req.method;
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  const origin = req.get('origin') || '';
  const referer = req.get('referer') || '';
  if (origin === FRONTEND_URL || referer.startsWith(FRONTEND_URL)) return next();
  return res.status(403).json({ message: 'CSRF check failed' });
}

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store backed by SQLite
const SQLiteStore = ConnectSQLite(session);
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: __dirname }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// Apply CSRF origin guard and general rate limiter to all /api routes
app.use('/api', apiLimiter, csrfOriginGuard);

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/health',      healthRoutes);
app.use('/api/auth',        authLimiter, authRoutes);
app.use('/api/user',        userRoutes);
app.use('/api/study',       studyRoutes);
app.use('/api/tasks',       taskRoutes);
app.use('/api/notes',       notesRoutes);
app.use('/api/circles',     circlesRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ─── Serve frontend in production ────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  const staticLimiter = rateLimit({ windowMs: 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false });
  app.use(express.static(frontendDist));
  app.get('*', staticLimiter, (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`FISH backend running on http://localhost:${PORT}`);
  console.log(`Demo account: demo@fish.edu / demo123`);
});

export { app, io };
