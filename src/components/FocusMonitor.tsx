import { useState, useRef, useEffect } from 'react';
import { Eye, Shield, AlertTriangle, CheckCircle, Camera, CameraOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function FocusMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [focusScore, setFocusScore] = useState(92);
  const [postureStatus, setPostureStatus] = useState<'Good' | 'Slouching'>('Good');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsMonitoring(true);
      }
    } catch (err) {
      console.error('Webcam access denied', err);
      alert('Please enable camera permissions for Bio-Focus monitoring.');
    }
  };

  const stopMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsMonitoring(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate focus score fluctuations
        setFocusScore(prev => Math.min(100, Math.max(70, prev + (Math.random() * 4 - 2))));
        // Simulate posture checks
        if (Math.random() > 0.9) setPostureStatus(prev => prev === 'Good' ? 'Slouching' : 'Good');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl group">
          {!isMonitoring && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <CameraOff size={40} />
              </div>
              <p className="font-medium">Camera monitoring is inactive</p>
              <button 
                onClick={startMonitoring}
                className="btn-primary flex items-center gap-2"
              >
                <Camera size={20} />
                Enable Bio-Focus
              </button>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isMonitoring ? 'opacity-100' : 'opacity-0'}`}
          />

          {isMonitoring && (
            <>
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                Live Monitoring
              </div>
              <div className="absolute bottom-6 right-6">
                <button 
                  onClick={stopMonitoring}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10"
                >
                  <CameraOff size={20} />
                </button>
              </div>
              {/* Simulated Face Overlay */}
              <div className="absolute inset-0 border-[20px] border-primary/10 pointer-events-none" />
            </>
          )}
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={24} className="text-secondary" />
            Privacy Assurance
          </h3>
          <p className="text-slate-500 leading-relaxed">
            Bio-Focus monitoring is processed **locally** on your device. No video data is ever uploaded to our servers. 
            We only use gaze detection and posture analysis to calculate your focus score and provide real-time alerts.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
              <motion.circle 
                cx="64" cy="64" r="60" fill="transparent" stroke="#EBC04D" strokeWidth="8" 
                strokeDasharray={2 * Math.PI * 60}
                animate={{ strokeDashoffset: (2 * Math.PI * 60) * (1 - focusScore / 100) }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">{Math.round(focusScore)}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>
          <h4 className="font-bold text-slate-800">Current Focus Level</h4>
          <p className="text-xs text-slate-500 mt-1">Excellent concentration detected</p>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${postureStatus === 'Good' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {postureStatus === 'Good' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Posture</p>
                <p className="font-bold text-slate-800">{postureStatus}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Gaze Tracking</p>
                <p className="font-bold text-slate-800">{isMonitoring ? 'On Screen' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary p-8 rounded-3xl text-white">
          <h4 className="font-bold mb-4">Focus Insights</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
              Your focus peaks between 10 AM and 12 PM.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
              Slouching detected 3 times in the last hour.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
