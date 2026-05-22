"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

function Planet({
  radius,
  distance,
  speed,
  color,
}: {
  radius: number;
  distance: number;
  speed: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotate the entire group around the sun (Y axis)
      groupRef.current.rotation.y += delta * speed;
    }
    if (planetRef.current) {
      // Rotate the planet on its own axis
      planetRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.02, distance + 0.02, 64]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Mesh */}
      <Sphere ref={planetRef} args={[radius, 32, 32]} position={[distance, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
      </Sphere>
    </group>
  );
}

function SolarSystem() {
  const sunRef = useRef<THREE.Mesh>(null);
  const systemRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.5;
    }
    if (systemRef.current) {
      // Gentle floating animation for the entire system
      systemRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={systemRef} position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {/* Sun */}
      <Sphere ref={sunRef} args={[1.8, 32, 32]}>
        <meshStandardMaterial color="#fcd34d" emissive="#fbbf24" emissiveIntensity={1.5} />
      </Sphere>

      {/* Point light emitting from the sun */}
      <pointLight intensity={3} color="#fcd34d" distance={50} decay={2} />

      {/* Planets */}
      <Planet radius={0.2} distance={3.5} speed={0.8} color="#94a3b8" /> {/* Mercury */}
      <Planet radius={0.4} distance={5.5} speed={0.5} color="#fdba74" /> {/* Venus */}
      <Planet radius={0.5} distance={8} speed={0.3} color="#3b82f6" /> {/* Earth */}
      <Planet radius={0.35} distance={10.5} speed={0.2} color="#ef4444" /> {/* Mars */}
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 4, 15], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.8} color="#ffffff" />
        <SolarSystem />
      </Canvas>
    </div>
  );
}
