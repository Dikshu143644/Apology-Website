import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingEmoji {
  id: string;
  char: string;
  x: number; // percentage width of screen
  size: number; // in pixels
  duration: number; // float duration in seconds
  delay: number; // initial delay in seconds
  rotateStart: number;
  rotateEnd: number;
  driftX: number; // drift distance across the width
}

export default function NavEmojiBurst() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const handleBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ label: string }>;
      const { label } = customEvent.detail || {};
      if (!label) return;

      // Group theme mapping according to user requirements
      let emojiPool: string[] = ['✨', '💖', '🌸'];
      const normalizedLabel = label.trim().toLowerCase();

      if (normalizedLabel === 'home') {
        emojiPool = ['🏠', '✨', '💫'];
      } else if (normalizedLabel.includes('about')) {
        emojiPool = ['💗', '🫶', '✨'];
      } else if (normalizedLabel.includes('memories')) {
        emojiPool = ['📸', '🌸', '✨'];
      } else if (normalizedLabel.includes('reasons')) {
        emojiPool = ['💞', '💖', '✨'];
      } else if (normalizedLabel.includes('promise')) {
        emojiPool = ['💍', '🤍', '✨'];
      } else if (normalizedLabel.includes('letter')) {
        emojiPool = ['💌', '📝', '💗'];
      } else if (normalizedLabel.includes('gallery')) {
        emojiPool = ['🖼️', '🌷', '✨'];
      } else if (normalizedLabel.includes('forgive')) {
        emojiPool = ['🦋', '💖', '🌙'];
      }

      // Generate 15–25 matching emojis bursting in the background
      const count = Math.floor(Math.random() * 11) + 15; // 15 to 25
      const now = Date.now();

      const newEmojis: FloatingEmoji[] = Array.from({ length: count }).map((_, idx) => {
        const randomChar = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        return {
          id: `${now}-${idx}-${Math.random()}`,
          char: randomChar,
          x: 10 + Math.random() * 80, // centered across the navbar horizontal span (10vw to 90vw)
          size: 18 + Math.random() * 22, // slightly more elegant sizing (18px to 40px)
          duration: 1.0 + Math.random() * 1.2, // snappy, magical duration for top-only burst (1.0s to 2.2s)
          delay: Math.random() * 0.2, // fast staggered start
          rotateStart: (Math.random() - 0.5) * 35,
          rotateEnd: (Math.random() - 0.5) * 90 + (Math.random() > 0.5 ? 90 : -90),
          driftX: (Math.random() - 0.5) * 10, // subtle horizontal drift
        };
      });

      setEmojis((prev) => [...prev, ...newEmojis]);
    };

    window.addEventListener('nav-emoji-burst', handleBurst);
    return () => {
      window.removeEventListener('nav-emoji-burst', handleBurst);
    };
  }, []);

  const removeEmoji = (id: string) => {
    setEmojis((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[99] overflow-hidden">
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            initial={{
              y: '55px', // starts directly at the active navbar level
              x: `${emoji.x}vw`,
              opacity: 0,
              scale: 0.3,
              rotate: emoji.rotateStart,
            }}
            animate={{
              y: '-50px', // floats off the top edge of the screen immediately
              x: `${emoji.x + emoji.driftX}vw`,
              opacity: [0, 1.0, 0.8, 0], // magical quick peak opacity then fade out
              scale: [0.3, 1.1, 1.0, 0.5],
              rotate: emoji.rotateEnd,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: emoji.duration,
              delay: emoji.delay,
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeEmoji(emoji.id)}
            className="absolute drop-shadow-[0_0_8px_rgba(236,72,153,0.4)] select-none pointer-events-none"
            style={{
              fontSize: `${emoji.size}px`,
              willChange: 'transform, opacity',
            }}
          >
            {emoji.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
