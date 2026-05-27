import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, 
  Sparkles, Heart, Calendar, ArrowRight, Eye
} from 'lucide-react';

// Import real asset images
import dikshuPortraitClean from '../assets/images/dikshu_portrait_clean_1779319295919.png';
import dikshuPortrait from '../assets/images/dikshu_portrait_1779318976000.png';
import regeneratedImage from '../assets/images/regenerated_image_1779710814268.png';

interface MemoryItem {
  src: string;
  cap: string;
  desc: string;
  date?: string;
}

interface MemoryGalleryProps {
  onPhotoClick?: (src: string) => void;
}

export default function MemoryGallery({ onPhotoClick }: MemoryGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; val: string }[]>([]);

  // The 10 real photos
  const memories: MemoryItem[] = [
    { 
      src: '/images/memory-1.jpg', 
      cap: 'Cherished Moment', 
      desc: 'A beautiful memory that I will keep in my heart forever.',
      date: 'Sweet Memory'
    },
    { 
      src: '/images/memory-2.jpg', 
      cap: 'Pure Happiness', 
      desc: 'The way you smile makes everything feel better.',
      date: 'Pure Moment'
    },
    { 
      src: '/images/memory-3.jpg', 
      cap: 'Eternal Grace', 
      desc: 'Your elegance is something I always admired.',
      date: 'Golden Days'
    },
    { 
      src: '/images/memory-4.jpg', 
      cap: 'Special Day', 
      desc: 'A day that reminded me why you are so special to me.',
      date: 'Legacy Memory'
    },
    { 
      src: '/images/memory-5.jpg', 
      cap: 'Sweetest Smile', 
      desc: 'Every time I see this, I remember your kind heart.',
      date: 'Heartfelt'
    },
    { 
      src: '/images/memory-6.jpg', 
      cap: 'Innocent Laughs', 
      desc: 'The simple joys we shared mean the world to me.',
      date: 'Old Days'
    },
    { 
      src: '/images/memory-7.jpg', 
      cap: 'The Glow', 
      desc: 'You always had this radiant light around you.',
      date: 'Radiance'
    },
    { 
      src: '/images/memory-8.jpg', 
      cap: 'Beautiful Soul', 
      desc: 'Your beauty is not just outside, but deep within.',
      date: 'Soulful'
    },
    { 
      src: '/images/memory-9.jpg', 
      cap: 'Nostalgic Trace', 
      desc: 'A moment captured in time that I often look back on.',
      date: 'Nostalgia'
    },
    { 
      src: '/images/memory-10.jpg', 
      cap: 'Dreamy Memory', 
      desc: 'I wish I could go back to this moment just for a second.',
      date: 'Eternal'
    }
  ];

  // Floating hearts/sparkles generator for Lightbox
  const triggerSparkle = (x: number, y: number) => {
    const symbols = ['💖', '✨', '🌸', '💝', '⭐'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const id = Date.now() + Math.random();
    setSparkles((prev) => [...prev, { id, x, y, val: randomSymbol }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 2000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % memories.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + memories.length) % memories.length : 0));
      } else if (e.key === 'Escape') {
        setSelectedIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  return (
    <div className="space-y-6 font-sans">
      <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed bg-pink-950/40 p-4 rounded-2xl border border-pink-500/20 text-left flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-pink-300 shrink-0 mt-0.5 animate-pulse" />
        <span>
          A beautiful collection of your 10 actual photos. Click any image to trigger the luxury fullscreen aesthetic lightbox of memories.
        </span>
      </p>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
        {memories.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8, scale: 1.01 }}
            className="bg-white p-3.5 pb-4.5 rounded-sm shadow-xl shadow-black/70 border border-neutral-150 text-neutral-800 font-sans w-full flex flex-col cursor-pointer group"
            onClick={() => {
              setSelectedIdx(idx);
              if (onPhotoClick) onPhotoClick(item.src);
            }}
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full rounded-xs bg-[#fdf2f8] overflow-hidden mb-3.5 border border-neutral-100 flex items-center justify-center">
              <img
                src={item.src}
                alt={item.cap}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500 scale-[1.01] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-pink-950/5 opacity-40 group-hover:opacity-0 transition-opacity pointer-events-none" />
              
              {/* Zoom overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-pink-600/90 text-white p-2.5 rounded-full scale-90 group-hover:scale-100 transition-transform">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Polaroid Description info */}
            <div className="space-y-1 select-none text-left">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-black text-xs sm:text-sm tracking-tight text-pink-950 leading-tight">
                  {item.cap}
                </h4>
                {item.date && (
                  <span className="text-[9px] font-mono text-pink-850 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-sm">
                    {item.date}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal font-medium max-w-[210px] truncate-3-lines">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Background Blur Overlay */}
            <div
              className="absolute inset-0 bg-black/92 backdrop-blur-xl pointer-events-auto"
              onClick={() => setSelectedIdx(null)}
            />

            {/* Sparkle background animation canvas overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 font-sans">
              {sparkles.map((sp) => (
                <motion.div
                  key={sp.id}
                  initial={{ opacity: 1, scale: 0.5, x: sp.x, y: sp.y }}
                  animate={{ opacity: 0, scale: 2, y: sp.y - 120, x: sp.x + (Math.random() * 60 - 30) }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="absolute text-xl sm:text-2xl"
                >
                  {sp.val}
                </motion.div>
              ))}
            </div>

            {/* Central Box Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="
                relative
                max-h-[95vh]
                w-full
                max-w-[95vw]
                overflow-y-auto
                rounded-[34px]
                border
                border-pink-300/30
                bg-[#120014]/70
                p-3
                shadow-[0_0_90px_rgba(236,72,153,0.35)]
                backdrop-blur-2xl
                sm:p-4
                lg:max-w-6xl
                group
                pointer-events-auto
              "
              onClick={(e) => {
                // Click creates dynamic romantic sparkles
                triggerSparkle(e.clientX, e.clientY);
              }}
            >
              {/* Close Button top-right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx(null);
                }}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-pink-600 border border-white/20 hover:border-pink-500 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                title="Close Lightbox"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Master Responsive Grid */}
              <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_320px] pt-8 lg:pt-0">
                
                {/* Image Section */}
                <div className="relative">
                  {/* Image Wrapper */}
                  <div className="
                    flex
                    min-h-[260px]
                    max-h-[85vh]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-pink-200/20
                    bg-black/35
                    p-3
                  ">
                    <img
                      src={memories[selectedIdx].src}
                      alt={memories[selectedIdx].cap}
                      className="
                        mx-auto
                        h-auto
                        w-auto
                        max-h-[82vh]
                        max-w-full
                        rounded-3xl
                        object-contain
                        shadow-[0_0_60px_rgba(236,72,153,0.35)]
                      "
                    />
                  </div>

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIdx((prev) => (prev !== null ? (prev - 1 + memories.length) % memories.length : 0));
                    }}
                    className="
                      absolute
                      left-2
                      top-1/2
                      z-20
                      -translate-y-1/2
                      rounded-full
                      border
                      border-pink-200/25
                      bg-black/55
                      p-2
                      text-pink-100
                      backdrop-blur-md
                      transition
                      hover:bg-pink-500/20
                      md:left-4
                      md:p-3
                    "
                    title="Previous Memory"
                  >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIdx((prev) => (prev !== null ? (prev + 1) % memories.length : 0));
                    }}
                    className="
                      absolute
                      right-2
                      top-1/2
                      z-20
                      -translate-y-1/2
                      rounded-full
                      border
                      border-pink-200/25
                      bg-black/55
                      p-2
                      text-pink-100
                      backdrop-blur-md
                      transition
                      hover:bg-pink-500/20
                      md:right-4
                      md:p-3
                    "
                    title="Next Memory"
                  >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                  </button>

                  {/* Informative sparkle hint */}
                  <div className="absolute bottom-3 left-3 bg-black/65 border border-pink-500/25 px-2.5 py-1 rounded-full text-[9px] text-pink-300 pointer-events-none tracking-wide select-none">
                    💖 Tap anywhere to release ambient sparkles
                  </div>
                </div>

                {/* Info and Details Section */}
                <div className="text-center lg:text-left space-y-4 select-none text-white p-2">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-black text-[#ffd7ed] drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                        {memories[selectedIdx].cap}
                      </h3>
                      {memories[selectedIdx].date && (
                        <span className="text-[10px] text-pink-350 bg-pink-500/15 border border-pink-500/35 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wide">
                          {memories[selectedIdx].date}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {memories[selectedIdx].desc}
                    </p>
                  </div>

                  <div className="border-t border-pink-500/10 pt-4 space-y-2">
                    <div className="text-[11px] font-mono text-pink-400 font-bold">
                      Memory Photo {selectedIdx + 1} of {memories.length}
                    </div>
                    <div className="text-[10px] text-stone-500 leading-normal">
                      Use Arrow Keys on your keyboard to browse seamlessly.
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
