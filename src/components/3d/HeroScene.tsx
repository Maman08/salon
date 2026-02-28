"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrganicBlob({
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
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
          distort={0.4}
          speed={1.5}
          transparent
          opacity={0.35}
        />
      </Sphere>
    </Float>
  );
}

function LeafParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
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
        size={0.02}
        color="#c9a96e"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRing({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#f5f0e8" />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#c9a96e" />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#d4a0a0" />

      {/* Glowing spheres in gold & rose */}
      <OrganicBlob position={[-3, 1.5, -2]} color="#c9a96e" speed={1.2} size={1.0} />
      <OrganicBlob position={[3, -0.5, -3]} color="#d4a0a0" speed={0.9} size={0.8} />
      <OrganicBlob position={[0.5, 2.5, -2]} color="#e4d5b7" speed={1.5} size={0.5} />
      <OrganicBlob position={[-1.5, -2, -1]} color="#b07878" speed={0.7} size={0.6} />
      <OrganicBlob position={[2, 1.5, -4]} color="#a88b4a" speed={1.3} size={0.9} />

      {/* Decorative rings */}
      <FloatingRing position={[-2, 0, -1]} color="#c9a96e" scale={0.6} />
      <FloatingRing position={[2.5, 1, -2]} color="#d4a0a0" scale={0.4} />

      <LeafParticles />
      <Environment preset="night" />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
