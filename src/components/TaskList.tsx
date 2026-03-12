import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, AlertCircle, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, description: '', due_date: '' }),
      });
      if (res.ok) {
        setNewTask('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new assignment..."
          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-secondary text-white px-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass p-5 rounded-2xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <button className="text-slate-300 hover:text-primary transition-colors">
                  {task.status === 'completed' ? <CheckCircle2 className="text-primary" /> : <Circle />}
                </button>
                <div>
                  <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={12} />
                      No deadline
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <AlertCircle size={12} />
                      Medium Priority
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No tasks yet</h3>
            <p className="text-slate-500">Add your first assignment to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
