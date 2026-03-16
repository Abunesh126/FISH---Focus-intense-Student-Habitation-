import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import StudyTimeline from './StudyTimeline';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PomodoroProps {
  isDeepWork?: boolean;
}

export default function Pomodoro({ isDeepWork }: PomodoroProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const progress = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-center gap-16 ${isDeepWork ? 'h-screen' : 'py-10'}`}>
      <div className="flex flex-col items-center">
        {/* Main Timer Console */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "relative w-[400px] h-[400px] rounded-[3rem] flex items-center justify-center p-8",
            isDeepWork 
              ? "bg-[#0A0A0B] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]" 
              : "bg-[#1A1B1E] border border-white/10 shadow-2xl"
          )}
        >
          {/* Inner Bezel */}
          <div className="absolute inset-4 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          
          {/* Segmented Progress Ring */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="transparent"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="12"
              strokeDasharray="4 4"
            />
            <motion.circle
              cx="200"
              cy="200"
              r="160"
              fill="transparent"
              stroke={mode === 'work' ? '#EBC04D' : '#A8A640'}
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 160}
              animate={{ strokeDashoffset: (2 * Math.PI * 160) * (1 - progress / 100) }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(235,192,77,0.3)]"
              transition={{ type: 'spring', bounce: 0, duration: 1 }}
            />
          </svg>

          {/* Digital Display Area */}
          <div className="text-center z-10 bg-[#0D0E10] w-64 h-64 rounded-full flex flex-col items-center justify-center border border-white/5 shadow-inner">
            <div className={cn(
              "flex items-center justify-center gap-2 mb-3 px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]",
              mode === 'work' 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-olive/10 border-olive/20 text-olive"
            )}>
              {mode === 'work' ? <Brain size={14} /> : <Coffee size={14} />}
              <span>{mode === 'work' ? 'Focus Active' : 'Rest Phase'}</span>
            </div>
            
            <h2 className="text-7xl font-mono font-bold tracking-tighter text-white tabular-nums">
              {formatTime(timeLeft)}
            </h2>

            <div className="mt-4 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-1 rounded-full transition-all duration-500",
                    i < 2 ? "bg-primary shadow-[0_0_8px_rgba(235,192,77,0.5)]" : "bg-white/10"
                  )} 
                />
              ))}
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-white/10" />
          <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-white/10" />
          <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-white/10" />
          <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-white/10" />
        </motion.div>

        {/* Tactile Controls */}
        <div className="mt-12 flex items-center gap-8">
          <button 
            onClick={resetTimer}
            className="group relative p-5 rounded-2xl bg-[#1A1B1E] border border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all shadow-lg active:translate-y-1"
          >
            <RotateCcw size={24} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Reset</div>
          </button>
          
          <button 
            onClick={toggleTimer}
            className={cn(
              "relative w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all active:scale-95 active:translate-y-1 border-b-4",
              mode === 'work' 
                ? "bg-primary text-secondary border-black/20 hover:bg-primary/90" 
                : "bg-olive text-white border-black/20 hover:bg-olive/90"
            )}
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            className="group relative p-5 rounded-2xl bg-[#1A1B1E] border border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all shadow-lg active:translate-y-1"
          >
            <Settings size={24} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Config</div>
          </button>
        </div>

        {isDeepWork && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
              Deep Work Protocol Engaged
            </span>
          </motion.div>
        )}
      </div>

      {!isDeepWork && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden xl:block"
        >
          <StudyTimeline />
        </motion.div>
      )}
    </div>
  );
}
