import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, Edit3, Plus, Trash2, Star, StarOff, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';

interface Note {
  id: number;
  title: string;
  content: string;
  subject?: string;
  is_favorite: boolean;
  updated_at: string;
}

export default function NoteEditor() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.notes.getAll();
      setNotes(data);
      if (data.length > 0 && !activeNote) {
        selectNote(data[0]);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setContent(note.content);
    setTitle(note.title);
    setSubject(note.subject || '');
  };

  const createNote = async () => {
    const newNote = {
      title: 'New Note',
      content: '# New Study Note\n\nStart typing your notes here using **Markdown**...',
      subject: ''
    };
    
    try {
      await apiService.notes.create(newNote);
      // Reload notes list to get the newly created note with its ID
      const data = await apiService.notes.getAll();
      setNotes(data);
      if (data.length > 0) {
        selectNote(data[0]); // Select the newest note (first in desc order)
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const saveNote = async () => {
    if (!activeNote) return;
    
    setIsSaving(true);
    try {
      const updated = await apiService.notes.update(activeNote.id, { title, content, subject });
      setNotes(notes.map(n => n.id === activeNote.id ? { ...n, title, content, subject } : n));
      setActiveNote({ ...activeNote, title, content, subject });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await apiService.notes.delete(id);
      const remaining = notes.filter(n => n.id !== id);
      setNotes(remaining);
      if (activeNote?.id === id) {
        if (remaining.length > 0) {
          selectNote(remaining[0]);
        } else {
          setActiveNote(null);
          setContent('');
          setTitle('');
        }
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const toggleFavorite = async (note: Note) => {
    try {
      await apiService.notes.update(note.id, { is_favorite: !note.is_favorite });
      setNotes(notes.map(n => n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n));
      if (activeNote?.id === note.id) {
        setActiveNote({ ...activeNote, is_favorite: !activeNote.is_favorite });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-250px)] flex gap-6">
      {/* Notes Sidebar */}
      <div className="w-72 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">My Notes</h3>
          <button
            onClick={createNote}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <FileText size={40} className="text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notes.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors group relative ${
                    activeNote?.id === note.id ? 'bg-primary/5 border-l-2 border-primary' : ''
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-slate-800 truncate flex-1">{note.title}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 ml-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(note); }}
                        className={`p-1 rounded transition-colors ${note.is_favorite ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                      >
                        {note.is_favorite ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  {note.subject && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{note.subject}</span>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(note.updated_at)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      {activeNote ? (
        <div className="flex-1 flex flex-col gap-4">
          {/* Note Header */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-xl font-bold text-slate-800 border-b-2 border-transparent focus:border-primary focus:outline-none bg-transparent pb-1"
              placeholder="Note title..."
            />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-36 text-sm text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Subject..."
            />
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setMode('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === 'edit' ? 'bg-white text-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Edit3 size={16} />
                Editor
              </button>
              <button 
                onClick={() => setMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === 'preview' ? 'bg-white text-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            <button 
              onClick={saveNote} 
              disabled={isSaving}
              className="btn-secondary flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col">
            {mode === 'edit' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 p-8 bg-transparent resize-none focus:outline-none font-mono text-slate-700 leading-relaxed"
                placeholder="Write your notes here using Markdown..."
              />
            ) : (
              <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-4">
            <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
            <span>Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : 'Not saved yet'}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText size={60} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Note Selected</h3>
            <p className="text-slate-500 mb-4">Select a note or create a new one to get started.</p>
            <button onClick={createNote} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={18} />
              Create New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
