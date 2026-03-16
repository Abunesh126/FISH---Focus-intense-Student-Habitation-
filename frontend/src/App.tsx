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
  Fish,
  Bell,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Dashboard from './components/Dashboard';
import Pomodoro from './components/Pomodoro';
import TaskList from './components/TaskList';
import NoteEditor from './components/NoteEditor';
import Chatbot from './components/Chatbot';
import Leaderboard from './components/Leaderboard';
import FocusMonitor from './components/FocusMonitor';
import StudyCircles from './components/StudyCircles';
import LoginModal from './components/LoginModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Main App Component with Authentication Integration
 */
function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDeepWork, setIsDeepWork] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [notifications, setNotifications] = useState(0);

  // Check for notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch real notification count from API
      setNotifications(3);
    } else {
      setNotifications(0);
    }
  }, [isAuthenticated]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your learning overview' },
    { id: 'pomodoro', label: 'Focus Timer', icon: Timer, description: 'Deep work sessions' },
    { id: 'tasks', label: 'Assignments', icon: CheckSquare, description: 'Track your work' },
    { id: 'notes', label: 'Knowledge Base', icon: BookOpen, description: 'Smart note-taking' },
    { id: 'chatbot', label: 'AI Tutor', icon: MessageSquare, description: 'Socratic learning' },
    { id: 'leaderboard', label: 'Community', icon: Trophy, description: 'Study rankings' },
    { id: 'focus', label: 'Analytics', icon: Eye, description: 'Performance insights' },
    { id: 'circles', label: 'Study Groups', icon: Users, description: 'Collaborative learning' },
  ];

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('dashboard'); // Reset to default tab
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Handle settings click
   */
  const handleSettingsClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      // TODO: Open settings modal
      console.log('Opening settings...');
    }
  };

  /**
   * Toggle deep work mode with fullscreen
   */
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

  /**
   * Handle navigation item clicks
   */
  const handleNavigation = (tabId) => {
    if (!isAuthenticated && tabId !== 'dashboard') {
      setShowLogin(true);
      return;
    }
    setActiveTab(tabId);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F8F6F2] to-[#F5F1E8]">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-primary to-leather rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Fish className="text-white" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-700">Loading FISH Platform...</h2>
        </div>
      </div>
    );
  }

  const currentPage = navItems.find(item => item.id === activeTab);

  return (
    <div className={cn(
      "min-h-screen flex transition-all duration-700 ease-out",
      isDeepWork ? "bg-slate-950" : "bg-gradient-to-br from-[#FDFBF7] via-[#F8F6F2] to-[#F5F1E8]"
    )}>
      {/* Enhanced Sidebar */}
      {!isDeepWork && (
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-gradient-to-b from-secondary via-slate-800 to-slate-900 text-white flex flex-col relative overflow-hidden"
        >
          {/* Sidebar Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-leather/10 blur-[80px] rounded-full" />
          
          {/* Header */}
          <div className="relative z-10 p-8 border-b border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary to-leather rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Fish className="text-white" size={28} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  FISH
                </h1>
                <p className="text-xs text-white/50 uppercase tracking-widest font-medium">
                  Focus Platform
                </p>
              </div>
            </div>
            
            {/* User Info - Show login button or user profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-leather rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-white/60">Student</p>
                </div>
                <div className="relative">
                  <Bell size={18} className="text-white/70" />
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-900">{notifications}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowLogin(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl border border-primary/30 text-white hover:bg-primary/30 transition-all"
              >
                <div className="w-10 h-10 bg-primary/30 rounded-xl flex items-center justify-center">
                  <LogIn size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Sign In</p>
                  <p className="text-xs text-white/60">Access your account</p>
                </div>
              </motion.button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 relative z-10">
            {navItems.map((item) => {
              const isRestricted = !isAuthenticated && item.id !== 'dashboard';
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                    activeTab === item.id && isAuthenticated
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-white border border-primary/30 shadow-lg" 
                      : isRestricted
                      ? "hover:bg-white/5 text-white/50 hover:text-white/70 border border-transparent cursor-pointer"
                      : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                  )}
                  title={isRestricted ? "Login required to access this feature" : item.description}
                >
                  {activeTab === item.id && isAuthenticated && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={cn(
                    "p-2 rounded-xl transition-all relative z-10",
                    activeTab === item.id && isAuthenticated ? "bg-primary/20 text-primary" : "group-hover:bg-white/10"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 text-left relative z-10">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      {item.label}
                      {isRestricted && <span className="text-xs px-2 py-1 bg-white/10 rounded-full">Login</span>}
                    </p>
                    <p className="text-xs opacity-60">{item.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 relative z-10 space-y-3">
            <button 
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-white/70 hover:text-white transition-all"
            >
              <Settings size={20} />
              <span className="font-medium">Settings & Preferences</span>
            </button>
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 text-white/70 hover:text-primary transition-all"
              >
                <LogIn size={20} />
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isDeepWork && "p-0 flex items-center justify-center"
      )}>
        {!isDeepWork && (
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center p-8 pb-4 bg-gradient-to-r from-white/20 via-transparent to-transparent backdrop-blur-sm"
          >
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">
                {currentPage?.label || 'Dashboard'}
              </h2>
              <p className="text-slate-600 text-lg">
                {isAuthenticated 
                  ? (currentPage?.description || 'Welcome back, ready to learn?')
                  : 'Explore the FISH learning platform'
                }
              </p>
            </div>
            
            <motion.button 
              onClick={toggleDeepWork}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-gradient-to-r from-leather to-leather/90 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 animate-glow"
            >
              <Maximize2 size={22} />
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-wider">Deep Work</p>
                <p className="text-xs opacity-80">Distraction-Free Mode</p>
              </div>
            </motion.button>
          </motion.header>
        )}

        {isDeepWork && (
          <div className="fixed top-8 right-8 z-50">
            <motion.button 
              onClick={toggleDeepWork}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/10 transition-all"
            >
              <Minimize2 size={24} />
            </motion.button>
          </div>
        )}

        {/* Dynamic Content */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          !isDeepWork && "px-8 pb-8"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isDeepWork ? '-deep' : '')}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(isDeepWork && "w-full max-w-6xl mx-auto")}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'pomodoro' && (isAuthenticated ? <Pomodoro isDeepWork={isDeepWork} /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'tasks' && (isAuthenticated ? <TaskList /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'notes' && (isAuthenticated ? <NoteEditor /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'chatbot' && (isAuthenticated ? <Chatbot /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'leaderboard' && (isAuthenticated ? <Leaderboard /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'focus' && (isAuthenticated ? <FocusMonitor /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
              {activeTab === 'circles' && (isAuthenticated ? <StudyCircles /> : <LoginRequired onLogin={() => setShowLogin(true)} />)}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Login Modal */}
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
        />
      </main>
    </div>
    );
}

/**
 * Login Required Component
 */
const LoginRequired = ({ onLogin }) => {
  return (
    <div className="text-center p-8 max-w-md mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <LogIn size={40} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">Authentication Required</h3>
      <p className="text-slate-600 mb-6">
        Please sign in to access this feature and unlock your personalized learning experience.
      </p>
      <motion.button
        onClick={onLogin}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Sign In to Continue
      </motion.button>
    </div>
  );
};

/**
 * Main App with Authentication Provider
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
