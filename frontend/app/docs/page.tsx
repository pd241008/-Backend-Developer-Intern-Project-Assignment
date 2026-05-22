"use client";

import dynamic from "next/dynamic";
import { Terminal } from "lucide-react";

// Dynamically import 3D model
const ArchitectureModel = dynamic(() => import("../components/ArchitectureModel"), { ssr: false });

export default function DocsPage() {
  return (
    <div className="space-y-16 pb-20">
      <section id="introduction" className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">ExpressKit Documentation</h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Welcome to the official ExpressKit documentation. Explore the core concepts, modular architecture, and learn how to build robust Express.js applications with ease.
        </p>
      </section>

      <section id="architecture">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">System Architecture</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="relative">
          <ArchitectureModel />
        </div>
      </section>

      <section id="getting-started">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Getting Started</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Terminal size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Start</h3>
          <p className="text-gray-600 mb-6">Get up and running with a new ExpressKit project in under a minute.</p>
          <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between group cursor-pointer">
            <code className="text-green-400 font-mono text-sm">npx create-expresskit@latest</code>
            <span className="text-gray-500 text-xs uppercase tracking-wider group-hover:text-white transition-colors">Copy</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#d9482b] to-[#f28e2c] p-8 rounded-3xl shadow-lg shadow-orange-500/20 text-white">
          <h3 className="text-2xl font-bold mb-4">Why ExpressKit?</h3>
          <ul className="space-y-3 font-medium">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              Modular Component Architecture
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              Built-in Auth & Security
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              Performance Optimized
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              Interactive Sandbox Environment
            </li>
          </ul>
        </div>
        </div>
      </section>

      <section id="installation">
        <div className="flex items-center gap-4 mb-8 mt-12">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Installation</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose max-w-none">
          <h3>Prerequisites</h3>
          <ul>
            <li>Node.js 18.x or later</li>
            <li>npm or yarn</li>
          </ul>
          <h3>Manual Setup</h3>
          <p>
            If you prefer not to use the interactive CLI, you can install ExpressKit manually via npm:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
            <code>npm install expresskit --save</code>
          </pre>
        </div>
      </section>

      {/* Project Structure Section */}
      <section id="project-structure">
        <div className="flex items-center gap-4 mb-8 mt-12">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Project Structure</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose max-w-none">
          <p>When you initialize a project, ExpressKit generates this scalable structure:</p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
{`my-project/
├── src/
│   ├── app.ts                 # App bootstrap & middleware
│   ├── server.ts              # Server entry point
│   ├── config/
│   ├── routes/                # Convention-based route definitions
│   ├── controllers/           # Request handlers (I/O only)
│   ├── services/              # Business logic
│   ├── middleware/            # Custom Express middleware
│   ├── models/                # Database models
│   └── utils/                 # Helper utilities
├── .expresskit/               # 🔒 Framework internals
├── .env
├── package.json
└── tsconfig.json`}
          </pre>
        </div>
      </section>

      {/* Features Section */}
      <section id="core-features">
        <div className="flex items-center gap-4 mb-8 mt-12">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Core Features</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-gray-900">TypeScript Native</h3>
            <p className="text-gray-600 text-sm">Built for type safety from day one. Full tsconfig.json pre-configured.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Controller–Service Pattern</h3>
            <p className="text-gray-600 text-sm">Clean separation of concerns. Controllers handle HTTP I/O, services handle business logic.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Global Error Handling</h3>
            <p className="text-gray-600 text-sm">Centralized error-handling architecture with AppError and catchAsync wrapper.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Zod Validation</h3>
            <p className="text-gray-600 text-sm">Automatically intercepts validation errors and formats them into clean JSON responses.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
