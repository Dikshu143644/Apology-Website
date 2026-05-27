/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'star' | 'heart' | 'sparkle';
  rotation: number;
  rotationSpeed: number;
}

interface ButterflyInstance {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  angle: number;
  targetAngle: number;
  color: string;
  wingScale: number;
  wingDir: number;
  flapSpeed: number;
  excited: boolean;
  wiggleScale: number;
  hue: number;
  hoverDelay: number;
  chaseTimer: number;
}

export default function ButterflyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const idleTimerRef = useRef(0);
  const sparklesRef = useRef<Sparkle[]>([]);
  const butterfliesRef = useRef<ButterflyInstance[]>([]);
  const lastMousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize 15 custom neon butterflies
    const colors = [
      'rgba(255, 75, 162, 0.95)',  // Hot Pink
      'rgba(255, 137, 212, 0.95)', // Sweet Pink
      'rgba(180, 115, 255, 0.95)', // Deep Lavender
      'rgba(255, 218, 240, 0.95)', // Crystalline White-Pink
      'rgba(130, 203, 255, 0.95)', // Ice Blue-Violet
    ];

    const generateButterfly = (edgeOnly = false): ButterflyInstance => {
      const size = Math.random() * 8 + 10; // size of butterfly body (10 to 18px)
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      if (edgeOnly) {
        // Spawn around boundaries
        if (Math.random() > 0.5) {
          x = Math.random() > 0.5 ? -20 : window.innerWidth + 20;
        } else {
          y = Math.random() > 0.5 ? -20 : window.innerHeight + 20;
        }
      }

      const hue = Math.floor(Math.random() * 40) + 320; // 320 to 360 (gorgeous pinks)
      const baseSpeed = Math.random() * 1.2 + 0.9;
      
      return {
        x,
        y,
        size,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 1.0, // bias drifting upwards
        baseSpeed,
        angle: Math.random() * Math.PI * 2,
        targetAngle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        wingScale: Math.random(),
        wingDir: Math.random() > 0.5 ? 1 : -1,
        flapSpeed: Math.random() * 0.15 + 0.15,
        excited: false,
        wiggleScale: Math.random() * 0.05 + 0.02,
        hue,
        hoverDelay: 0,
        chaseTimer: 0,
      };
    };

    // Populate arrays
    for (let i = 0; i < 16; i++) {
      butterfliesRef.current.push(generateButterfly());
    }

    const createSparkle = (x: number, y: number, type: 'star' | 'heart' | 'sparkle' = 'sparkle', customColor?: string) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 0.8;
      const pColor = customColor || `hsla(${Math.random() * 50 + 320}, 100%, 78%, ${Math.random() * 0.4 + 0.6})`;
      sparklesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 5 + 4,
        color: pColor,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    };

    // Handle mouse events to attract butterflies and leave sparkly trails
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = lastMousePosRef.current.x;
      const prevY = lastMousePosRef.current.y;
      
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      idleTimerRef.current = 0;

      // Spawn custom elegant interactive trails
      if (prevX !== -1000) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Spawn sparks in gaps for extra smoothness
        const density = Math.min(Math.floor(dist / 6), 5);
        for (let i = 0; i <= density; i++) {
          const ratio = density > 0 ? i / density : 1;
          const sx = prevX + dx * ratio;
          const sy = prevY + dy * ratio;

          // Cute sparkle choice
          let rndType: 'star' | 'heart' | 'sparkle' = 'sparkle';
          const r = Math.random();
          if (r < 0.2) rndType = 'heart';
          else if (r < 0.45) rndType = 'star';

          createSparkle(sx, sy, rndType);
        }
      }

      lastMousePosRef.current.x = e.clientX;
      lastMousePosRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      lastMousePosRef.current.x = -1000;
      lastMousePosRef.current.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      // Direct shockwave of beautiful custom particles
      for (let i = 0; i < 24; i++) {
        let pType: 'star' | 'heart' | 'sparkle' = 'sparkle';
        if (i % 3 === 0) pType = 'heart';
        else if (i % 3 === 1) pType = 'star';
        createSparkle(e.clientX, e.clientY, pType);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Helpers to draw paths
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.beginPath();
      c.translate(x, y);
      c.fillStyle = color;
      
      const width = s * 1.2;
      const height = s * 1.2;
      c.moveTo(0, height / 4);
      c.quadraticCurveTo(width / 2, -height / 2, width, height / 4);
      c.quadraticCurveTo(width, height * 0.75, 0, height);
      c.quadraticCurveTo(-width, height * 0.75, -width, height / 4);
      c.quadraticCurveTo(-width / 2, -height / 2, 0, height / 4);
      
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.translate(cx, cy);
      c.rotate(rot);
      c.beginPath();
      c.fillStyle = color;
      
      let rotStep = Math.PI / spikes;
      let x = cx;
      let y = cy;
      let angle = -Math.PI / 2;

      c.moveTo(0, -outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = Math.cos(angle) * outerRadius;
        y = Math.sin(angle) * outerRadius;
        c.lineTo(x, y);
        angle += rotStep;

        x = Math.cos(angle) * innerRadius;
        y = Math.sin(angle) * innerRadius;
        c.lineTo(x, y);
        angle += rotStep;
      }
      c.lineTo(0, -outerRadius);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Draw realistic vector butterflies
    const drawButterfly = (c: CanvasRenderingContext2D, b: ButterflyInstance) => {
      c.save();
      c.translate(b.x, b.y);
      c.rotate(b.angle + Math.PI / 2); // Rotate to match direction vector

      const size = b.size;
      const ws = Math.sin(b.wingScale); // Simulated 3D wing flapping

      // Glow effect of neon wings
      c.shadowBlur = b.excited ? 26 : 14;
      c.shadowColor = b.color;

      // Draw wings (symmetric pair left/right)
      ctx.fillStyle = b.color;
      
      // Top Wing Left
      ctx.beginPath();
      ctx.ellipse(-size * 0.3 * ws, -size * 0.4, Math.abs(size * 1.1 * ws), Math.abs(size * 0.8), -Math.PI / 7, 0, Math.PI * 2);
      ctx.fill();

      // Top Wing Right
      ctx.beginPath();
      ctx.ellipse(size * 0.3 * ws, -size * 0.4, Math.abs(size * 1.1 * ws), Math.abs(size * 0.8), Math.PI / 7, 0, Math.PI * 2);
      ctx.fill();

      // Bottom Wing Left
      ctx.beginPath();
      ctx.fillStyle = b.color; // darker tint
      ctx.ellipse(-size * 0.25 * ws, size * 0.4, Math.abs(size * 0.7 * ws), Math.abs(size * 0.55), -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Bottom Wing Right
      ctx.beginPath();
      ctx.ellipse(size * 0.25 * ws, size * 0.4, Math.abs(size * 0.7 * ws), Math.abs(size * 0.55), Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(-1, -size * 0.6);
      ctx.quadraticCurveTo(-4, -size * 1.1, -8, -size * 1.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(1, -size * 0.6);
      ctx.quadraticCurveTo(4, -size * 1.1, 8, -size * 1.3);
      ctx.stroke();

      // Butterfly Body
      ctx.beginPath();
      const bodyGrad = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.7);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(0.3, b.excited ? '#ffa6d7' : b.color);
      bodyGrad.addColorStop(1, '#1c0022');
      ctx.fillStyle = bodyGrad;
      ctx.ellipse(0, 0, Math.abs(size * 0.16), Math.abs(size * 0.65), 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Main animation loop
    let animId: number;
    const update = () => {
      // Clear with dark purple semi-transparent backdrop for trailing motion paths
      ctx.fillStyle = 'rgba(8, 3, 13, 0.15)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & Draw Sparkles
      const sparkles = sparklesRef.current;
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.rotation += s.rotationSpeed;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        if (s.type === 'heart') {
          drawHeart(ctx, s.x, s.y, s.size, s.color, s.alpha);
        } else if (s.type === 'star') {
          drawStar(ctx, s.x, s.y, 5, s.size, s.size * 0.45, s.color, s.alpha, s.rotation);
        } else {
          // Standard sparkling glare
          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = s.color;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Update & Draw Butterflies
      const butterflies = butterfliesRef.current;
      butterflies.forEach((b) => {
        // Flap calculation
        b.wingScale += b.flapSpeed * (b.excited ? 2.2 : 1.0);

        // Core AI Steering physics
        let targetSpeed = b.baseSpeed;
        
        // Interaction: Hover over / proximity tracker
        if (mx !== -1000) {
          const dx = mx - b.x;
          const dy = my - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            b.excited = true;
            // Guide towards the cursor playfully!
            b.targetAngle = Math.atan2(dy, dx) + Math.PI / 4 * Math.sin(Date.now() / 300);
            targetSpeed = b.baseSpeed * (dist < 50 ? 0.6 : 2.0); // slower near cursor to hover around

            // Emission of magical heart & star sparkles when hovered/close!
            if (Math.random() < 0.12) {
              const type = Math.random() > 0.6 ? 'heart' : 'sparkle';
              createSparkle(b.x, b.y, type, b.color);
            }
          } else {
            b.excited = false;
          }
        } else {
          b.excited = false;
        }

        // Drifty steer logic: gradually head towards targeted angle
        if (Math.random() < 0.04) {
          b.targetAngle += (Math.random() - 0.5) * Math.PI; // choose organic direction
        }

        // Steer slowly to have elegant arcs
        let diff = b.targetAngle - b.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        b.angle += diff * 0.08;

        // Apply velocity vectors
        const speed = targetSpeed;
        b.vx = Math.cos(b.angle) * speed;
        b.vy = Math.sin(b.angle) * speed;

        b.x += b.vx;
        b.y += b.vy;

        // Wrap around boundaries
        const pad = 40;
        if (b.x < -pad) b.x = canvas.width + pad;
        if (b.x > canvas.width + pad) b.x = -pad;
        if (b.y < -pad) b.y = canvas.height + pad;
        if (b.y > canvas.height + pad) b.y = -pad;

        drawButterfly(ctx, b);
      });

      animId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      id="butterflyCanvas"
    />
  );
}
