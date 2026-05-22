"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, TerminalSquare, FileCode2, Globe, RefreshCw } from "lucide-react";

export default function PlaygroundEnv() {
  const [code, setCode] = useState(`import { ExpressKit } from 'expresskit';

const app = new ExpressKit();

// Define a simple route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from the Sandbox!" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
`);

  const [logs, setLogs] = useState<string[]>([
    "Sandbox initialized.",
    "Ready to run your code."
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setPreviewContent(null);
    setLogs((prev) => [...prev, "> Starting ExpressKit server..."]);
    
    // Simulate server startup and route hit
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "Compiling...",
        "Server is running on port 3000 🚀",
        "> GET /api/hello 200 OK - 5ms"
      ]);
      setPreviewContent("{\"message\":\"Hello from the Sandbox!\"}");
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setLogs(["Sandbox initialized.", "Ready to run your code."]);
    setPreviewContent(null);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="font-mono text-sm text-gray-500 flex items-center gap-2">
            <FileCode2 size={16} /> index.ts
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
            title="Reset Terminal"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-[#d9482b] hover:bg-[#c24026] text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-70"
          >
            <Play size={16} className={isRunning ? "animate-pulse" : ""} />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Editor Pane */}
        <div className="flex-1 border-r border-gray-200 bg-[#1e1e1e] relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-transparent text-gray-100 p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-[#d9482b]/30"
          />
        </div>

        {/* Right Side: Preview & Terminal */}
        <div className="flex-1 flex flex-col bg-[#f8f9fa] relative overflow-hidden">
          
          {/* Browser Preview Pane */}
          <div className="flex-1 flex flex-col border-b border-gray-200">
            {/* Fake Browser Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs text-gray-500">
              <Globe size={14} />
              <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 flex items-center gap-2 text-gray-400">
                <span>localhost:3000/api/hello</span>
              </div>
              <button className="hover:text-gray-800" onClick={handleRun} disabled={isRunning}>
                <RefreshCw size={14} className={isRunning ? "animate-spin" : ""} />
              </button>
            </div>
            {/* Preview Content */}
            <div className="flex-1 p-6 relative bg-white flex items-center justify-center overflow-auto">
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-gray-400 gap-3"
                  >
                    <div className="w-6 h-6 border-2 border-[#d9482b] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Connecting to sandbox...</span>
                  </motion.div>
                ) : previewContent ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 left-0 w-full h-full p-6 text-sm text-gray-800 font-mono whitespace-pre-wrap break-words"
                  >
                    {previewContent}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 text-sm flex flex-col items-center gap-2"
                  >
                    <Globe size={32} className="opacity-50" />
                    <p>Click "Run Code" to view output</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Terminal Pane */}
          <div className="h-48 bg-[#0d0d0d] flex flex-col relative overflow-hidden">
            <div className="px-4 py-2 bg-[#1a1a1a] border-b border-[#333] flex items-center gap-2 text-xs text-gray-400 font-mono shrink-0">
              <TerminalSquare size={14} /> Output Terminal
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-1 ${
                    log.startsWith(">") ? "text-blue-400" : log.includes("🚀") ? "text-green-400" : "text-gray-300"
                  }`}
                >
                  {log}
                </motion.div>
              ))}
              {isRunning && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-4 bg-gray-300 mt-2"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
