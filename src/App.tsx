/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Activity, 
  MessageCircle, 
  Image as ImageIcon,
  ArrowDown, 
  Gift, 
  Smile, 
  Lock,
  Music,
  CheckCircle,
  HelpCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react';

import AudioEngine from './components/AudioEngine';
import ButterflyCanvas from './components/ButterflyCanvas';
import HeartPetals from './components/HeartPetals';
import NavEmojiBurst from './components/NavEmojiBurst';
import { ApologyModals } from './components/ApologyModals';
import AdminPanel from './components/AdminPanel';
import dikshuPortraitClean from './assets/images/dikshu_portrait_clean_1779319295919.png';
import regeneratedImage from './assets/images/regenerated_image_1779710814268.png';
import messageHeartBg from './assets/images/A-message-from-my-heart.png';
import aboutMePhoto from './assets/images/About-Me.png';
import LoginPage from './components/LoginPage';
import MagicalBellJar3D from './components/MagicalBellJar3D';
import MagicalButterfly from './components/MagicalButterfly';

export default function App() {
  const isAdminRoute = window.location.pathname === '/admin';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dikshu_authenticated') === 'true';
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [forgiveResponse, setForgiveResponse] = useState<'yes' | 'thinking' | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);

  const handleLogin = (name: string, code: string) => {
    localStorage.setItem('dikshu_authenticated', 'true');
    localStorage.setItem('dikshu_visitor_name', name);
    localStorage.setItem('dikshu_visitor_code', code);
    setIsAuthenticated(true);
  };

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Load decision on mount to restore her previous responses if any
  useEffect(() => {
    const saved = localStorage.getItem('localForgiveDecision');
    if (saved === 'yes' || saved === 'thinking') {
      setForgiveResponse(saved as 'yes' | 'thinking');
      if (saved === 'yes') {
        setCelebrationActive(true);
      }
    }
  }, []);

  const handleForgiveChoice = async (choice: 'yes' | 'thinking') => {
    setForgiveResponse(choice);
    localStorage.setItem('localForgiveDecision', choice);
    
    if (choice === 'yes') {
      setCelebrationActive(true);
    } else {
      setCelebrationActive(false);
    }

    try {
      await fetch('/api/forgive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });
    } catch (e) {
      console.error('Failed to notify decision to core server backend:', e);
    }
  };

  // Handle image load error to show cute alternative gradient
  const handleImgError = (id: string) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Me', href: '#about' },
    { label: 'Memories', href: '#memories' },
    { label: 'Reasons', href: '#reasons' },
    { label: 'Promise', href: '#promise' },
    { label: 'Letter', href: '#letter' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Forgive Me', href: '#forgive' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    
    // Trigger custom background emoji burst based on clicked nav link
    const matchingLink = navLinks.find(link => link.href === href);
    if (matchingLink) {
      window.dispatchEvent(new CustomEvent('nav-emoji-burst', { 
        detail: { label: matchingLink.label } 
      }));
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminRoute) {
    return <AdminPanel isFullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-[#07020d] text-white font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Background ambient light effects & real background image */}
      <div 
        className="fixed inset-[-10px] bg-cover bg-center bg-no-repeat pointer-events-none z-0 select-none blur-[1px] saturate-[1.15] brightness-[0.65] scale-[1.03] transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8, 3, 13, 0.15), rgba(8, 3, 13, 0.45)), url(${dikshuPortraitClean})`,
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(236,72,153,0.15),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(168,85,247,0.12),transparent_45%),radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.06),transparent_50%)] pointer-events-none z-0" />

      {/* Interactive Floating butterflies Canvas & Heart Blossom systems */}
      <ButterflyCanvas />
      <HeartPetals />
      <NavEmojiBurst />

      {/* HEADER / NAVIGATION BAR */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-40">
        <nav className="flex items-center justify-between px-6 py-3.5 rounded-full border border-pink-500/20 bg-[#12071c]/60 backdrop-blur-xl shadow-lg shadow-black/40">
          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleLinkClick('#home')}>
            <span className="font-serif font-black tracking-widest text-[#ffd7ed] text-lg sm:text-xl md:text-2xl hover:text-pink-300 transition-colors">
              OMKAR <span className="text-pink-500 font-sans">💖</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-[13px] font-medium text-pink-200/70 hover:text-pink-300 transition-all duration-200 cursor-pointer relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-pink-400 rounded-full group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Right Action Controllers */}
          <div className="flex items-center gap-3">
            {/* Romantic Synth Engine Controller */}
            <AudioEngine />

            {/* "For You 💖" button */}
            <button
              onClick={() => setActiveModal('messageModal')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-pink-500/30 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-pink-500/20 text-pink-200 text-xs font-semibold hover:border-pink-400 hover:text-white hover:shadow-lg hover:shadow-pink-500/20 transition-all active:scale-95 duration-300 cursor-pointer"
            >
              <span>For You</span>
              <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500/30 animate-pulse" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => {
                const nextState = !mobileMenuOpen;
                setMobileMenuOpen(nextState);
                if (nextState) {
                  window.dispatchEvent(new Event('close-music-player'));
                }
              }}
              className="lg:hidden p-2 text-pink-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[4.5rem] left-0 right-0 p-5 rounded-3xl border border-pink-500/20 bg-[#160a22]/95 backdrop-blur-xl shadow-2xl flex flex-col gap-4 z-50 text-center"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="py-1.5 text-sm font-semibold text-pink-100 hover:text-pink-400 border-b border-white/5"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); setActiveModal('messageModal'); }}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full text-xs shadow-md shadow-pink-500/20"
              >
                Read Heart Message 💌
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 sm:px-12 relative z-10">
        <MagicalButterfly />
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-bounce" />
              <span>To The Most Special Person</span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight glow-pink-sm">
              Dikshu,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-400">
                I'm Sorry...
              </span>
              <span className="inline-block animate-pulse ml-2 text-pink-500">💔</span>
            </h1>

            <p className="text-zinc-300 font-sans text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
              For everything. For every mistake. For every moment I failed to understand you. I was wrong in so many ways. But my love for you was never wrong. This website is a quiet harbor for the words I couldn't express.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveModal('messageModal')}
                className="px-7 py-3.5 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-full text-base tracking-wide flex items-center gap-2 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer duration-200"
              >
                <span>Read My Heart</span>
                <span>💌</span>
              </button>
              
              <button
                onClick={() => handleLinkClick('#about')}
                className="px-6 py-3.5 border border-pink-500/20 hover:border-pink-500/40 bg-white/5 hover:bg-pink-500/10 text-pink-300 font-semibold rounded-full text-base tracking-wide flex items-center gap-1 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Memories</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Scroll Down Indicator */}
            <div className="pt-8 flex flex-col items-start gap-1 text-pink-200/50 animate-bounce text-xs font-mono uppercase tracking-widest">
              <span>Scroll Down</span>
              <ArrowDown className="h-4.5 w-4.5 text-pink-400 self-center" />
            </div>
          </div>

          {/* Hero Portrait Right */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] md:max-w-[400px] aspect-[4/5] rounded-[42px] border border-pink-500/20 overflow-hidden shadow-2xl shadow-purple-950/40 bg-[#160a22]/40 backdrop-blur-lg flex items-center justify-center p-3">
              
              {/* Back glowing aura boundary */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-pink-500/20 pointer-events-none" />

              {/* Pulsing visual neon ring overlay */}
              <div className="absolute inset-4 rounded-[36px] border border-dashed border-pink-500/40 animate-[spin_120s_linear_infinite]" />
              <div className="absolute inset-6 rounded-[34px] border border-pink-500/10 animate-[pulse_4s_ease-in-out_infinite]" />

              {/* Glowing Orb Ring back splash */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full border border-pink-500/30 shadow-[0_0_80px_rgba(244,63,94,0.35)] animate-pulse" />
              </div>

              {/* Main portrait image image container */}
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-tr from-[#12071a] via-[#2a0e36] to-[#0c0312]">
                {!imgErrors[dikshuPortraitClean] ? (
                  <img
                    src={dikshuPortraitClean}
                    alt="Dikshu"
                    onError={() => handleImgError(dikshuPortraitClean)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-pink-100 relative">
                    <Heart className="h-16 w-16 text-pink-400 fill-pink-500/20 mb-4 animate-pulse" />
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">Beautiful Dikshu</h3>
                    <p className="text-xs text-pink-200/70 max-w-[240px]">
                      A dreamy glow framing your sweet charm. (Custom image placeholder)
                    </p>
                    <div className="absolute bottom-4 left-4 right-4 py-2 border border-pink-500/20 rounded-xl bg-black/40 backdrop-blur-sm">
                      <span className="font-serif text-[10px] tracking-wider uppercase opacity-85">Princess Glow</span>
                    </div>
                  </div>
                )}

                {/* Ambient glow shield */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0414] via-transparent to-transparent opacity-80" />

                {/* Little Floating Neon Butterfly Decal Overlay */}
                <span className="absolute top-12 left-10 text-xl text-pink-400 drop-shadow-[0_0_8px_rgba(255,100,180,0.8)] animate-[bounce_3s_infinite]">🦋</span>
                <span className="absolute bottom-16 right-10 text-lg text-fuchsia-400 drop-shadow-[0_0_8px_rgba(255,100,180,0.8)] animate-[bounce_4s_infinite_1s]">🦋</span>

                {/* Subtitle details */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-serif text-sm font-extrabold text-pink-100">Dikshu</h4>
                        <p className="text-[11px] text-zinc-300 font-medium leading-none">Your presence frames my cosmos</p>
                      </div>
                      <Heart className="h-4.5 w-4.5 text-pink-400 fill-pink-400 animate-pulse" />
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Wavy bottom divider curves inside hero */}
        <div className="absolute bottom-0 left-0 right-0 h-10 w-full overflow-hidden pointer-events-none z-10 translate-y-2">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full text-[#08020d] fill-current">
            <path d="M0,0 C150,90 350,110 600,60 C850,10 1050,40 1200,80 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* DETAILED CONTENT SECTIONS CONTAINER */}
      <main className="relative z-20 space-y-16 py-12 px-4 sm:px-8 max-w-6xl mx-auto font-sans">
        
        {/* SECTION: ABOUT ME, OUR MEMORIES, WHY YOU MATTER */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bento Card 1: ABOUT ME (Col span 4) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-4 rounded-3xl border border-pink-500/10 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.55] transition-opacity duration-300"
                style={{ backgroundImage: `url(${aboutMePhoto})` }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-[#1b0012]/60 to-black/85" />

              {/* Back glowing ambient node */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-pink-100 tracking-tight">About Me</h3>
                  <Heart className="h-4 w-4 text-pink-400 fill-pink-500/20" />
                </div>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-normal">
                  I'm Omkar. Just a guy who loved you more than himself. My love was always one-sided, but it was real, pure, and endless.
                </p>
                <p className="text-pink-400 font-serif text-sm italic font-extrabold tracking-wide">
                  That's why I'm here... <br />to say I'm truly sorry.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('aboutModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold transition-all hover:border-pink-400/40 cursor-pointer flex items-center justify-center gap-1.5 duration-200"
                >
                  <span>Know More About Me</span>
                  <span>🙇</span>
                </button>
              </div>
            </motion.div>

            {/* Bento Card 2: OUR MEMORIES (Col span 5) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-5 rounded-3xl border border-pink-500/10 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
              id="memories"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.35] transition-opacity duration-300"
                style={{ backgroundImage: "url('/images/promise-bg.jpg')" }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-[#1b0012]/60 to-black/85" />

              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-pink-100 tracking-tight">Our Memories</h3>
                  <span className="text-pink-400 font-serif font-semibold text-xs uppercase tracking-widest">Est. 5th Std</span>
                </div>
                
                {/* Visual miniature timeline preview cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    { id: 1, text: 'Childhood Days', desc: 'Used to play...' },
                    { id: 2, text: 'School Memories', desc: 'Innocent days' },
                    { id: 3, text: 'The Change', desc: 'When you knew' },
                    { id: 4, text: 'The Distance', desc: 'Reality now' },
                  ].map((p) => (
                    <div key={p.id} className="p-2.5 rounded-2xl bg-black/35 border border-pink-500/5 relative overflow-hidden flex flex-col text-left">
                      <span className="absolute -top-1 -right-1 text-4xl text-pink-400/10 font-serif font-black">{p.id}</span>
                      <span className="text-[12px] font-bold text-pink-200 truncate pr-4">{p.text}</span>
                      <span className="text-[10px] text-zinc-400 truncate mt-0.5">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('galleryModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold transition-all hover:border-pink-400/40 cursor-pointer flex items-center justify-center gap-1.5 duration-200"
                >
                  <span>View All Memories</span>
                  <span>📖</span>
                </button>
              </div>
            </motion.div>

            {/* Bento Card 3: WHY YOU MATTER (Col span 3) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 rounded-3xl border border-pink-500/10 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
              id="reasons"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.40] transition-opacity duration-300"
                style={{ backgroundImage: "url('/images/ChatGPT%20Image%20May%2025,%202026,%2004_39_57%20PM.png')" }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-[#1b0012]/65 to-black/85" />

              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-pink-100 tracking-tight">Why You Matter</h3>
                  <Heart className="h-4_5 w-4_5 text-pink-500 fill-pink-500" />
                </div>
                
                {/* List item bullets with tiny pink heart indicators */}
                <div className="space-y-2 text-left">
                  {[
                    'You are highly special to me',
                    'You changed my path & life',
                    'You made me a better person',
                    'You hold the kindest heart',
                    'You deserve cosmic happiness',
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Heart className="h-3 w-3 text-pink-500 fill-pink-500 mt-1 flex-shrink-0 animate-pulse" />
                      <span className="text-[11.5px] font-medium text-pink-200/90 leading-tight">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('matterModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold transition-all hover:border-pink-400/30 cursor-pointer flex items-center justify-center gap-1 hover:border-pink-400 duration-200"
                >
                  <span>Read More</span>
                </button>
              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION: PROMISES, ENVELOPE/LETTER & GALLERY PREVIEW */}
        <section className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bento Card 4: MY PROMISES TO YOU (Col span 4) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-4 rounded-3xl border border-pink-500/10 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
              id="promise"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.35] transition-opacity duration-300"
                style={{ backgroundImage: "url('/images/promise-bg.jpg')" }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-[#1b0012]/60 to-black/85" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-pink-100 tracking-tight">My Promises To You</h3>
                  <span className="text-xs uppercase font-mono tracking-wider text-pink-300">Faithful Promises</span>
                </div>

                {/* Elegant listing boxes with heart indicators on the left side */}
                <div className="space-y-2 pt-1">
                  {[
                    'I will always respect your decisions.',
                    'I will never disturb your peace again.',
                    'I will pray for your happiness.',
                    'I will become a better person.',
                    'I will always cherish our memories.',
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-black/25 border border-white/5 text-left">
                      <div className="h-5 w-5 rounded-full bg-pink-500/15 flex items-center justify-center text-[10px] text-pink-300 font-bold border border-pink-500/25">
                        {idx + 1}
                      </div>
                      <span className="text-[11.5px] font-medium text-pink-100/95 leading-snug">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('promiseModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold transition-all hover:border-pink-400/40 cursor-pointer flex items-center justify-center gap-1 duration-200"
                >
                  <span>My Promise To You</span>
                  <span>💍</span>
                </button>
              </div>
            </motion.div>

            {/* Bento Card 5: HEART ENVELOPE / QUOTATION LETTER (Col span 5) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-5 rounded-3xl border border-pink-500/20 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-center"
              id="letter"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.55] transition-opacity duration-300"
                style={{ backgroundImage: `url(${messageHeartBg})` }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-[#1b0012]/55 to-black/80" />

              {/* Giant glowing background heart */}
              <div className="absolute inset-x-0 -top-6 flex justify-center opacity-[0.05] animate-pulse">
                <Heart className="w-80 h-80 text-pink-500 fill-pink-500" />
              </div>

              <div className="space-y-4 relative z-10 my-auto py-4">
                <span className="text-[34px] font-serif text-pink-400 leading-none block">“</span>
                
                <h4 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-pink-100 italic px-2">
                  A Message From My Heart
                </h4>
                
                <p className="text-pink-200/90 font-serif font-semibold text-xs sm:text-sm leading-relaxed max-w-sm mx-auto italic">
                  You told me to leave. <br />
                  You told me to die. <br />
                  You told me you never loved me. <br />
                  And still... I stayed. <br />
                  Not because I needed you. <br />
                  But because my heart always chose you.
                </p>

                {/* Glowing holographic ambient heart symbol */}
                <div className="w-16 h-16 rounded-full border border-pink-400/20 flex items-center justify-center mx-auto my-3 bg-pink-500/5 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                  <Heart className="h-6 w-6 text-pink-400 fill-pink-500/30 animate-pulse" />
                </div>
              </div>

              <div className="pt-6 relative z-10 w-full">
                <button
                  onClick={() => setActiveModal('messageModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-400/40 bg-gradient-to-r from-pink-500/25 to-purple-600/25 hover:from-pink-500/40 hover:to-purple-600/40 text-pink-200 text-xs sm:text-sm font-semibold transition-all hover:border-pink-300 shadow-md shadow-pink-500/10 cursor-pointer flex items-center justify-center gap-1.5 duration-200 animate-pulse"
                >
                  <span>Read My Full Letter</span>
                  <span>✉️</span>
                </button>
              </div>
            </motion.div>

            {/* Bento Card 6: PHOTO GRID GALLERY (Col span 3) */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 rounded-3xl border border-pink-500/10 bg-black/45 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
              id="gallery"
            >
              {/* Romantic background image overlay */}
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.35] transition-opacity duration-300"
                style={{ backgroundImage: "url('/images/modal-bg.jpg')" }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-[#1b0012]/60 to-black/85" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-pink-100 tracking-tight">Our Moments</h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-pink-300">Frames</span>
                </div>

                {/* Grid of 6 small thumbnails placeholders */}
                <div className="grid grid-cols-3 gap-2.5 pt-1.5">
                  {[
                    "/images/memory-1.jpg",
                    "/images/memory-2.jpg",
                    "/images/memory-3.jpg",
                    "/images/memory-4.jpg",
                    "/images/memory-5.jpg",
                    "/images/memory-6.jpg"
                  ].map((img, idx) => (
                    <div
                      key={img}
                      className="aspect-square rounded-xl bg-pink-900/10 overflow-hidden border border-white/5 relative hover:border-pink-500/40 hover:scale-105 transition-all duration-300"
                    >
                      {!imgErrors[img] ? (
                        <img
                          src={img}
                          alt="Memory thumbnail"
                          onError={() => handleImgError(img)}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale-25"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-purple-950/60 to-pink-900/40 flex items-center justify-center p-1 text-center">
                          <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-500/25 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('galleryModal')}
                  className="w-full py-2.5 px-4 rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/20 text-pink-300 text-xs sm:text-sm font-semibold transition-all hover:border-pink-400/40 cursor-pointer flex items-center justify-center gap-1 duration-200"
                >
                  <span>View Full Gallery</span>
                  <span>🖼️</span>
                </button>
              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION: DECISION FORGIVENESS & MAGICAL BELL JAR */}
        <section id="forgive" className="scroll-mt-24 pt-6">
          <div className="rounded-3xl border border-pink-500/20 bg-[#100315]/85 backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Romantic background image overlay */}
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.55] transition-opacity duration-300"
              style={{ backgroundImage: "url('/images/modal-bg.jpg')" }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-[#1b0012]/55 to-black/80" />

            {/* Glowing background meshes inside forgiveness section */}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Question Text Desk Left */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500 fill-pink-500 animate-bounce" />
                  <span className="font-serif text-sm tracking-wider uppercase text-pink-300 font-bold">Forgive Me?</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-pink-100 tracking-tight leading-none">
                  For Forgiving Me...
                </h2>

                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-normal">
                  I don't expect you to forgive me easily. I just hope one day, you'll understand that my love was never fake. It was just... one-sided. If you can find it in your heart to forgive me someday, I will be the luckiest person alive.
                </p>

                <p className="text-pink-300 font-serif font-extrabold italic text-sm tracking-wide">
                  "If you can forgive me, I'll be the luckiest person alive."
                </p>

                {/* INTERACTIVE CHOICE BUTTONS CONTROLLER */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleForgiveChoice('yes')}
                    className={`px-6 py-3 font-bold rounded-full text-sm sm:text-base tracking-wide flex items-center gap-1.5 shadow-lg cursor-pointer transition-all duration-300 active:scale-95 ${
                      forgiveResponse === 'yes'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white shadow-pink-500/20 hover:shadow-pink-500/40'
                    }`}
                  >
                    <span>Yes, I Forgive You</span>
                    <span>{forgiveResponse === 'yes' ? '✨💖' : '💖'}</span>
                  </button>

                  <button
                    onClick={() => handleForgiveChoice('thinking')}
                    className={`px-6 py-3 font-semibold rounded-full text-sm sm:text-base tracking-wide cursor-pointer transition-all duration-300 ${
                      forgiveResponse === 'thinking'
                        ? 'border border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border border-pink-500/20 hover:border-pink-500/40 bg-white/5 hover:bg-pink-500/10 text-pink-300'
                    }`}
                  >
                    <span>Still Thinking...</span>
                    {forgiveResponse === 'thinking' && <span className="ml-1">⌛</span>}
                  </button>
                </div>

                {/* DYNAMIC FADE-IN RESPONSE TEXT */}
                <AnimatePresence mode="wait">
                  {forgiveResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className={`p-6 rounded-2xl border mt-5 text-left relative overflow-hidden transition-all duration-500 ${
                        forgiveResponse === 'yes'
                          ? 'border-emerald-500/40 bg-gradient-to-br from-[#0c2415]/95 via-[#06150c]/98 to-[#020704]/99 shadow-[0_0_40px_rgba(16,185,129,0.18)]'
                          : 'border-pink-500/10 bg-[#160a22]/80 backdrop-blur-md shadow-lg shadow-black/30'
                      }`}
                    >
                      {/* Left glow side beam */}
                      <div className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${
                        forgiveResponse === 'yes' ? 'bg-gradient-to-b from-emerald-400 to-teal-500 animate-pulse' : 'bg-pink-500'
                      }`} />

                      {/* Sparkly decorative floating stars in YES card background */}
                      {forgiveResponse === 'yes' && (
                        <>
                          <div className="absolute top-2 right-4 text-emerald-400/20 text-lg animate-pulse">✨</div>
                          <div className="absolute bottom-3 right-10 text-teal-400/10 text-xl animate-bounce delay-300">🌸</div>
                          <div className="absolute top-8 right-16 text-emerald-300/10 text-sm animate-ping">💖</div>
                        </>
                      )}

                      {forgiveResponse === 'yes' ? (
                        <div className="space-y-2 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold">🥺</span>
                            <h4 className="font-serif text-lg font-bold text-emerald-300 tracking-tight">
                              Thank you, Dikshu... You have made me the happiest person
                            </h4>
                          </div>
                          <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
                            Your forgiveness is the most precious gift I could ever receive in my life. I will honor, cherish, and protect your trust, your space, and your boundaries with every single breath I take. I promise to be a constant source of respect, absolute safety, and genuine peace for you always. Thank you for giving my heart peace.
                          </p>
                          <div className="pt-1.5 flex items-center gap-1 text-xs text-emerald-400 font-mono">
                            <span>✨ Trust restored & protected forever</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 relative z-10">
                          <h4 className="font-serif text-base font-bold text-pink-200">Take all the time you need... ⌛</h4>
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            I completely understand. Your comfort, space, and peace are the absolute most important things to me. I will never push you. I will wait at a respectful distance, praying for your happiness and laughing always.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Magical interactive 3D Glass Jar Dome Right */}
              <div className="lg:col-span-5 flex justify-center py-6">
                <MagicalBellJar3D />
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-pink-500/10 py-10 text-center text-zinc-500/80 font-sans text-xs sm:text-sm z-30 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="font-serif font-black tracking-widest text-pink-300 text-sm">FOR DIKSHU</span>
            <span>💖</span>
          </div>
          <p className="font-medium text-pink-200/40">
            Made with apology, honesty, respect, and infinite hope.
          </p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-mono text-zinc-600">
              © {new Date().getFullYear()} Omkar. All decisions respected.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={() => setAdminOpen(true)}
                className="flex items-center gap-1 text-[10px] font-mono text-zinc-600/50 hover:text-pink-400/70 transition-colors cursor-pointer focus:outline-none"
              >
                <Lock className="h-2.5 w-2.5" />
                <span>Admin Console Keys</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('dikshu_authenticated');
                  window.location.reload();
                }}
                className="flex items-center gap-1 text-[10px] font-mono text-red-600/50 hover:text-red-400 transition-colors cursor-pointer focus:outline-none"
              >
                <LogOut size={10} />
                <span>Logout & See Login Page</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* APOLOGY OVERLAY MODALS SYSTEM */}
      <ApologyModals 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />

      {/* SECURE ADMIN RESPONSE CONSOLE */}
      <AdminPanel 
        isOpen={adminOpen} 
        onClose={() => setAdminOpen(false)} 
        onLogoutSite={() => {
          localStorage.removeItem('dikshu_authenticated');
          window.location.reload();
        }}
      />

    </div>
  );
}
