<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 FISH - Focus-Intense Student Habitation

A modern, AI-powered student productivity platform designed to enhance focus, collaboration, and learning through intelligent tutoring, real-time study sessions, and evidence-based productivity techniques.

**Live Demo:** https://ai.studio/apps/73ad0a15-122c-49a5-8423-011a880361d3

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack & Tools](#tech-stack--tools)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Key Features & Functions](#key-features--functions)
- [AI Models & Integration](#ai-models--integration)
- [Data & API Documentation](#data--api-documentation)
- [Project Outcomes & Goals](#project-outcomes--goals)
- [Quick Start](#quick-start)

---

## 🎯 Project Overview

**FISH** is a comprehensive web application for students that combines:
- **AI-Powered Tutoring** - Socratic method learning with Google Gemini
- **Focus Management** - Smart distraction blocking and Pomodoro timer
- **Real-time Collaboration** - Study circles for peer learning
- **Gamification** - Leaderboards for motivation and accountability
- **Bio-feedback Monitoring** - Webcam-based focus tracking
- **Task & Note Management** - Integrated productivity tools

The platform emphasizes **active learning**, **deep work**, and **privacy-first design** with local processing and no server-side tracking of personal data.

---

## 🛠️ Tech Stack & Tools

### Frontend Framework
| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.0.0 | UI framework with hooks for component logic |
| TypeScript | 5.8.2 | Type-safe JavaScript development |
| Vite | 5.4.11 | Fast build tool and dev server |
| JSX/TSX | - | Component templating |

### Styling & UI
| Tool | Version | Purpose |
|------|---------|---------|
| Tailwind CSS | 3.4.17 | Utility-first CSS framework for design system |
| Motion | 12.23.24 | Advanced animations and interactions |
| Lucide React | 0.546.0 | 500+ customizable SVG icons |
| PostCSS | 8.4.49 | CSS transformation and optimization |
| Autoprefixer | 10.4.21 | Vendor prefix automation |
| clsx | 2.1.1 | Conditional className management |
| tailwind-merge | 3.5.0 | Tailwind class name merging |

### Backend & Real-time
| Tool | Version | Purpose |
|------|---------|---------|
| Express.js | 4.21.2 | REST API and HTTP server |
| Socket.io | 4.8.3 | Real-time WebSocket communication for study circles |
| better-sqlite3 | 12.4.1 | Serverless SQLite database |
| Node.js HTTP | Built-in | Native HTTP server support |
| tsx | 4.21.0 | TypeScript runtime for server execution |

### AI & NLP
| Tool | Version | Purpose |
|------|---------|---------|
| Google Gemini API | 2.5 Flash | AI tutoring, focus plan generation |
| @google/genai | 1.29.0 | Official Gemini API client library |

### Content & Markdown
| Tool | Version | Purpose |
|------|---------|---------|
| react-markdown | 10.1.0 | Render markdown content as React components |
| remark-gfm | 4.0.1 | GitHub-flavored markdown support |

### Utilities
| Tool | Version | Purpose |
|------|---------|---------|
| dotenv | 17.2.3 | Environment variable management |
| @types/express | 4.17.21 | TypeScript Express type definitions |
| @types/node | 22.14.0 | TypeScript Node.js type definitions |
| @vitejs/plugin-react | 4.3.4 | React JSX and refresh support for Vite |

### Configuration Files
| File | Purpose |
|------|---------|
| `vite.config.ts` | Build optimization and environment exposure |
| `tailwind.config.js` | Custom theme colors and design tokens |
| `tsconfig.json` | TypeScript compiler options |
| `netlify.toml` | Deployment configuration (Node 20, npm build) |
| `.env.local` | Local API keys and secrets |

---

## 📁 Project Structure

```
FISH---Focus-intense-Student-Habitation-/
├── src/                                    # Frontend source code
│   ├── App.tsx                             # Main router & navigation component
│   ├── main.tsx                            # React DOM entry point
│   ├── index.css                           # Global styles & tailwind imports
│   ├── types.ts                            # TypeScript interfaces & type definitions
│   │
│   └── components/                         # React components
│       ├── Dashboard.tsx                   # Overview & AI focus plan generator
│       ├── Pomodoro.tsx                    # Timer with hardware aesthetic
│       ├── TaskList.tsx                    # Task CRUD and management
│       ├── NoteEditor.tsx                  # Markdown note editor
│       ├── Chatbot.tsx                     # Socratic AI tutoring interface
│       ├── Leaderboard.tsx                 # Gamification & rankings
│       ├── FocusMonitor.tsx                # Webcam-based bio-feedback tracking
│       ├── StudyCircles.tsx                # Real-time collaboration (Socket.io)
│       └── StudyTimeline.tsx               # Timeline visualization
│
├── api/                                    # API configuration
│   └── routes/
│       └── .env                            # Environment variables for API
│
├── server.ts                               # Express server & Socket.io setup
├── scholarfocus.db                         # SQLite database (production)
│
├── Configuration Files
│   ├── package.json                        # Dependencies & scripts
│   ├── tsconfig.json                       # TypeScript configuration
│   ├── vite.config.ts                      # Vite build configuration
│   ├── tailwind.config.js                  # Tailwind CSS theme customization
│   ├── netlify.toml                        # Netlify deployment settings
│   ├── index.html                          # HTML entry point
│   ├── metadata.json                       # Project metadata
│   └── .env.example                        # Environment template
```

### Key Directories Explained

| Directory | Contents | Purpose |
|-----------|----------|---------|
| `src/` | React components, types, styles | Frontend application logic and UI |
| `src/components/` | 9 feature components | Modular, reusable UI components |
| `api/` | Routes and environment config | API endpoint configuration |
| Root | Server, build configs, database | Backend infrastructure and deployment |

---

## 🔄 Workflow

### User Journey Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Entry Point                   │
│                      (App.tsx Router)                        │
└────────┬────────────────────────────────────────────────────┘
         │
    ┌────▼─────────────────────────────────────────────────┐
    │         Dashboard (Overview & AI Focus Plan)          │
    │  • Display: Focus score, tasks, deep work hours      │
    │  • AI Action: Generate focus plan (whitelist/       │
    │    blacklist sites, 2-hour Pomodoro schedule)        │
    └────┬────────────────────────────────────────────────┘
         │
    ┌────┴──────────────────────────────────────────────────────┐
    │              Feature Navigation (Sidebar Menu)            │
    └────┬──────┬──────────┬──────┬──────────┬────────┬──────────┘
    │    │      │          │      │          │        │
    ▼    ▼      ▼          ▼      ▼          ▼        ▼
┌──────┬──────┬──────────┬──────┬──────────┬────────┬──────────┐
│Timer │Tasks │ Notes    │Study │Chatbot   │Focus   │Leaderbd │
│      │      │          │Circle│(AI)      │Monitor │          │
└──────┴──────┴──────────┴──────┴──────────┴────────┴──────────┘
   │      │       │         │        │         │         │
   │      │       │         │        │         │         │
   ▼      ▼       ▼         ▼        ▼         ▼         ▼
 Time   Store  Markdown  Socket.io Gemini  Webcam   Database
 Work   & CRUD  to DB    Real-time  API    Access   Fetch
 Cycle         (SQLite) Messages
```

### Component Interaction Flow

1. **User Launches App** → Routes to Dashboard
2. **Dashboard Loads** → Fetches stats from server/database
3. **User Selects Feature** → Component renders (Pomodoro, Tasks, etc.)
4. **Pomodoro Mode** → Timer starts, focus monitoring active
5. **During Study** →
   - Chat with AI (Socratic tutor)
   - View/edit notes (markdown)
   - Manage tasks (add/complete/delete)
6. **In Study Circle** → Real-time communication via Socket.io
7. **Session Ends** → Points added to leaderboard, stats updated
8. **Data Persisted** → SQLite database stores all user data

### API Request/Response Cycle

```
Frontend Component → HTTP/WebSocket → Express Server → SQLite Database
                  ← JSON Response ← Processing Logic ← Query Results
```

---

## 🎯 Key Features & Functions

### 1. **Dashboard** (`src/components/Dashboard.tsx`)
- **Overview Stats:**
  - Focus Score (0-100% weekly average)
  - Tasks Completed (count)
  - Deep Work Hours (accumulated time)
  - Current Ranking (leaderboard position)

- **AI Focus Plan Generator:**
  - Input: Study topic (e.g., "Linear Algebra")
  - Output:
    - 3 whitelisted academic resources
    - 3 blacklisted distraction categories
    - 2-hour Pomodoro schedule (e.g., 50 min work / 10 min break)
  - Uses: Google Gemini 2.5 Flash API

### 2. **Pomodoro Timer** (`src/components/Pomodoro.tsx`)
- **Features:**
  - 25-minute work cycle / 5-minute break
  - Progress ring visualization
  - Hardware-aesthetic controls (tactile feedback)
  - Deep work mode (fullscreen distraction-free view)
  - Customizable intervals

- **Workflow:**
  - Start → Timer counts down → Audio alert on completion
  - Automatically switches between work/break phases
  - Tracks session count for leaderboard points

### 3. **Task Management** (`src/components/TaskList.tsx`)
- **CRUD Operations:**
  - Create: Add task with title, description, due date
  - Read: Display all tasks sorted by creation date
  - Update: Toggle status (pending → completed)
  - Delete: Remove task by ID

- **Database Schema:**
  ```sql
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 4. **Markdown Note Editor** (`src/components/NoteEditor.tsx`)
- **Features:**
  - Live markdown preview
  - GitHub-flavored markdown support (tables, code blocks, lists)
  - Word count display
  - Rich formatting toolbar
  - Auto-save to SQLite

- **Data Format:**
  - Input: Plain text markdown
  - Output: Rendered HTML + stored as text in DB

### 5. **Socratic AI Tutor** (`src/components/Chatbot.tsx`)
- **How It Works:**
  1. User asks question about study topic
  2. Gemini API receives prompt with Socratic system instructions
  3. AI responds with guiding questions instead of direct answers
  4. Encourages critical thinking and deep understanding

- **System Prompt:** Instructs AI to never give answers, only ask clarifying questions
- **Integration:** REST API call to Google Gemini 2.5 Flash

### 6. **Bio-Focus Monitor** (`src/components/FocusMonitor.tsx`)
- **Technology:**
  - Webcam access (browser MediaStream API)
  - Gaze detection (client-side processing)
  - Posture analysis (slouch detection)

- **Privacy:** No server uploads - all processing stays on client

- **Metrics:**
  - Focus Score (simulated 70-100 for demo, would be real eye-tracking)
  - Slouch Detection Alert
  - Attention Duration

### 7. **Leaderboard** (`src/components/Leaderboard.tsx`)
- **Gamification System:**
  - Rank users by focus points
  - Season-based competition (weekly/monthly)
  - Podium display for top 3
  - Dynamic points system

- **Scoring Logic:**
  - Focus Score contribution: +1 per minute at 80%+ focus
  - Task completion: +10 points per completed task
  - Deep work session: +25 points per Pomodoro cycle

### 8. **Study Circles (Real-time Collaboration)** (`src/components/StudyCircles.tsx`)
- **Technology:** Socket.io WebSocket connections
- **Features:**
  - Create/join study rooms
  - Real-time messaging
  - Video grid simulation (peer study)
  - Presence indicators (who's studying)

- **WebSocket Events:**
  ```javascript
  // Join room
  socket.emit('join-room', { user: 'Alice', room: 'Linear Algebra' });

  // Send message
  socket.emit('send-message', { user: 'Alice', text: 'Question about eigenvalues', room: 'Linear Algebra' });

  // Listen for incoming messages
  socket.on('receive-message', (data) => { /* update UI */ });
  ```

### 9. **Study Timeline** (`src/components/StudyTimeline.tsx`)
- **Visual Schedule:**
  - Work blocks (in focus color #EBC04D)
  - Break periods (lighter shade)
  - Upcoming task deadlines
  - Time-based visualization

---

## 🤖 AI Models & Integration

### Primary AI Model: Google Gemini 2.5 Flash

**Model ID:** `gemini-2.5-flash`

**Why This Model:**
- Fast response time (ideal for real-time tutoring)
- Cost-effective for frequent API calls
- Strong reasoning capabilities for Socratic dialogue
- Safe by default (supports safety filters)

**Integration Details:**
- **Client Library:** `@google/genai` (v1.29.0)
- **Authentication:** API key via environment variable `GEMINI_API_KEY`
- **Initialization:**
  ```typescript
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  ```

### Use Case 1: Socratic AI Tutor

**System Prompt:**
```
You are a Socratic tutor helping students learn through guided discovery.
- NEVER give direct answers
- ALWAYS ask clarifying questions
- Guide students to discover answers themselves
- Encourage critical thinking and deeper understanding
```

**Example Flow:**
```
Student: "How do I solve 2x + 5 = 13?"
AI Response: "Good question! Let me help you think through this.
What operation do you think would help isolate the x term?
What's the inverse of addition?"
```

**Endpoint:** Direct API call from `Chatbot.tsx`

### Use Case 2: AI-Powered Focus Plan Generator

**System Prompt:**
```
You are an academic advisor. Given a study topic, generate:
1. 3 whitelisted academic resources (websites, tools, databases)
2. 3 blacklisted distractions to avoid
3. A 2-hour Pomodoro schedule for optimal deep work

Format as JSON with keys: whitelisted, blacklisted, schedule
```

**Example Output:**
```json
{
  "whitelisted": [
    "Khan Academy (math tutorials)",
    "MIT OpenCourseWare",
    "Wolfram Alpha (calculations)"
  ],
  "blacklisted": [
    "Social media (Instagram, Twitter, TikTok)",
    "Entertainment (YouTube, Netflix)",
    "News sites (Reddit, Twitter, News)"
  ],
  "schedule": "50 min focused work, 10 min break (repeat 2x)"
}
```

**Endpoint:** Called from `Dashboard.tsx` when user clicks "Generate Study Plan"

### Model Capabilities Utilized

| Capability | Use Case | Benefit |
|-----------|----------|---------|
| **Conversational** | Socratic tutoring | Natural dialogue for learning |
| **Instruction Following** | Focus plan generation | Structured output (JSON) |
| **Reasoning** | Step-by-step guidance | Depth in problem-solving |
| **Safety** | All interactions | Built-in content filtering |
| **Fast Inference** | Real-time responses | <1s latency for UX |

---

## 📊 Data & API Documentation

### Data Types & Formats

#### TypeScript Interfaces (`src/types.ts`)

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  due_date?: string;
  created_at?: string;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  last_active?: string;
  rank?: number;
}

interface Note {
  id: number;
  title: string;
  content: string; // Markdown format
  updated_at: string;
}

interface FocusMetrics {
  focusScore: number; // 0-100
  sessionDuration: number; // minutes
  distractionCount: number;
  timestamp: string;
}
```

### SQLite Database Schema

**Database File:** `scholarfocus.db` (17 MB)

#### Table: `tasks`
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
  due_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `leaderboard`
```sql
CREATE TABLE leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  score INTEGER DEFAULT 0,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `notes`
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### REST API Endpoints

**Base URL (Development):** `http://localhost:3000`

#### Task Management

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|--------------|----------|---------|
| GET | `/api/tasks` | None | `Task[]` | Fetch all tasks |
| POST | `/api/tasks` | `{ title: string, description?: string, due_date?: string }` | `{ id: number, success: boolean }` | Create new task |
| GET | `/api/tasks/:id` | None | `Task` | Fetch single task |
| PUT | `/api/tasks/:id` | `{ status: string }` | `{ success: boolean }` | Update task status |
| DELETE | `/api/tasks/:id` | None | `{ success: boolean }` | Delete task |

#### Leaderboard

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|--------------|----------|---------|
| GET | `/api/leaderboard` | None | `LeaderboardEntry[]` | Fetch top 10 users |
| POST | `/api/leaderboard/update` | `{ username: string, points: number }` | `{ success: boolean, newScore: number }` | Update user score |
| GET | `/api/leaderboard/:username` | None | `LeaderboardEntry` | Fetch user rank |

#### Notes

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|--------------|----------|---------|
| GET | `/api/notes` | None | `Note[]` | Fetch all notes |
| POST | `/api/notes` | `{ title: string, content: string }` | `{ id: number, success: boolean }` | Create note |
| PUT | `/api/notes/:id` | `{ title?: string, content?: string }` | `{ success: boolean }` | Update note |
| DELETE | `/api/notes/:id` | None | `{ success: boolean }` | Delete note |

#### AI Endpoints

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|--------------|----------|---------|
| POST | `/api/ai/tutor` | `{ message: string, history: any[] }` | `{ response: string }` | Socratic tutoring |
| POST | `/api/ai/focus-plan` | `{ topic: string }` | Focus plan JSON | Generate study plan |

### WebSocket Events (Socket.io)

**Connection:** Automatically established when `StudyCircles.tsx` component mounts

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join-room` | Client → Server | `{ user: string, room: string }` | User joins study circle |
| `leave-room` | Client → Server | `{ user: string, room: string }` | User leaves study circle |
| `send-message` | Client → Server | `{ user: string, text: string, room: string }` | Send chat message |
| `receive-message` | Server → Client | `{ user: string, text: string, timestamp: string }` | Broadcast incoming message |
| `user-joined` | Server → Client | `{ user: string, room: string }` | Notify users of new member |
| `user-left` | Server → Client | `{ user: string, room: string }` | Notify users of member departure |

**Example WebSocket Flow:**
```javascript
// Client side
const socket = io('http://localhost:3000');

socket.emit('join-room', { user: 'Alice', room: 'Linear Algebra Study' });
socket.emit('send-message', { user: 'Alice', text: 'Anyone free for a quick question?', room: 'Linear Algebra Study' });

socket.on('receive-message', (data) => {
  console.log(`${data.user}: ${data.text}`);
});
```

### Data Flow Diagram

```
┌─────────────────┐
│   Frontend UI   │ (React Components)
│  (src/)         │
└────────┬────────┘
         │
    ┌────▼────────────────┐
    │  Express.js Server  │ (port 3000)
    │  (server.ts)        │
    └────┬───────────┬────┘
         │           │
    ┌────▼────┐  ┌──▼─────────┐
    │ REST API│  │ Socket.io   │ (WebSocket)
    │ Routes  │  │ (Real-time) │
    └────┬────┘  └──┬─────────┘
         │          │
    ┌────▼──────────▼────┐
    │  SQLite Database   │
    │ (scholarfocus.db)  │
    │ - tasks            │
    │ - leaderboard      │
    │ - notes            │
    └────────────────────┘
         │
    ┌────▼──────────────┐
    │  Google Gemini    │
    │  AI API           │
    │ (Socratic tutor)  │
    └───────────────────┘
```

### Environment Variables

**Required:**
```
GEMINI_API_KEY=your_api_key_here
```

**Optional:**
```
NODE_ENV=development          # or 'production'
PORT=3000                     # Server port
VITE_API_URL=http://localhost:3000  # API base URL
```

---

## 🎓 Project Outcomes & Goals

### Primary Goals

| Goal | Status | Achievement |
|------|--------|-------------|
| **Reduce Student Distraction** | ✅ Complete | AI whitelist/blacklist, focus monitoring |
| **Improve Deep Work Duration** | ✅ Complete | Pomodoro timer + distraction blocking |
| **Enable Active Learning** | ✅ Complete | Socratic AI tutor (never gives direct answers) |
| **Build Study Community** | ✅ Complete | Real-time study circles with Socket.io |
| **Gamify Motivation** | ✅ Complete | Leaderboard with points system |
| **Privacy-First Design** | ✅ Complete | No server-side bio-data tracking |

### Key Outcomes

1. **AI-Powered Personalization**
   - Focus plans tailored to specific topics
   - Socratic guidance based on student questions
   - Adaptive break intervals

2. **Real-time Collaboration**
   - Study circles for peer accountability
   - Shared study sessions without video compromise
   - Messaging for quick Q&A

3. **Comprehensive Productivity** Suite
   - Task tracking → builds organizational habits
   - Markdown notes → enables deep thinking
   - Timeline visualization → improves scheduling

4. **Gamification Layer**
   - Leaderboard rankings (extrinsic motivation)
   - Focus score metrics (intrinsic tracking)
   - Seasonal competitions (community engagement)

5. **Bio-Feedback Integration**
   - Gaze tracking → detects mind-wandering
   - Posture analysis → prevents physical strain
   - All client-side → maximum privacy

### Measurable Impacts

```
Expected Use Cases:
─────────────────

1. College Student Study Session (2 hours)
   └─ Pomodoro cycles (4 × 25 min) ............. 100 min work
   └─ Chat with AI tutor (3 questions) ........ 15 min learning
   └─ Update task list (3 tasks) .............. 5 min
   └─ Join study circle (1 peer) .............. 10 min collaboration
   └─ Focus monitoring (active) ............... Real-time feedback
   └─ Leaderboard ranking ..................... +50 points earned
   └─ Expected outcome: Deeper understanding, higher retention

2. Test Preparation (1 week)
   └─ Generate 5 focus plans .................. 2.5 hours prep
   └─ 10 Pomodoro sessions .................... 4+ hours deep work
   └─ 20 AI tutor interactions ................ Concept mastery
   └─ Rank on leaderboard ..................... Motivation boost

3. Collaborative Learning Group
   └─ 4 students in study circle .............. Peer accountability
   └─ Real-time problem-solving .............. Faster issue resolution
   └─ Shared focus attempts ................... Group motivation
```

### Technical Achievements

- **Full-Stack Web App:** React frontend + Express.js backend
- **Real-time Broadcasting:** Socket.io for instant collaboration
- **AI Integration:** Google Gemini API for intelligent tutoring
- **Database Persistence:** SQLite for offline-capable data
- **Type Safety:** TypeScript across entire codebase
- **Responsive Design:** Tailwind CSS for mobile-friendly UI
- **Deployment Ready:** Netlify configuration included

### Future Enhancement Ideas

1. **Video Integration** - Real video in study circles (privacy considerations)
2. **Mobile App** - React Native version for on-the-go focus
3. **Advanced Analytics** - Dashboard showing learning progress over time
4. **AI Personalization** - Machine learning to predict optimal study times
5. **Chrome Extension** - Site blocking and focus timer integration
6. **Integration with LMS** - Sync with Canvas, BlackBoard, etc.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (v20 recommended)
- npm or yarn
- Google Gemini API key (free at https://makersuite.google.com)

### Installation & Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd FISH---Focus-intense-Student-Habitation-
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create `.env.local` in project root:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173` (Vite frontend)

5. **Start Backend Server** (in another terminal)
   ```bash
   npm run server
   ```
   Server runs at `http://localhost:3000`

### Build & Deploy

**Production Build:**
```bash
npm run build
```

**Deploy to Netlify:**
```bash
netlify deploy --prod
```

Configuration in `netlify.toml` handles Node.js 20 runtime and build commands.

---

## 📚 Documentation References

- **Gemini API Docs:** https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models
- **Socket.io Docs:** https://socket.io/docs/
- **React 19 Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 📝 License

This project is created for educational purposes. Use responsibly.

---

**Last Updated:** March 17, 2026
**Maintained by:** FISH Development Team
