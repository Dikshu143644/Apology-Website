import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, User, Lock, HeartHandshake, ShieldCheck } from 'lucide-react';
import messageHeartBg from '../assets/images/A-message-from-my-heart.png';
import accessBg from '../assets/images/Only-You-Have-My-Access.png';

interface LoginPageProps {
  onLogin: (name: string, code: string) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: 'heart' | 'sparkle';
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 5,
      type: Math.random() > 0.5 ? 'heart' : 'sparkle',
    }));
    setParticles(generated);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    if (!trimmedName || !trimmedCode) {
      setError('Please enter your name and the secret code.');
      triggerShake();
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, secretCode: trimmedCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLogin(trimmedName, trimmedCode);
      } else {
        setError(data.error || 'Incorrect name or secret code.');
        triggerShake();
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#0a020d] font-outfit">
      
      {/* Dynamic Background (Restored) */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url(${messageHeartBg})`,
          filter: 'blur(8px) brightness(0.35)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-950/40 via-black/60 to-purple-950/40 z-0" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: '110%' }}
              animate={{ 
                opacity: [0, 0.4, 0.4, 0], 
                y: '-10%',
                x: `${p.x + (Math.sin(p.id) * 10)}%`
              }}
              transition={{
                delay: p.delay,
                duration: p.duration,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                bottom: '-20px',
              }}
              className="text-pink-500/30"
            >
              {p.type === 'heart' ? <Heart size={p.size} fill="currentColor" /> : <Sparkles size={p.size} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 100, 
          damping: 20,
          x: { duration: 0.5 }
        }}
        className="relative z-20 w-full max-w-md"
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-[40px] blur-2xl opacity-50" />
        
        <div className="relative bg-black/55 backdrop-blur-3xl border border-white/10 rounded-[38px] p-8 md:p-10 shadow-2xl flex flex-col items-center overflow-hidden">
          
          {/* Internal Access Image Background Overlay */}
          <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
            <img src={accessBg} className="w-full h-full object-cover" alt="access decor" />
          </div>

          {/* Header Visual (Transparent) */}
          <div className="relative mb-8 pt-4 z-10">
            <div className="absolute -inset-1 bg-white/5 rounded-full blur-md" />
            <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl">
              <Lock className="w-8 h-8 text-white/80" />
            </div>
          </div>

          {/* Titles */}
          <div className="text-center space-y-2 mb-10 relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              A Private Space
            </h1>
            <p className="text-pink-200/60 font-serif-elegant italic text-lg">
              Authorized Access Only
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent mx-auto mt-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5 relative z-10">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300/50 group-focus-within:text-pink-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Special Name"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/60 transition-all text-sm tracking-wide shadow-inner"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300/60 group-focus-within:text-pink-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Secret Memory Code"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/60 transition-all text-sm tracking-wide shadow-inner"
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-xs text-center font-semibold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <div className="flex items-center justify-center gap-2">
                <span>Enter Protected Area</span>
                <HeartHandshake size={18} className="translate-y-[1px]" />
              </div>
            </button>
          </form>

          {/* Footer Badge */}
          <div className="mt-12 flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Encrypted Heart Archive
            </span>
          </div>
        </div>

        {/* Admin Link Subtle */}
        <div className="mt-8 text-center">
          <p className="text-white/20 text-[11px] font-medium tracking-wide">
            Made with <Heart size={10} className="inline fill-pink-500/30 text-pink-500/30 mx-0.5 translate-y-[-1px]" /> for a special soul
          </p>
        </div>
      </motion.div>
    </div>
  );
}
