import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, Clock, TrendingUp, Sparkles, ShieldCheck, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [focusPlan, setFocusPlan] = useState<string | null>(null);
  const [studyTopic, setStudyTopic] = useState('');

  const stats = [
    { label: 'Focus Score', value: '84%', icon: Zap, color: 'text-primary' },
    { label: 'Tasks Done', value: '12/15', icon: Target, color: 'text-secondary' },
    { label: 'Deep Work', value: '4.5h', icon: Clock, color: 'text-leather' },
    { label: 'Rank', value: '#3', icon: TrendingUp, color: 'text-olive' },
  ];

  const generateFocusPlan = async () => {
    if (!studyTopic.trim()) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `I am studying ${studyTopic}. Generate a "Focus Plan" including: 
        1. 3 Whitelisted academic resources/sites.
        2. 3 Blacklisted distraction categories.
        3. A 2-hour Pomodoro schedule (e.g. 50/10).
        Keep it concise and formatted for a UI card.`
      });
      setFocusPlan(response.text || 'Unable to generate plan.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Focus Blocker Section */}
      <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-secondary to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles size={20} />
            <span className="text-xs font-black uppercase tracking-widest">AI Context Blocker</span>
          </div>
          <h2 className="text-3xl font-black mb-4">Ready to lock in?</h2>
          <p className="text-white/60 mb-6 max-w-md">Tell us what you're studying, and our AI will dynamically configure your focus environment.</p>

          <div className="flex gap-4 max-w-xl">
            <input
              type="text"
              value={studyTopic}
              onChange={(e) => setStudyTopic(e.target.value)}
              placeholder="e.g. Quantum Mechanics, Renaissance Art..."
              className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30"
            />
            <button
              onClick={generateFocusPlan}
              disabled={isAnalyzing}
              className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Generate Plan'}
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
      </div>

      <AnimatePresence>
        {focusPlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass p-8 rounded-3xl border-2 border-primary/30 relative"
          >
            <button
              onClick={() => setFocusPlan(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-primary" size={32} />
              <h3 className="text-xl font-bold">Your AI-Generated Focus Protocol</h3>
            </div>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {focusPlan}
            </div>
            <button className="btn-secondary mt-8 w-full py-4 rounded-2xl font-black tracking-widest uppercase">
              ACTIVATE PROTOCOL
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
            {[
              { title: 'Organic Chem Quiz', time: 'Tomorrow, 10:00 AM', priority: 'High' },
              { title: 'History Essay', time: 'Friday, 11:59 PM', priority: 'Medium' },
              { title: 'Lab Report', time: 'Monday, 9:00 AM', priority: 'Low' },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-600' :
                    item.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                  }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
