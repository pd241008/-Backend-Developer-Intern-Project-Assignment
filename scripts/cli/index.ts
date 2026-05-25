#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

// Determine the path to the downloaded Rust binary
const finalBinaryName = process.platform === "win32" ? "packager.exe" : "packager";
const binaryPath = path.resolve(__dirname, "../../bin", finalBinaryName);

if (!fs.existsSync(binaryPath)) {
  console.error("❌ Packager binary not found.");
  console.error("Please ensure the postinstall script successfully downloaded the binary or run 'npm run postinstall'.");
  process.exit(1);
}

// Forward all arguments to the Rust binary
const args = process.argv.slice(2);
const result = spawnSync(binaryPath, args, { stdio: "inherit" });

if (result.error) {
  console.error("❌ Failed to execute packager binary:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
