import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Eye, 
  Users, 
  Settings,
  Maximize2,
  Minimize2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components (to be created)
import Dashboard from './components/Dashboard';
import Pomodoro from './components/Pomodoro';
import TaskList from './components/TaskList';
import NoteEditor from './components/NoteEditor';
import Chatbot from './components/Chatbot';
import Leaderboard from './components/Leaderboard';
import FocusMonitor from './components/FocusMonitor';
import StudyCircles from './components/StudyCircles';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDeepWork, setIsDeepWork] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'tasks', label: 'Assignments', icon: CheckSquare },
    { id: 'notes', label: 'Rich Notes', icon: BookOpen },
    { id: 'chatbot', label: 'Socratic AI', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'focus', label: 'Bio-Focus', icon: Eye },
    { id: 'circles', label: 'Study Circles', icon: Users },
  ];

  const toggleDeepWork = () => {
    setIsDeepWork(!isDeepWork);
    if (!isDeepWork) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-500",
      isDeepWork ? "bg-slate-950" : "bg-[#FDFBF7]"
    )}>
      {/* Sidebar */}
      {!isDeepWork && (
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-secondary text-white flex flex-col p-6 sticky top-0 h-screen"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="text-secondary fill-secondary" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ScholarFocus</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-primary text-secondary font-semibold shadow-lg" 
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/70">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 p-8 overflow-y-auto",
        isDeepWork && "p-0 flex items-center justify-center"
      )}>
        {!isDeepWork && (
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-500">Welcome back, Scholar. Ready for deep work?</p>
            </div>
            <button 
              onClick={toggleDeepWork}
              className="flex items-center gap-2 bg-leather text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-leather/90 transition-all"
            >
              <Maximize2 size={20} />
              DEEP WORK MODE
            </button>
          </header>
        )}

        {isDeepWork && (
          <div className="fixed top-8 right-8 z-50">
            <button 
              onClick={toggleDeepWork}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10"
            >
              <Minimize2 size={24} />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isDeepWork ? '-deep' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(isDeepWork && "w-full max-w-4xl")}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'pomodoro' && <Pomodoro isDeepWork={isDeepWork} />}
            {activeTab === 'tasks' && <TaskList />}
            {activeTab === 'notes' && <NoteEditor />}
            {activeTab === 'chatbot' && <Chatbot />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'focus' && <FocusMonitor />}
            {activeTab === 'circles' && <StudyCircles />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
