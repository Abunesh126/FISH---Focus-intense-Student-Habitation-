import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are SOCRATES, the AI tutor for the FISH learning platform. You embody the Socratic method - guiding students to discover knowledge through thoughtful questioning rather than giving direct answers.

Your personality:
- Encouraging yet intellectually rigorous
- Ask probing questions that build understanding step-by-step
- Celebrate intellectual curiosity and critical thinking
- Use analogies and real-world examples
- When students ask for direct answers, guide them to find the solution themselves
- Keep responses concise but meaningful
- Show enthusiasm for learning

Always remember: Your goal is to make students think, not to think for them.`;

const rawKey = (import.meta.env?.VITE_GEMINI_API_KEY) || (process.env.GEMINI_API_KEY) || '';
const GEMINI_API_KEY = typeof rawKey === 'string' ? rawKey.replace(/^['"]|['"]$/g, '') : '';

// Initialize Gemini client once at module level (key is static)
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([
    { 
      role: 'assistant', 
      content: ai
        ? '🎓 Hello! I am **SOCRATES**, your AI Socratic tutor.\n\nI\'m here to help you discover knowledge through guided inquiry rather than just giving you answers.\n\nWhat fascinating topic shall we explore together today?'
        : '🎓 Welcome to SOCRATES Demo Mode!\n\nI\'m running without an API key. Connect a Gemini API key for full Socratic tutoring.\n\nWhat topic shall we explore?', 
      timestamp: new Date()
    }
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
    const newUserMessage = { role: 'user' as const, content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      if (ai) {
        // Build conversation history for the API (exclude the initial greeting from history)
        const history = messages
          .filter((_, i) => i > 0) // skip initial greeting  
          .map(m => ({
            role: m.role === 'assistant' ? 'model' as const : 'user' as const,
            parts: [{ text: m.content }],
          }));

        const contents = [
          ...history,
          { role: 'user' as const, parts: [{ text: userMessage }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 600,
          },
        });

        const text = response.text ?? 'I could not generate a response. Please try again.';
        setMessages(prev => [...prev, { role: 'assistant', content: text, timestamp: new Date() }]);
      } else {
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 1200));
        const demoResponses = [
          "🤔 That's a fascinating question! What do you think might happen if we approach this from a different angle? What evidence have you considered so far?",
          "📚 Excellent topic! Before we dive deeper — what do you already know about this subject? What patterns or connections do you notice?",
          "💡 I love your curiosity! Let's think step by step — what's the first thing that comes to mind? Why do you think that is?",
          "🎯 Great question! What would happen if we tested this assumption? Can you think of examples that might support or challenge this idea?",
          "🔍 What questions does this raise for you? If you had to explain this to a friend, where would you start?",
        ];
        const reply = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        setMessages(prev => [...prev, { role: 'assistant', content: reply + '\n\n📝 *Demo mode — add VITE_GEMINI_API_KEY for full AI tutoring.*', timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please check your API key or try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: '🔄 Fresh start! What would you like to explore in this new conversation?', 
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-white to-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-primary to-leather rounded-2xl flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Brain className="text-white" size={28} />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">SOCRATES</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${ai ? 'bg-green-400' : 'bg-orange-400'}`} />
                <p className="text-sm text-white/80">
                  {ai ? 'AI Connected • Gemini 2.0 Flash' : 'Demo Mode • No API Key'}
                </p>
              </div>
            </div>
          </div>
          <motion.button 
            onClick={clearConversation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 hover:bg-white/10 rounded-xl transition-all"
            title="Start new conversation"
          >
            <RefreshCcw size={20} />
          </motion.button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${i}-${msg.timestamp.getTime()}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-leather to-leather/80 text-white' 
                    : 'bg-gradient-to-br from-primary to-primary/80 text-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </motion.div>
                
                <div className={`group flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-5 rounded-3xl shadow-sm text-sm leading-relaxed relative ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-secondary to-secondary/90 text-white rounded-br-md'
                      : 'bg-white text-slate-800 rounded-bl-md border border-slate-100 shadow-lg'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {msg.content.split('\n').map((line, idx) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={idx} className="font-bold my-2">{line.slice(2, -2)}</div>;
                        }
                        if (line.startsWith('- ')) {
                          return <div key={idx} className="ml-4 my-1">• {line.slice(2)}</div>;
                        }
                        // Inline bold: **text**
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        return line ? (
                          <div key={idx} className="my-1">
                            {parts.map((part, pi) =>
                              part.startsWith('**') && part.endsWith('**')
                                ? <strong key={pi}>{part.slice(2, -2)}</strong>
                                : part
                            )}
                          </div>
                        ) : <br key={idx} />;
                      })}
                    </div>
                  </div>
                  
                  <span className="text-xs text-slate-400 mt-1 px-2">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-bl-md shadow-lg">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a thoughtful question, share what you're studying, or describe a concept you're curious about..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-slate-400"
              disabled={isTyping}
            />
            <p className="text-xs text-slate-500 mt-2">
              💡 Tip: Try asking "Why does...?", "How would you approach...?", or "What if...?"
            </p>
          </div>
          
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-secondary to-secondary/90 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
