import { motion } from 'motion/react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

interface StudyBlock {
  id: number;
  time: string;
  label: string;
  type: 'work' | 'break' | 'upcoming';
}

export default function StudyTimeline() {
  const blocks: StudyBlock[] = [
    { id: 1, time: '09:00 AM', label: 'Deep Work: Quantum Physics', type: 'work' },
    { id: 2, time: '10:00 AM', label: 'Short Break', type: 'break' },
    { id: 3, time: '10:15 AM', label: 'Deep Work: Quantum Physics', type: 'work' },
    { id: 4, time: '11:15 AM', label: 'Long Break', type: 'break' },
    { id: 5, time: '11:45 AM', label: 'Review: Lab Notes', type: 'upcoming' },
    { id: 6, time: '12:30 PM', label: 'Lunch', type: 'break' },
  ];

  return (
    <div className="glass p-8 rounded-3xl w-full max-w-md">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock size={20} className="text-secondary" />
          Today's Timeline
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">March 12, 2026</span>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-slate-100 before:h-full">
        {blocks.map((block, i) => (
          <motion.div 
            key={block.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-start gap-6 pl-8"
          >
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
              block.type === 'work' ? 'bg-primary' : 
              block.type === 'break' ? 'bg-olive' : 
              'bg-slate-200'
            }`}>
              {block.type === 'work' ? (
                <CheckCircle2 size={12} className="text-secondary" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{block.time}</p>
              <div className={`p-4 rounded-2xl border ${
                block.type === 'work' ? 'bg-primary/5 border-primary/20' : 
                block.type === 'break' ? 'bg-olive/5 border-olive/20' : 
                'bg-slate-50 border-slate-100'
              }`}>
                <h4 className={`text-sm font-bold ${
                  block.type === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                }`}>
                  {block.label}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-primary hover:text-primary transition-all">
        + Add Schedule Block
      </button>
    </div>
  );
}
