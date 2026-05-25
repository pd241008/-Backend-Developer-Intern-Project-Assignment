import os from "os";
import fs from "fs";
import path from "path";
import https from "https";
import { execSync } from "child_process";

// Helper for HTTP requests following redirects
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = (currentUrl: string) => {
      https.get(currentUrl, (response) => {
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
        fs.unlinkSync(dest);
        reject(err);
      });
    };

    request(url);
  });
}

async function run() {
  const platform = os.platform();
  const architecture = os.arch();

  // Map Node.js platform/arch to our Rust binary names
  let osName = "";
  let archName = "";
  let ext = "";

  if (platform === "win32") {
    osName = "windows";
    ext = ".exe";
  } else if (platform === "darwin") {
    osName = "macos";
  } else if (platform === "linux") {
    osName = "linux";
  } else {
    console.error(`❌ Unsupported platform: ${platform}`);
    process.exit(1);
  }

  if (architecture === "x64") {
    archName = "x64";
  } else if (architecture === "arm64") {
    archName = "arm64";
  } else {
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
  const pkgPath = path.resolve(__dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const version = pkg.version;

  const url = `https://github.com/pd241008/ExpressKit/releases/download/v${version}/${binaryName}`;
  
  const binDir = path.resolve(__dirname, "../bin");
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const finalBinaryName = platform === "win32" ? "packager.exe" : "packager";
  const dest = path.resolve(binDir, finalBinaryName);

  console.log(`⬇️ Downloading ExpressKit packager binary for ${osName}-${archName} (v${version})...`);

  try {
    await downloadFile(url, dest);
    
    // Make executable on Unix
    if (platform !== "win32") {
      execSync(`chmod +x "${dest}"`);
    }

    console.log("✅ Packager installed successfully!");
  } catch (error: any) {
    console.error(`❌ Error downloading packager: ${error.message}`);
    console.error("Please ensure the release exists on GitHub, or build it locally.");
    process.exit(1);
  }
}

run();
