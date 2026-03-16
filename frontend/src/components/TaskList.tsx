import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, AlertCircle, CheckSquare, LogIn, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoginModal from './LoginModal';

export default function TaskList() {
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await apiService.tasks.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !isAuthenticated) return;

    try {
      const taskData = {
        title: newTask,
        description: newTaskDescription,
        due_date: newTaskDueDate || null,
        priority: newTaskPriority
      };
      
      await apiService.tasks.create(taskData);
      setNewTask('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!isAuthenticated) return;
    
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await apiService.tasks.update(task.id, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!isAuthenticated) return;
    
    try {
      await apiService.tasks.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDueDate = (dateString: string) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1B1E] border border-white/10 rounded-2xl p-8 text-center"
        >
          <LogIn size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
          <p className="text-white/60 mb-6">
            Please sign in to manage your tasks and assignments. Your tasks will be saved to your profile.
          </p>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-primary text-secondary px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </motion.div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Quick Add Task */}
      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new assignment..."
          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
        />
        <button 
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="absolute right-2 top-2 bottom-2 bg-secondary text-white px-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Extended Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addTask}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task title"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Loading tasks...</p>
          </div>
        ) : (
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
                  <button 
                    onClick={() => toggleTask(task)}
                    className="text-slate-300 hover:text-primary transition-colors"
                  >
                    {task.status === 'completed' ? 
                      <CheckCircle2 className="text-primary" /> : 
                      <Circle />
                    }
                  </button>
                  <div>
                    <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={12} />
                        {formatDueDate(task.due_date)}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                        <AlertCircle size={12} />
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                      </span>
                      {task.created_at && (
                        <span className="flex items-center gap-1 text-xs text-slate-300">
                          <Clock size={12} />
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      )}
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
        )}

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

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
