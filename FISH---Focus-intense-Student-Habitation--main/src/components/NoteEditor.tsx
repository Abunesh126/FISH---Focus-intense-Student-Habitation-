import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, Edit3, Type, List, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function NoteEditor() {
  const [content, setContent] = useState('# New Study Note\n\nStart typing your notes here using **Markdown**...');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-250px)] flex flex-col gap-6">
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

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <Type size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <List size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <ImageIcon size={20} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <button className="btn-secondary flex items-center gap-2">
            <Save size={18} />
            Save Note
          </button>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-8 bg-transparent resize-none focus:outline-none font-mono text-slate-700 leading-relaxed"
            placeholder="Write your notes here..."
          />
        ) : (
          <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-4">
        <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
        <span>Last saved: Just now</span>
      </div>
    </div>
  );
}
