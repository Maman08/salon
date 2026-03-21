"use client";

import { useRef } from "react";
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

export default function HeroScene() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#07090f" : "#d8f0e0";

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
