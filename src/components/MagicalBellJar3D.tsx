import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Heart as HeartIcon, RotateCcw } from 'lucide-react';

// Cute chime sound on heart interaction using Web Audio API
const playHeartChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Sparkling C-Major pentatonic arpeggio
    const notes = [523.25, 659.25, 783.99, 880.00, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gainNode.gain.setValueAtTime(0, now + idx * 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.05 + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.5);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.6);
    });
  } catch (e) {
    console.warn('Audio blocked', e);
  }
};

// 1. BEATING 3D GLASS HEART DOME
function GlassHeartJar({ isOpen, hovered }: { isOpen: boolean; hovered: boolean }) {
  const jarRef = useRef<THREE.Group>(null);
  const coreHeartRef = useRef<THREE.Mesh>(null);

  // Custom Heart Shape for the Jar
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.bezierCurveTo(0, 0.5, 0.1, 0.9, 0.45, 0.9);
    shape.bezierCurveTo(0.85, 0.9, 0.9, 0.5, 0.9, 0.3);
    shape.bezierCurveTo(0.9, -0.1, 0.45, -0.5, 0, -0.9);
    shape.bezierCurveTo(-0.45, -0.5, -0.9, -0.1, -0.9, 0.3);
    shape.bezierCurveTo(-0.9, 0.5, -0.85, 0.9, -0.45, 0.9);
    shape.bezierCurveTo(-0.1, 0.9, 0, 0.5, 0, 0.5);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.8,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.2,
    bevelThickness: 0.2,
  }), []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Jar Animation
    if (jarRef.current) {
      const targetY = isOpen ? 3.5 : 0;
      jarRef.current.position.y = THREE.MathUtils.lerp(jarRef.current.position.y, targetY, delta * 3);
      jarRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      jarRef.current.rotation.z = Math.cos(time * 0.5) * 0.05;
    }

    // Core Heart Beat
    if (coreHeartRef.current) {
      const beatSpeed = hovered || isOpen ? 6 : 3;
      const pulse = 1 + (Math.sin(time * beatSpeed) * 0.05);
      coreHeartRef.current.scale.set(pulse, pulse, pulse);
      coreHeartRef.current.rotation.y = time * 0.8;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Wooden Base */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 32]} />
        <meshStandardMaterial color="#2d0a1b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* The Glass Heart Jar Outer shell */}
      <group ref={jarRef}>
        <mesh>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#ffecf5"
            transmission={0.95}
            thickness={1.5}
            roughness={0.05}
            ior={1.45}
            transparent
            opacity={0.4}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Decorative Top Knob */}
        <mesh position={[0, 1.1, 0.4]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Beating Heart Inside */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={coreHeartRef} position={[0, 0, 0.4]}>
          <extrudeGeometry args={[heartShape, { ...extrudeSettings, depth: 0.3, bevelSize: 0.05 }]} />
          <MeshDistortMaterial
            color="#ec4899"
            speed={2}
            distort={0.2}
            emissive="#ff0080"
            emissiveIntensity={1.5}
          />
        </mesh>
      </Float>

      {/* Internal Sparkles */}
      <Sparkles count={80} scale={2.5} size={3} speed={0.6} color="#f472b6" />
      <Sparkles count={30} scale={2} size={4} speed={0.3} color="#ffffff" />
    </group>
  );
}

// 2. CRYSTALLINE 3D BUTTERFLY (Procedural)
function CrystallineButterfly({ isOpen }: { isOpen: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.4, 0.5, 0.4, 0.5, 0);
    shape.bezierCurveTo(0.5, -0.4, 0.1, -0.3, 0, 0);
    return shape;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      if (isOpen) {
        // Fly out animation
        groupRef.current.position.y = 0.5 + Math.sin(time * 2) * 1.5;
        groupRef.current.position.x = Math.cos(time * 1.5) * 1.2;
        groupRef.current.position.z = Math.sin(time * 1.5) * 1.2;
        groupRef.current.rotation.y = time * 2;
      } else {
        // Hover inside
        groupRef.current.position.y = 0.3 + Math.sin(time * 1.5) * 0.2;
        groupRef.current.position.x = Math.sin(time * 0.8) * 0.3;
        groupRef.current.position.z = 0.5 + Math.cos(time * 0.8) * 0.2;
      }
    }

    const flap = Math.sin(time * 15) * 0.8;
    if (leftWing.current) leftWing.current.rotation.y = flap;
    if (rightWing.current) rightWing.current.rotation.y = -flap;
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.02, 0.2, 4, 8]} />
        <meshStandardMaterial color="#2d0a1b" />
      </mesh>
      {/* Left Wing */}
      <mesh ref={leftWing} position={[-0.02, 0, 0]}>
        <shapeGeometry args={[wingShape]} />
        <meshPhysicalMaterial
          color="#f472b6"
          transmission={0.8}
          thickness={0.5}
          roughness={0.1}
          side={THREE.DoubleSide}
          emissive="#ff77bb"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWing} position={[0.02, 0, 0]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[wingShape]} />
        <meshPhysicalMaterial
          color="#60a5fa"
          transmission={0.8}
          thickness={0.5}
          roughness={0.1}
          side={THREE.DoubleSide}
          emissive="#77bbff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// 3. MAIN COMPONENT
export default function MagicalBellJar3D() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [heartCount, setHeartCount] = useState(() => {
    return Number(localStorage.getItem('user_given_hearts') || '0');
  });

  const openJar = () => {
    if (isOpen) return;
    setIsOpen(true);
    playHeartChime();
  };

  const resetJar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const giveHeart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHeartCount(prev => {
      const next = prev + 1;
      localStorage.setItem('user_given_hearts', String(next));
      return next;
    });
    playHeartChime();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-4 rounded-3xl bg-[#1b0b23]/40 border border-pink-500/15 backdrop-blur-md shadow-2xl">
      <div className="mb-4 text-center z-10">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-bold text-pink-200 shadow-lg">
          <SparklesIcon className="h-4 w-4 text-pink-400 animate-pulse" />
          <span>{isOpen ? 'My Heart is Open! 💖' : 'Tap to Open My Heart'}</span>
        </span>
      </div>

      <div 
        className="w-full h-80 relative rounded-2xl overflow-hidden bg-radial from-pink-950/20 to-transparent cursor-pointer"
        onClick={isOpen ? giveHeart : openJar}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#ffd4e6" />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#60a5fa" />
          <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
          
          <React.Suspense fallback={null}>
            <GlassHeartJar isOpen={isOpen} hovered={hovered} />
            <CrystallineButterfly isOpen={isOpen} />
          </React.Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.5} 
          />
        </Canvas>
      </div>

      <div className="mt-5 flex flex-col items-center gap-4">
        {isOpen && (
          <div className="flex items-center gap-3 animate-fade-in">
            <button
              onClick={giveHeart}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-xl shadow-pink-500/20 active:scale-95 transition-all animate-pulse"
            >
              Give Heart 💖
            </button>
            <button
              onClick={resetJar}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-pink-300 hover:bg-white/10 transition-all"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        )}
        {heartCount > 0 && (
          <p className="text-xs font-mono text-pink-300 font-bold bg-pink-500/10 px-3 py-1 rounded-lg">
            💝 Total Hearts Given: {heartCount}
          </p>
        )}
      </div>
    </div>
  );
}
