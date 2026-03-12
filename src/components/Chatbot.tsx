import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are the ScholarFocus Socratic Tutor. Your goal is to help students understand concepts by asking guiding questions rather than giving direct answers. 
Be encouraging, academic yet approachable, and use the Socratic method. 
If a student asks for an answer, guide them to find it themselves. 
Keep responses concise and well-formatted.`;

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Greetings, Scholar. What concept shall we explore today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages.concat({ role: 'user', content: userMessage }).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      const aiText = response.text || "I'm contemplating your question. Could you rephrase that?";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      console.error('Gemini Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "My apologies, I encountered a cognitive block. Let's try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-250px)] flex flex-col glass rounded-3xl overflow-hidden">
      <div className="bg-secondary p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Bot className="text-secondary" size={24} />
          </div>
          <div>
            <h3 className="font-bold">Socratic AI Tutor</h3>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Active Learning Mode</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
          <RefreshCcw size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-leather text-white' : 'bg-primary text-secondary'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-secondary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a concept..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-2 top-2 bottom-2 bg-primary text-secondary px-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
