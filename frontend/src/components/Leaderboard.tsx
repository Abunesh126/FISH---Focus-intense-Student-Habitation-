import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { apiRequest } from '../services/api';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest('/leaderboard')
      .then((data: LeaderboardEntry[]) => {
        setEntries(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch leaderboard:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-3 gap-6 items-end mb-12">
        {/* Podium */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            <Medal className="text-slate-400" size={32} />
          </div>
          <div className="bg-slate-200 w-full h-32 rounded-t-3xl flex flex-col items-center justify-center p-4">
            <span className="font-bold text-slate-600">#2</span>
            <span className="text-xs text-slate-500 font-medium">Scholar_Beta</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Crown className="text-primary mb-2 animate-bounce" size={40} />
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl">
            <User className="text-secondary" size={40} />
          </div>
          <div className="bg-primary w-full h-48 rounded-t-3xl flex flex-col items-center justify-center p-4 shadow-lg">
            <span className="font-black text-secondary text-2xl">#1</span>
            <span className="text-sm text-secondary font-bold">DeepWork_Master</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-manila rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            <Medal className="text-leather" size={32} />
          </div>
          <div className="bg-manila w-full h-24 rounded-t-3xl flex flex-col items-center justify-center p-4">
            <span className="font-bold text-leather">#3</span>
            <span className="text-xs text-leather font-medium">Focus_Queen</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 bg-secondary text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            Global Rankings
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">Season 4</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {entries.length > 0 ? entries.map((entry, i) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className={`w-8 text-center font-black text-lg ${
                  i === 0 ? 'text-primary' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-leather' : 'text-slate-300'
                }`}>
                  {i + 1}
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{entry.username}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level 12 Scholar</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-black text-secondary">{entry.score.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Focus Points</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp size={14} />
                  <span className="text-xs font-bold">+12</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="p-12 text-center text-slate-400 italic">
              Loading rankings...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
