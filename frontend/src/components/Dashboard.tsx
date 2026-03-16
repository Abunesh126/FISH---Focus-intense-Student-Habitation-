import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Brain,
  Users,
  Star,
  CheckCircle2,
  Activity,
  BarChart3,
  Lightbulb,
  Trophy,
  ArrowUp,
  ArrowDown,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import { GoogleGenAI } from '@google/genai';

const rawKey = (import.meta.env?.VITE_GEMINI_API_KEY) || (process.env.GEMINI_API_KEY) || '';
const GEMINI_API_KEY = typeof rawKey === 'string' ? rawKey.replace(/^['"]|['"]$/g, '') : '';
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;


const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [aiPlan, setAiPlan] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [studyGoal, setStudyGoal] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const formatRelativeTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (Number.isNaN(diffMins)) return 'Recently';
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Load dashboard data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  /**
   * Load dashboard statistics and activity
   */
  const loadDashboardData = async () => {
    setIsLoadingStats(true);
    try {
      // Load dashboard stats
      const stats = await API.analytics.getDashboardStats();
      setDashboardStats(stats);
      
      // Load recent activity
      const activity = await API.analytics.getActivity(10);
      setRecentActivity(activity.activities || []);
      
      // Load upcoming tasks
      const tasks = await API.tasks.getTasks({ status: 'pending', limit: 5 });
      setUpcomingTasks(tasks.tasks || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use fallback data for demo
      setDashboardStats({
        study_hours_week: 6.5,
        completed_tasks_week: 12,
        study_streak_days: 28,
        focus_score_avg: 94
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Dynamic stats based on real data or fallback
  const stats = [
    {
      label: 'Focus Score',
      value: isAuthenticated && dashboardStats ? `${dashboardStats.focus_score_avg}%` : '94%',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Study Hours',
      value: isAuthenticated && dashboardStats ? `${dashboardStats.study_hours_week}h` : '6.5h',
      change: '+45min',
      trend: 'up',
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Tasks Done',
      value: isAuthenticated && dashboardStats ? `${dashboardStats.completed_tasks_week}/15` : '12/15',
      change: '3 left',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-leather',
      bgColor: 'bg-leather/10',
    },
    {
      label: 'Streak Days',
      value: isAuthenticated && dashboardStats ? `${dashboardStats.study_streak_days}` : '28',
      change: '+1 today',
      trend: 'up',
      icon: Award,
      color: 'text-olive',
      bgColor: 'bg-olive/10',
    }
  ];

  // Use real activity data or fallback
  const displayActivity = isAuthenticated && recentActivity.length > 0 ? 
    recentActivity.map(activity => {
      const activityTypeMap = {
        'login': { action: 'Logged into FISH platform', type: 'social' },
        'study_session_started': { action: 'Started a study session', type: 'achievement' },
        'study_session_completed': { action: 'Completed a study session', type: 'achievement' },
        'task_created': { action: 'Created a new task', type: 'content' },
        'task_completed': { action: 'Completed a task', type: 'achievement' },
        'note_created': { action: 'Added study notes', type: 'content' },
        'joined_study_circle': { action: 'Joined a study circle', type: 'social' },
      };
      
      const mapped = activityTypeMap[activity.activity_type] || {
        action: activity.activity_type.replace(/_/g, ' '),
        type: 'content'
      };
      
      return {
        action: mapped.action,
        time: formatRelativeTime(activity.timestamp),
        type: mapped.type
      };
    }) : [
      { action: 'Welcome to FISH! Start by exploring features', time: '1 hour ago', type: 'milestone' },
      { action: 'Try creating your first task or note', time: '2 hours ago', type: 'content' },
      { action: 'Join a study circle for collaborative learning', time: '3 hours ago', type: 'social' },
    ];

  // Use real upcoming tasks or fallback
  const displayTasks = isAuthenticated && upcomingTasks.length > 0 ?
    upcomingTasks.map(task => ({
      title: task.title,
      eta: task.due_date ? 
        `Due ${new Date(task.due_date).toLocaleDateString()}` : 
        'No due date',
      priority: task.priority || 'medium'
    })) : [
      { title: 'Review Calculus Derivatives', eta: 'Due in 2h', priority: 'high' },
      { title: 'Physics Lab Report', eta: 'Due tomorrow', priority: 'medium' },
      { title: 'History Essay Draft', eta: 'Due in 3 days', priority: 'low' },
    ];

  const aiPrompt = `Create a personalized study plan for: "${studyGoal}"

  Please provide:
  1. **Learning Objectives** - 3-4 specific, measurable goals
  2. **Resource Whitelist** - 5 high-quality academic sources/websites 
  3. **Study Strategy** - Optimal techniques for this subject
  4. **Pomodoro Schedule** - Optimal work/break intervals for this subject
  5. **Assessment Methods** - How to test understanding

  Keep it concise, actionable, and academically rigorous.`;

  const generateAIPlan = async () => {
    if (!studyGoal.trim() || isGeneratingPlan) return;
    setIsGeneratingPlan(true);

    try {
      if (ai) {
        const prompt = `Create a concise, actionable personalized study plan for: "${studyGoal}"

Please provide:
1. **Learning Objectives** - 3-4 specific, measurable goals
2. **Recommended Resources** - 4-5 high-quality academic sources/websites
3. **Study Strategy** - Best techniques for this subject
4. **Pomodoro Schedule** - Optimal work/break intervals
5. **Assessment Methods** - How to test understanding

Keep it practical, academically rigorous, and motivating.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { maxOutputTokens: 800 },
        });
        setAiPlan(response.text ?? 'Could not generate a plan. Please try again.');
      } else {
        // Fallback static plan when no API key
        await new Promise(resolve => setTimeout(resolve, 800));
        setAiPlan(
          `📚 **Study Plan for: ${studyGoal}**\n\n` +
          `**Learning Objectives:**\n` +
          `• Master core concepts and fundamentals\n` +
          `• Apply knowledge through practical exercises\n` +
          `• Develop critical thinking skills\n` +
          `• Build long-term retention strategies\n\n` +
          `**Recommended Resources:**\n` +
          `• Khan Academy - Comprehensive video tutorials\n` +
          `• Coursera - Structured online courses\n` +
          `• MIT OpenCourseWare - Advanced materials\n` +
          `• Textbook companion websites\n\n` +
          `**Study Strategy:**\n` +
          `• Use active recall and spaced repetition\n` +
          `• Create concept maps and visual summaries\n\n` +
          `**Pomodoro Schedule:**\n` +
          `• 25-minute focused sessions, 5-minute breaks\n\n` +
          `**Assessment Methods:**\n` +
          `• Weekly self-quizzes and flashcards\n\n` +
          `⚠️ *Add VITE_GEMINI_API_KEY for personalized AI plans.*`
        );
      }
    } catch (error: any) {
      console.error('AI plan generation error:', error);
      let errorMessage = error?.message || String(error);
      
      // Attempt to parse ugly JSON errors
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed?.error?.message) {
          errorMessage = parsed.error.message;
        }
      } catch (e) {
        // Not JSON, keep original string
      }
      
      setAiPlan(`⚠️ Failed to generate study plan. Error: ${errorMessage}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden glass-intense rounded-3xl bg-gradient-to-r from-primary via-secondary to-leather p-10 text-white min-h-[300px] flex items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-leather/10 blur-[80px] rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 flex items-center gap-4 mb-6">
            <Brain size={24} />
            <span className="text-sm font-black uppercase tracking-widest">AI-Powered Study Assistant</span>
          </div>
          <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {isAuthenticated && user ? 
              `Welcome back, ${user.first_name}! 🎓` : 
              'Welcome to FISH Study Platform! 📚'
            }
          </h2>
          <p className="text-white/70 mb-8 text-lg max-w-2xl">
            {isAuthenticated ?
              'Your personalized learning ecosystem is ready. Let\'s make today count toward your academic excellence.' :
              'Your comprehensive study management system. Sign in to access personalized features and track your progress.'
            }
          </p>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <span className="text-sm opacity-80">Today's Focus Score:</span>
              <div className="font-black text-2xl">94%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <span className="text-sm opacity-80">Current Streak:</span>
              <div className="font-black text-2xl">28 Days 🔥</div>
            </div>
          </motion.div>
        </div>

        {/* AI Study Plan Generator */}
        <motion.div 
          className="glass p-8 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Study Planner {' '}
                <span className={`text-sm font-normal ${ai ? 'text-green-600' : 'text-orange-600'}`}>
                  {ai ? '● AI Connected' : '● Demo Mode'}
                </span>
              </h3>
              <p className="text-slate-500 text-sm">
                {ai ? 'Powered by Gemini 2.0 Flash — personalized to your topic' : 'Add VITE_GEMINI_API_KEY for personalized plans'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              placeholder="What subject or topic do you want to master? (e.g., 'Organic Chemistry Reactions')"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            <motion.button
              onClick={generateAIPlan}
              disabled={!studyGoal.trim() || isGeneratingPlan}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-secondary to-secondary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPlan ? 'Generating...' : 'Generate Plan'}
            </motion.button>
          </div>

          <AnimatePresence>
            {aiPlan && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-100"
              >
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <Brain size={20} />
                  Your Personalized Study Plan
                </h4>
                <div className="prose prose-slate max-w-none text-sm">
                  {aiPlan.split('\n').map((line, idx) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <div key={idx} className="font-bold text-secondary mt-4 mb-2">{line.slice(2, -2)}</div>;
                    }
                    if (line.match(/^\d+\./)) {
                      return <div key={idx} className="font-semibold mt-3 mb-1 text-slate-800">{line}</div>;
                    }
                    if (line.startsWith('-') || line.startsWith('•')) {
                      return <div key={idx} className="ml-4 mb-1 text-slate-600">• {line.slice(1).trim()}</div>;
                    }
                    return line ? <div key={idx} className="mb-1 text-slate-700">{line}</div> : <br key={idx} />;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl min-h-[400px]">
            <h3 className="text-xl font-bold mb-6">Productivity Heatmap</h3>
            <div className="w-full h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 italic">
              [Interactive D3 Heatmap Visualization]
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {displayTasks.map((task, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                >
                  <div>
                    <div className="font-semibold text-slate-800">{task.title}</div>
                    <div className="text-sm text-slate-500">{task.eta}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Activity size={24} className="text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {displayActivity.map((activity, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'achievement' ? 'bg-primary' :
                    activity.type === 'social' ? 'bg-secondary' :
                    activity.type === 'content' ? 'bg-leather' : 'bg-olive'
                  }`} />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{activity.action}</div>
                    <div className="text-sm text-slate-500">{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Zap size={24} className="text-secondary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Plus, label: 'New Task', color: 'from-primary to-primary/80' },
                { icon: BookOpen, label: 'Study Notes', color: 'from-secondary to-secondary/80' },
                { icon: Users, label: 'Join Circle', color: 'from-leather to-leather/80' },
                { icon: BarChart3, label: 'Analytics', color: 'from-olive to-olive/80' }
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${action.color} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all`}
                >
                  <action.icon size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">{action.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
