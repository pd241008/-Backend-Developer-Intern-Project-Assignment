"use client";

import dynamic from "next/dynamic";
import PlaygroundEnv from "../components/PlaygroundEnv";
import Navbar from "../components/Navbar";

// Dynamically import Three.js background to avoid SSR issues
const ThreeBackground = dynamic(() => import('../components/ThreeBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full -z-10 bg-[#f4f5f7]" />
});

export default function PlaygroundPage() {
  return (
    <main className="relative min-h-screen bg-[#f4f5f7] overflow-hidden text-foreground cloud-bg">
      <ThreeBackground />
      <Navbar />
      <div className="relative z-10 pt-32 pb-12 px-6 max-w-[1800px] mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Interactive Sandbox</h1>
          <p className="text-lg text-gray-600">
            Write, test, and deploy ExpressKit code directly in your browser. No local setup required.
          </p>
        </div>
        
        <PlaygroundEnv />
      </div>
    </main>
  );
}
