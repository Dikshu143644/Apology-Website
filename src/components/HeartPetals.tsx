/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number; // left percentage
  y: number; // top percentage
  size: number;
  delay: number;
  duration: number;
  type: 'star' | 'heart' | 'petal';
  opacity: number;
}

export default function HeartPetals() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];

    // 1. Static/twinkling stars (70 stars scattered)
    for (let i = 0; i < 70; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
        type: 'star',
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    // 2. Slow drifting heart bubbles (20 hearts)
    for (let i = 0; i < 20; i++) {
      list.push({
        id: 100 + i,
        x: Math.random() * 100,
        y: Math.random() * 20 + 80, // tend to spawn at bottom
        size: Math.random() * 10 + 8,
        delay: Math.random() * 10,
        duration: Math.random() * 12 + 10, // float slow
        type: 'heart',
        opacity: Math.random() * 0.4 + 0.3,
      });
    }

    // 3. Falling cherry blossom petals (22 petals)
    for (let i = 0; i < 22; i++) {
      list.push({
        id: 200 + i,
        x: Math.random() * 100,
        y: Math.random() * -20, // spawn above screen
        size: Math.random() * 12 + 6,
        delay: Math.random() * 12,
        duration: Math.random() * 15 + 12, // graceful falling
        type: 'petal',
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    setParticles(list);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        if (p.type === 'star') {
          return (
            <div
              key={p.id}
              className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                opacity: p.opacity,
              }}
            />
          );
        }

        if (p.type === 'heart') {
          return (
            <div
              key={p.id}
              className="absolute text-pink-400 select-none animate-[floatUp_14s_linear_infinite]"
              style={{
                left: `${p.x}%`,
                bottom: `${100 - p.y}%`, // drift up from bottom
                fontSize: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                opacity: p.opacity,
              }}
            >
              💖
            </div>
          );
        }

        // Falling petals
        return (
          <div
            key={p.id}
            className="absolute bg-gradient-to-tr from-pink-300 to-pink-500 animate-[fallPetal_16s_linear_infinite]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              borderRadius: '70% 10% 70% 10%',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: p.opacity,
              boxShadow: '0 0 10px rgba(255,182,193,0.2)',
            }}
          />
        );
      })}


    </div>
  );
}
