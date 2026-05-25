#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Determine the path to the downloaded Rust binary
const finalBinaryName = process.platform === "win32" ? "packager.exe" : "packager";
const binaryPath = path_1.default.resolve(__dirname, "../../bin", finalBinaryName);
if (!fs_1.default.existsSync(binaryPath)) {
    console.error("❌ Packager binary not found.");
    console.error("Please ensure the postinstall script successfully downloaded the binary or run 'npm run postinstall'.");
    process.exit(1);
}
// Forward all arguments to the Rust binary
const args = process.argv.slice(2);
const result = (0, child_process_1.spawnSync)(binaryPath, args, { stdio: "inherit" });
if (result.error) {
    console.error("❌ Failed to execute packager binary:", result.error.message);
    process.exit(1);
}
process.exit(result.status ?? 0);
