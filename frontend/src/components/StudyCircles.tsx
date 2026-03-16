import { useState, useEffect, useRef } from 'react';
import { Users, Video, Mic, MessageCircle, PhoneOff, UserPlus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { io, Socket } from 'socket.io-client';

export default function StudyCircles() {
  const [inCall, setInCall] = useState(false);
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect socket only when component mounts (lazy, not at module load)
    socketRef.current = io();
    const socket = socketRef.current;

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('receive-message');
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (room && socketRef.current) {
      socketRef.current.emit('join-room', room);
      setInCall(true);
    }
  };

  const sendMessage = () => {
    if (inputText && room && socketRef.current) {
      const msg = { user: 'Me', text: inputText, room };
      socketRef.current.emit('send-message', msg);
      setMessages(prev => [...prev, msg]);
      setInputText('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-250px)] flex gap-8">
      {/* Sidebar: Friends & Circles */}
      <div className="w-80 flex flex-col gap-6">
        <div className="glass p-6 rounded-3xl">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search scholars..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Circles</h4>
          <div className="space-y-3">
            {[
              { name: 'Organic Chem Study', members: 4, active: true },
              { name: 'History 101 Prep', members: 2, active: true },
              { name: 'Calculus Grind', members: 0, active: false },
            ].map(circle => (
              <button 
                key={circle.name}
                onClick={() => { setRoom(circle.name); joinRoom(); }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-manila rounded-xl flex items-center justify-center text-leather">
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">{circle.name}</p>
                    <p className="text-[10px] text-slate-400">{circle.members} members active</p>
                  </div>
                </div>
                {circle.active && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-secondary w-full flex items-center justify-center gap-2 py-4 rounded-2xl">
          <UserPlus size={20} />
          Create New Circle
        </button>
      </div>

      {/* Main Area: Video Call or Join Screen */}
      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden flex flex-col">
        {!inCall ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Users size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Study Circles</h2>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
              Collaborate in real-time with your peers. Join a circle to share screens, 
              discuss concepts, and stay focused together.
            </p>
            <div className="flex gap-4 w-full max-w-sm">
              <input 
                type="text" 
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter Circle ID..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                onClick={joinRoom}
                className="btn-primary px-8"
              >
                Join
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">{room}</h3>
                <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Live Session
                </p>
              </div>
              <button 
                onClick={() => setInCall(false)}
                className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-all"
              >
                <PhoneOff size={20} />
              </button>
            </div>

            {/* Video Grid Simulation */}
            <div className="flex-1 p-6 grid grid-cols-2 gap-4 bg-slate-50/50">
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                  <Users size={64} />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  You (Scholar)
                </div>
              </div>
              <div className="relative bg-slate-700 rounded-3xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                  <Users size={64} />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  Study_Buddy_99
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-white border-t border-slate-100 flex justify-center gap-4">
              <button className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <Mic size={24} />
              </button>
              <button className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <Video size={24} />
              </button>
              <button className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <MessageCircle size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
