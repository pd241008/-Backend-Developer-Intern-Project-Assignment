"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, Box, Text, Html, Line } from "@react-three/drei";
import * as THREE from "three";

function DataPacket({ start, end, speed = 1, color = "#d9482b" }: { start: [number, number, number], end: [number, number, number], speed?: number, color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random()); // Start at random progress

  useFrame((state, delta) => {
    if (ref.current) {
      progress.current += delta * speed;
      if (progress.current > 1) progress.current = 0;
      
      ref.current.position.x = start[0] + (end[0] - start[0]) * progress.current;
      ref.current.position.y = start[1] + (end[1] - start[1]) * progress.current;
      ref.current.position.z = start[2] + (end[2] - start[2]) * progress.current;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

function ServerNode({ position, label }: { position: [number, number, number], label: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={ref}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <MeshTransmissionMaterial 
            backside 
            samples={2} 
            thickness={1} 
            roughness={0.2} 
            transmission={0.9} 
            ior={1.5} 
            chromaticAberration={0.05} 
          />
        </mesh>
        
        {/* Core glow */}
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#d9482b" emissive="#d9482b" emissiveIntensity={1} />
        </mesh>

        <Html position={[0, -1.2, 0]} center className="pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap text-gray-900 border border-gray-200">
            {label}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function ConnectionLine({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color="#a0aec0"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

export default function ArchitectureModel() {
  const nodes = {
    client: [-4, 0, 0] as [number, number, number],
    router: [0, 2, 0] as [number, number, number],
    controller: [0, -2, 0] as [number, number, number],
    database: [4, 0, 0] as [number, number, number],
  };

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#f4f5f7] to-[#e4e4e9] border border-gray-200 shadow-inner relative">
      <div className="absolute top-4 left-4 z-10 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold text-gray-800 shadow-sm">
        ExpressKit Request Lifecycle
      </div>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#f28e2c" />
        
        {/* Nodes */}
        <ServerNode position={nodes.client} label="Client" />
        <ServerNode position={nodes.router} label="Router / Middleware" />
        <ServerNode position={nodes.controller} label="Controller" />
        <ServerNode position={nodes.database} label="Database" />

        {/* Connections */}
        <ConnectionLine start={nodes.client} end={nodes.router} />
        <ConnectionLine start={nodes.router} end={nodes.controller} />
        <ConnectionLine start={nodes.controller} end={nodes.database} />
        
        {/* Data Packets (Request) */}
        <DataPacket start={nodes.client} end={nodes.router} speed={0.8} color="#3b82f6" />
        <DataPacket start={nodes.router} end={nodes.controller} speed={0.8} color="#3b82f6" />
        <DataPacket start={nodes.controller} end={nodes.database} speed={0.8} color="#3b82f6" />

        {/* Data Packets (Response) */}
        <DataPacket start={nodes.database} end={nodes.controller} speed={1.2} color="#10b981" />
        <DataPacket start={nodes.controller} end={nodes.router} speed={1.2} color="#10b981" />
        <DataPacket start={nodes.router} end={nodes.client} speed={1.2} color="#10b981" />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
