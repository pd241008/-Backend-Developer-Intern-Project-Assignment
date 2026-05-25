"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const child_process_1 = require("child_process");
// Helper for HTTP requests following redirects
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs_1.default.createWriteStream(dest);
        const request = (currentUrl) => {
            https_1.default.get(currentUrl, (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    if (response.headers.location) {
                        return request(response.headers.location);
                    }
                }
                if (response.statusCode !== 200) {
                    return reject(new Error(`Failed to download: ${response.statusCode} - ${response.statusMessage}`));
                }
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            }).on("error", (err) => {
                fs_1.default.unlinkSync(dest);
                reject(err);
            });
        };
        request(url);
    });
}
async function run() {
    const platform = os_1.default.platform();
    const architecture = os_1.default.arch();
    // Map Node.js platform/arch to our Rust binary names
    let osName = "";
    let archName = "";
    let ext = "";
    if (platform === "win32") {
        osName = "windows";
        ext = ".exe";
    }
    else if (platform === "darwin") {
        osName = "macos";
    }
    else if (platform === "linux") {
        osName = "linux";
    }
    else {
        console.error(`❌ Unsupported platform: ${platform}`);
        process.exit(1);
    }
    if (architecture === "x64") {
        archName = "x64";
    }
    else if (architecture === "arm64") {
        archName = "arm64";
    }
    else {
        console.error(`❌ Unsupported architecture: ${architecture}`);
        process.exit(1);
    }
    // Windows ARM64 or Linux ARM64 are not built by our GH Actions currently.
    if ((platform === "win32" || platform === "linux") && architecture !== "x64") {
        console.error(`❌ Unsupported architecture for ${platform}: ${architecture}`);
        process.exit(1);
    }
    const binaryName = `packager-${osName}-${archName}${ext}`;
    // The version must match the package.json version
    const pkgPath = path_1.default.resolve(__dirname, "../package.json");
    const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath, "utf-8"));
    const version = pkg.version;
    const url = `https://github.com/pd241008/ExpressKit/releases/download/v${version}/${binaryName}`;
    const binDir = path_1.default.resolve(__dirname, "../bin");
    if (!fs_1.default.existsSync(binDir)) {
        fs_1.default.mkdirSync(binDir, { recursive: true });
    }
    const finalBinaryName = platform === "win32" ? "packager.exe" : "packager";
    const dest = path_1.default.resolve(binDir, finalBinaryName);
    console.log(`⬇️ Downloading ExpressKit packager binary for ${osName}-${archName} (v${version})...`);
    try {
        await downloadFile(url, dest);
        // Make executable on Unix
        if (platform !== "win32") {
            (0, child_process_1.execSync)(`chmod +x "${dest}"`);
        }
        console.log("✅ Packager installed successfully!");
    }
    catch (error) {
        console.error(`❌ Error downloading packager: ${error.message}`);
        console.error("Please ensure the release exists on GitHub, or build it locally.");
        process.exit(1);
    }
}
run();
