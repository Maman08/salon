"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/lib/ThemeProvider";

function GlowingSphere({
  position,
  color,
  speed,
  size,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </Sphere>
    </Float>
  );
}

function GoldParticles({ isDark }: { isDark: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={isDark ? "#c9a96e" : "#2a9a5c"}
        transparent
        opacity={isDark ? 0.6 : 0.50}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ bg }: { bg: string }) {
  const isDark = bg === "#07090f";
  return (
    <>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={isDark ? 0.3 : 0.7} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 0.8 : 0.5} color={isDark ? "#c9a96e" : "#a8d8b0"} />
      <directionalLight position={[-5, 3, -5]} intensity={isDark ? 0.4 : 0.3} color={isDark ? "#d4a0a0" : "#c8ecd0"} />
      <pointLight position={[0, 0, 3]} intensity={isDark ? 0.6 : 0.3} color={isDark ? "#c9a96e" : "#b8e0c0"} />
      <pointLight position={[-3, -2, 2]} intensity={isDark ? 0.3 : 0.2} color={isDark ? "#d4a0a0" : "#d0f0d8"} />

      <GlowingSphere position={[-2.5, 1, -1]} color={isDark ? "#c9a96e" : "#8ecfa0"} speed={1.5} size={0.8} />
      <GlowingSphere position={[2.8, -0.5, -2]} color={isDark ? "#d4a0a0" : "#a8ddb8"} speed={1.2} size={0.6} />
      <GlowingSphere position={[0.5, 2, -1.5]} color={isDark ? "#e4d5b7" : "#c0eaca"} speed={1.8} size={0.4} />
      <GlowingSphere position={[-1.5, -1.5, -0.5]} color={isDark ? "#9e6b6b" : "#78c090"} speed={1.0} size={0.5} />
      <GlowingSphere position={[1.8, 1.5, -3]} color={isDark ? "#c9a96e" : "#b0dfc0"} speed={2.0} size={0.7} />

      <GoldParticles isDark={isDark} />
    </>
  );
}

/* ── Lightweight CSS fallback for mobile ──────────────────────────────────── */
function MobileFallback({ bg, isDark }: { bg: string; isDark: boolean }) {
  return (
    <div className="absolute inset-0 z-0" style={{ background: bg }}>
      {/* Animated gradient orbs — pure CSS, no Three.js overhead */}
      <div
        className="absolute w-[280px] h-[280px] rounded-full blur-[100px] opacity-30 animate-float"
        style={{
          background: isDark
            ? "radial-gradient(circle, #c9a96e 0%, transparent 70%)"
            : "radial-gradient(circle, #8ecfa0 0%, transparent 70%)",
          top: "10%",
          left: "-8%",
        }}
      />
      <div
        className="absolute w-[220px] h-[220px] rounded-full blur-[80px] opacity-25 animate-float"
        style={{
          background: isDark
            ? "radial-gradient(circle, #d4a0a0 0%, transparent 70%)"
            : "radial-gradient(circle, #a8ddb8 0%, transparent 70%)",
          top: "15%",
          right: "-5%",
          animationDelay: "-2s",
        }}
      />
      <div
        className="absolute w-[180px] h-[180px] rounded-full blur-[90px] opacity-20 animate-float"
        style={{
          background: isDark
            ? "radial-gradient(circle, #e4d5b7 0%, transparent 70%)"
            : "radial-gradient(circle, #c0eaca 0%, transparent 70%)",
          bottom: "20%",
          right: "10%",
          animationDelay: "-4s",
        }}
      />
    </div>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#07090f" : "#d8f0e0";
  const isDark = theme === "dark";

  // Only render Three.js canvas on screens >= 768px
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) {
    return <MobileFallback bg={bg} isDark={isDark} />;
  }

  return (
    <div className="absolute inset-0 z-0" style={{ background: bg }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: bg }}
      >
        <Scene bg={bg} />
      </Canvas>
    </div>
  );
}
