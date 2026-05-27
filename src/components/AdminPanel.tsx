import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, CheckCircle2, AlertCircle, RefreshCw, Trash2, 
  Calendar, Monitor, Globe, ShieldAlert, Key, Edit3, 
  Heart, Sparkles, User, LogOut, Check, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import dikshuPortraitClean from '../assets/images/dikshu_portrait_clean_1779319295919.png';

interface ResponseItem {
  id: string;
  choice: 'yes' | 'thinking';
  timestamp: string;
  userAgent: string;
  ip: string;
}

interface LoginAttemptItem {
  id: string;
  name: string;
  code: string;
  success: boolean;
  timestamp: string;
  userAgent: string;
  ip: string;
}
interface AdminPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFullScreen?: boolean;
  onLogoutSite?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function AdminPanel({ isOpen = true, onClose, isFullScreen = false, onLogoutSite }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

  // Real-time custom settings
  const [loginNameSetting, setLoginNameSetting] = useState('');
  const [loginCodeSetting, setLoginCodeSetting] = useState('');

  // Tables databases
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttemptItem[]>([]);

  // Background particle systems
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 10,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
    }));
    setParticles(generated);
  }, []);

  // Autofill session credentials on mount/open
  useEffect(() => {
    const savedPasscode = localStorage.getItem('admin_session_passcode');
    if (savedPasscode) {
      setPasscode(savedPasscode);
      setIsAuthorized(true);
      fetchDashboardData(savedPasscode);
    }
  }, [isOpen]);

  const fetchDashboardData = async (authPasscode: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'X-Admin-Passcode': authPasscode,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResponses(data.responses || []);
        setLoginAttempts(data.loginAttempts || []);
        if (data.settings) {
          setLoginNameSetting(data.settings.name || '');
          setLoginCodeSetting(data.settings.code || '');
        }
      } else {
        setError(data.error || 'Session expired or unauthorized.');
        setIsAuthorized(false);
        localStorage.removeItem('admin_session_passcode');
      }
    } catch (err) {
      setError('Connection failure. Can not pull backend settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthorized(true);
        localStorage.setItem('admin_session_passcode', passcode);
        fetchDashboardData(passcode);
      } else {
        setError(data.error || 'Incorrect passcode. Access Denied.');
      }
    } catch (err) {
      setError('Connection failure. Failed to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLoginSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionPending(true);
    setError('');
    setSuccessMsg('');

    const activePasscode = passcode || localStorage.getItem('admin_session_passcode') || '';

    try {
      const res = await fetch('/api/admin/settings/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Passcode': activePasscode,
        },
        body: JSON.stringify({ name: loginNameSetting, code: loginCodeSetting }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Website login settings updated successfully!');
        if (data.settings) {
          setLoginNameSetting(data.settings.name);
          setLoginCodeSetting(data.settings.code);
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      setError('Failed to update credentials due to a server error.');
    } finally {
      setIsActionPending(false);
    }
  };

  const handleRefresh = () => {
    const activePasscode = passcode || localStorage.getItem('admin_session_passcode') || '';
    if (activePasscode) {
      fetchDashboardData(activePasscode);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_passcode');
    setIsAuthorized(false);
    setPasscode('');
    setResponses([]);
    setLoginAttempts([]);
    setSuccessMsg('Dashboard locked safely.');
    if (!isFullScreen && onClose) {
      onClose();
    }
  };

  const handleClearResponses = async () => {
    if (!confirm('Are you absolutely sure you want to clear all forgiveness responses? This cannot be undone.')) {
      return;
    }

    setIsActionPending(true);
    const activePasscode = passcode || localStorage.getItem('admin_session_passcode') || '';
    try {
      const res = await fetch('/api/admin/responses/clear', {
        method: 'POST',
        headers: {
          'X-Admin-Passcode': activePasscode,
        },
      });

      if (res.ok) {
        setResponses([]);
        setSuccessMsg('Forgiveness choices deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError('Failed to clear records.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setIsActionPending(false);
    }
  };

  const handleClearLoginAttempts = async () => {
    if (!confirm('Are you absolutely sure you want to delete all login visitor logs? This cannot be undone.')) {
      return;
    }

    setIsActionPending(true);
    const activePasscode = passcode || localStorage.getItem('admin_session_passcode') || '';
    try {
      const res = await fetch('/api/admin/login-attempts/clear', {
        method: 'POST',
        headers: {
          'X-Admin-Passcode': activePasscode,
        },
      });

      if (res.ok) {
        setLoginAttempts([]);
        setSuccessMsg('Login visitor attempts deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError('Failed to clear login attempts.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setIsActionPending(false);
    }
  };

  const parseBrowser = (ua: string) => {
    if (ua.includes('iPhone')) return 'iPhone Safari';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Android')) return 'Android Web';
    if (ua.includes('Chrome')) return 'Chrome Browser';
    if (ua.includes('Safari')) return 'Safari (Mac)';
    if (ua.includes('Firefox')) return 'Firefox';
    return ua.substring(0, 22) + '...';
  };

  const dashboardContent = (
    <div className="relative w-full text-white font-sans">
      
      {/* 1. BLURRED BACKGROUND IMAGE */}
      <div 
        className="fixed inset-[-10px] bg-cover bg-center bg-no-repeat pointer-events-none z-0 select-none blur-[4px] saturate-[1.1] brightness-[0.38] scale-[1.02] transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(16, 4, 25, 0.94), rgba(10, 2, 16, 0.97)), url(${dikshuPortraitClean})`,
        }}
      />

      {/* Background overlay details */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none z-0" />

      {/* FLOAT ANIMATED PETALS & SPARKLES IN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: '105vh', x: `${p.x}vw` }}
            animate={{
              opacity: [0, 0.35, 0.35, 0],
              y: '-10vh',
              x: [`${p.x}vw`, `${p.x + (Math.sin(p.id) * 3)}vw`],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-pink-500/20 text-xs"
            style={{ fontSize: p.size }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto z-10 px-4 py-6 md:py-10 flex flex-col min-h-screen">
        
        {/* Core Administrative Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-6 mb-8 bg-black/35 p-5 md:p-6 rounded-3xl backdrop-blur-xl border border-white/5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-450 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold">
                Secure Live Dashboard
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-black text-[#ffd7ed] tracking-wide drop-shadow-[0_0_12px_rgba(236,72,153,0.35)]">
              Dikshu Apology Console
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Monitor response telemetry databases and adjust custom access criteria securely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isLoading || isActionPending}
              className="px-4 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/20 hover:border-pink-500/40 text-pink-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/5 hover:scale-[1.02] active:scale-95 disabled:opacity-40"
              title="Reload all backend tables data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Databases</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-stone-900/60 hover:bg-[#2c0e35] border border-stone-800 hover:border-pink-500/35 text-stone-300 hover:text-pink-100 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Safely Lock Console</span>
            </button>

            <button
              onClick={onLogoutSite}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
              title="Logout from the entire website"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>X - Logout From Website</span>
            </button>

            {!isFullScreen && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-stone-800 hover:border-pink-500/3 w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Global Success & Error Notification Modals info */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-950/45 border border-emerald-500/30 text-emerald-300 font-sans flex items-center gap-2.5 text-xs sm:text-sm shadow-xl shadow-emerald-950/20"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-450 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-rose-950/45 border border-rose-500/30 text-rose-300 font-sans flex items-center gap-2.5 text-xs sm:text-sm shadow-xl shadow-rose-950/20"
            >
              <AlertCircle className="h-5 w-5 text-rose-450 shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Layout Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANEL: CREDENTIALS UPDATE */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative rounded-3xl border border-pink-500/20 bg-[#12041a]/70 backdrop-blur-xl p-5 md:p-6 shadow-xl shadow-black/40 overflow-hidden">
              {/* Corner decor */}
              <span className="absolute top-3 right-3 text-pink-400/10 text-xl font-mono">🔐</span>
              
              <div className="flex items-center gap-2 mb-4 border-b border-pink-500/10 pb-3">
                <Key className="h-4.5 w-4.5 text-pink-400" />
                <h2 className="font-serif text-lg font-bold text-pink-100">
                  Site Entry Credentials
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-5 font-sans">
                Change the criteria needed to unlock your website's main view. Normal visitors must use these exact settings.
              </p>

              <form onSubmit={handleUpdateLoginSettings} className="space-y-4 font-sans">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-pink-300 font-mono font-bold uppercase tracking-widest pl-1">
                    Visitor Name Limit
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-pink-400 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginNameSetting}
                      onChange={(e) => setLoginNameSetting(e.target.value)}
                      placeholder="e.g. Dikshu"
                      className="w-full bg-black/35 hover:bg-black/55 pl-10 pr-4 py-3 rounded-xl border border-stone-800 focus:border-pink-500/70 text-sm placeholder-zinc-650 text-pink-100 tracking-wide outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-pink-300 font-mono font-bold uppercase tracking-widest pl-1">
                    Secret Memory Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-pink-400 transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginCodeSetting}
                      onChange={(e) => setLoginCodeSetting(e.target.value)}
                      placeholder="e.g. love123"
                      className="w-full bg-black/35 hover:bg-black/55 pl-10 pr-4 py-3 rounded-xl border border-stone-800 focus:border-pink-500/70 text-sm placeholder-zinc-650 text-pink-100 tracking-wider font-mono outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isActionPending}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold rounded-xl text-xs sm:text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-pink-500/10 cursor-pointer text-white flex items-center justify-center gap-2 group hover:shadow-lg disabled:opacity-40"
                >
                  <Check className="h-4 w-4 text-white" />
                  <span>Save Live Settings</span>
                </button>
              </form>
            </div>

            {/* QUICK TELEMETRY STATS */}
            <div className="rounded-3xl border border-pink-500/10 bg-[#12041a]/55 backdrop-blur-xl p-5 shadow-xl shadow-black/40">
              <h3 className="font-serif text-sm font-black text-pink-300 tracking-widest uppercase mb-4 border-b border-pink-500/10 pb-2">
                System Briefing
              </h3>
              <div className="space-y-3 font-mono text-[11px] text-zinc-400">
                <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                  <span>Captured Forgiveness Choices:</span>
                  <span className="font-sans font-extrabold text-pink-300">{responses.length}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                  <span>Visitor Login Requests:</span>
                  <span className="font-sans font-extrabold text-pink-200">{loginAttempts.length}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                  <span>Server State:</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS: RESPONSES & ATTEMPTS TABLES */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SUB-SECTION 1: FORGIVENESS DECISIONS */}
            <div className="rounded-3xl border border-pink-500/20 bg-[#12041a]/70 backdrop-blur-xl p-5 md:p-6 shadow-xl shadow-black/40 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-pink-500/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4.5 w-4.5 text-pink-400 animate-pulse fill-pink-500/20" />
                  <h2 className="font-serif text-lg font-bold text-pink-100">
                    Forgiveness Response Table
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClearResponses}
                  disabled={isActionPending || responses.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-red-500/25 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-300 text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear Choices</span>
                </button>
              </div>

              {/* Response table */}
              <div className="overflow-x-auto max-h-[280px] overflow-y-auto custom-scrollbar border border-pink-500/5 rounded-2xl bg-black/30">
                {isLoading && responses.length === 0 ? (
                  <div className="py-12 flex flex-col justify-center items-center text-zinc-500 space-y-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-pink-400" />
                    <p className="text-[11px] font-mono">Retrieving choices...</p>
                  </div>
                ) : responses.length === 0 ? (
                  <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 font-sans">
                    <ShieldAlert className="h-8 w-8 text-pink-500/30" />
                    <p className="text-xs font-semibold text-pink-250">No forgiveness answers registered yet</p>
                    <p className="text-[10px] max-w-xs leading-relaxed text-zinc-500">
                      When she chooses either "Yes" or "Still Thinking", the telemetry registers here instantly.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="border-b border-pink-500/15 bg-pink-500/5 text-pink-300 font-mono uppercase text-[9px] tracking-wider">
                        <th className="p-3.5 pl-4 font-bold">Choice Badge</th>
                        <th className="p-3.5 font-bold">Captured Timestamp</th>
                        <th className="p-3.5 font-bold">Browser / OS</th>
                        <th className="p-3.5 font-bold">Network IP Address</th>
                        <th className="p-3.5 pr-4 text-right font-bold">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {responses.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 pl-4 whitespace-nowrap">
                            {item.choice === 'yes' ? (
                              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-lg shadow-emerald-500/5">
                                <CheckCircle2 className="h-3 w-3 text-emerald-450 fill-emerald-500/10" />
                                <span>YES 💖</span>
                              </span>
                            ) : (
                              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span>WAITING ⌛</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-zinc-300 whitespace-nowrap font-medium text-[11px]">
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-zinc-400 whitespace-nowrap max-w-[140px] truncate" title={item.userAgent}>
                            {parseBrowser(item.userAgent)}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-[#ffd7ed] whitespace-nowrap">
                            {item.ip}
                          </td>
                          <td className="p-3 pr-4 text-right font-mono text-[9px] text-zinc-600">
                            #{item.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* SUB-SECTION 2: VISITOR LOGIN TRACKER */}
            <div className="rounded-3xl border border-pink-500/20 bg-[#12041a]/70 backdrop-blur-xl p-5 md:p-6 shadow-xl shadow-black/40 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-pink-500/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4.5 w-4.5 text-pink-400" />
                  <h2 className="font-serif text-lg font-bold text-pink-100">
                    Visitor Access Attempt Logs
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClearLoginAttempts}
                  disabled={isActionPending || loginAttempts.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-red-500/25 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-300 text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-pointer"
                  title="Wipe attempt database records"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear Attempt Logs</span>
                </button>
              </div>

              {/* Login attempts table */}
              <div className="overflow-x-auto max-h-[280px] overflow-y-auto custom-scrollbar border border-pink-500/5 rounded-2xl bg-black/30">
                {isLoading && loginAttempts.length === 0 ? (
                  <div className="py-12 flex flex-col justify-center items-center text-zinc-500 space-y-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-pink-400" />
                    <p className="text-[11px] font-mono">Retrieving visitor streams...</p>
                  </div>
                ) : loginAttempts.length === 0 ? (
                  <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 font-sans">
                    <HelpCircle className="h-8 w-8 text-pink-500/30" />
                    <p className="text-xs font-semibold text-pink-250">No visitor activities tracked yet</p>
                    <p className="text-[10px] max-w-xs leading-relaxed text-zinc-500">
                      Access attempts are written here automatically when users submit the sweet memories pass formulary.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="border-b border-pink-500/15 bg-pink-500/5 text-pink-300 font-mono uppercase text-[9px] tracking-wider">
                        <th className="p-3.5 pl-4 font-bold">Input Name</th>
                        <th className="p-3.5 font-bold">Code Entered</th>
                        <th className="p-3.5 font-bold">Status Badge</th>
                        <th className="p-3.5 font-bold">Logged Timestamp</th>
                        <th className="p-3.5 font-bold">Browser / System</th>
                        <th className="p-3.5 pr-4 text-right font-bold">Network IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loginAttempts.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 pl-4 whitespace-nowrap text-zinc-200 font-semibold tracking-wide">
                            {item.name}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-pink-100 whitespace-nowrap truncate max-w-[120px]" title={item.code}>
                            {item.code}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {item.success ? (
                              <span className="bg-emerald-500/12 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md inline-block">
                                Match Success
                              </span>
                            ) : (
                              <span className="bg-rose-500/12 border border-rose-500/25 text-rose-400 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md inline-block">
                                Match Denied
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-zinc-400 whitespace-nowrap font-medium text-[10px]">
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-zinc-500 whitespace-nowrap truncate max-w-[120px]" title={item.userAgent}>
                            {parseBrowser(item.userAgent)}
                          </td>
                          <td className="p-3 pr-4 text-right font-mono text-[11px] text-[#ffd7ed] whitespace-nowrap">
                            {item.ip}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );

  const authScreen = (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      
      {/* BACKGROUND GRAPHIC */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 scale-102 blur-[2px] brightness-[0.52]"
        style={{
          backgroundImage: `url(${dikshuPortraitClean})`,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-950/50 via-black/80 to-[#12011b]/80 pointer-events-none z-0" />

      {/* ANIMATED PARTICLES BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 w-full h-full">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: '105vh', x: `${p.x}vw` }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              y: '-10vh',
              x: [`${p.x}vw`, `${p.x + (Math.sin(p.id) * 4)}vw`],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-pink-400/25"
            style={{ fontSize: p.size }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md z-20"
      >
        <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-pink-500/20 via-pink-600/25 to-purple-500/20 blur-xl pointer-events-none" />

        <div className="relative rounded-[32px] border border-pink-500/25 bg-[#0e0314]/92 backdrop-blur-2xl p-7 md:p-10 flex flex-col items-center">
          
          <div className="relative mb-6">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-pink-550 to-fuchsia-500 blur-md opacity-30 animate-pulse" />
            <div className="relative h-15 w-15 rounded-2xl bg-pink-500/5 border border-pink-500/20 flex items-center justify-center">
              <Lock className="h-7 w-7 text-pink-400" />
            </div>
          </div>

          <div className="text-center mb-6 space-y-2">
            <h1 className="font-serif tracking-wide text-[#ffd7ed] text-2xl font-black">
              Admin Authenticator
            </h1>
            <p className="font-sans text-stone-300 text-xs leading-relaxed max-w-xs mx-auto">
              Safeguard her data. Enter your safety passcode to adjust credentials and browse choice logs.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-pink-300">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Admin Passcode"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-pink-500/15 bg-black/55 hover:border-pink-500/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 text-white placeholder-pink-350/50 text-sm font-sans tracking-widest text-center outline-none transition-all duration-300"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-350 py-2.5 px-4 text-[11px] font-sans font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-md shadow-pink-500/10 active:scale-98 cursor-pointer flex items-center justify-center gap-2 group hover:shadow-lg disabled:opacity-40"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          </form>

          {isFullScreen && (
            <a
              href="/"
              className="mt-6 font-sans text-xs text-pink-300 hover:text-pink-100 transition-colors uppercase tracking-wider font-bold"
            >
              ← Back to Main Page
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );

  // Structural switch based on fullscreen state render
  if (isFullScreen) {
    return isAuthorized ? dashboardContent : authScreen;
  }

  // Else, render as a clean popup/modal trigger
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur background overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -15 }}
        className="relative w-full max-w-5xl rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#12051d] via-[#0a020f] to-[#040107] shadow-2xl shadow-pink-500/5 max-h-[90vh] overflow-y-auto z-10"
      >
        {isAuthorized ? dashboardContent : authScreen}
      </motion.div>
    </div>
  );
}
