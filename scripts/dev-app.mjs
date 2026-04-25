#!/usr/bin/env node
/**
 * Interactive dev launcher for the Grooted Expo mobile app.
 *
 * Usage:  bun run app   (from repo root)
 *
 * Features:
 *   1. Auto-picks next available port (8083, 8084, ...)
 *   2. Lists connected ADB devices — arrow-key selector
 *   3. Picks environment (dev / preview / production)
 *   4. Launches `bunx expo start` with adb reverse + auto-launch
 */

import { execSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import http from "node:http";
import path from "node:path";

// ── Config ──────────────────────────────────────────────────────────
const BASE_PORT = 8083;
const MAX_PORT = 8090;

const ENVIRONMENTS = [
  { name: "development", variant: "development", envFile: ".env.local",      suffix: ".dev",      scheme: "grooted-dev",     label: "Dev" },
  { name: "preview",     variant: "preview",     envFile: ".env.preview",    suffix: ".preview",  scheme: "grooted-preview", label: "Preview" },
  { name: "production",  variant: "production",  envFile: ".env.production", suffix: "",          scheme: "grooted",         label: "Prod" },
];
const BASE_BUNDLE_ID = "app.grooted";

/** Parse a .env file and return key-value pairs */
function loadEnvFile(filePath) {
  const vars = {};
  if (!existsSync(filePath)) return vars;
  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return vars;
}

// Resolve adb path explicitly
const ANDROID_HOME = process.env.ANDROID_HOME || path.join(homedir(), "Library/Android/sdk");
const ADB_PATH = path.join(ANDROID_HOME, "platform-tools", "adb");

/** Run adb with the resolved path */
function adb(args) {
  return execSync(`"${ADB_PATH}" ${args}`, { encoding: "utf-8" });
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Check if a Metro dev server is running on this port */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/status`, { timeout: 500 }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        resolve(body.includes("running") || res.statusCode === 200);
      });
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

/** Find next free port starting from BASE_PORT */
async function findNextPort() {
  const checks = [];
  for (let p = BASE_PORT; p <= MAX_PORT; p++) {
    checks.push(isPortInUse(p).then(inUse => ({ port: p, inUse })));
  }
  const results = await Promise.all(checks);
  const freePort = results.find(r => !r.inUse);
  if (freePort) return freePort.port;
  console.error("❌ No free ports in range 8083-8090");
  process.exit(1);
}

/** Get connected ADB devices */
function getAdbDevices() {
  try {
    if (!existsSync(ADB_PATH)) {
      console.log(`\x1b[33m⚠\x1b[0m ADB not found at: ${ADB_PATH}\n`);
      return [];
    }
    const out = adb("devices -l");
    const lines = out.split("\n").slice(1);
    const devices = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "") continue;
      const parts = trimmed.split(/\s+/);
      const id = parts[0];
      const status = parts[1];
      if (status !== "device") continue;
      const modelMatch = trimmed.match(/model:(\S+)/);
      const model = modelMatch ? modelMatch[1].replace(/_/g, " ") : id;
      devices.push({ id, model });
    }
    return devices;
  } catch {
    return [];
  }
}

// ── Interactive selector (arrow keys) ───────────────────────────────

function select(prompt, options, labelFn) {
  return new Promise((resolve) => {
    let selected = 0;

    const render = () => {
      process.stdout.write(`\x1b[${options.length + 1}A`);
      console.log(`\x1b[1m${prompt}\x1b[0m`);
      for (let i = 0; i < options.length; i++) {
        const label = labelFn ? labelFn(options[i], i) : String(options[i]);
        if (i === selected) {
          console.log(`  \x1b[36m❯ ${label}\x1b[0m`);
        } else {
          console.log(`    ${label}`);
        }
      }
    };

    console.log(`\x1b[1m${prompt}\x1b[0m`);
    for (let i = 0; i < options.length; i++) {
      const label = labelFn ? labelFn(options[i], i) : String(options[i]);
      if (i === 0) {
        console.log(`  \x1b[36m❯ ${label}\x1b[0m`);
      } else {
        console.log(`    ${label}`);
      }
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");

    const onKey = (key) => {
      if (key === "\x1b[A") {
        selected = (selected - 1 + options.length) % options.length;
        render();
      } else if (key === "\x1b[B") {
        selected = (selected + 1) % options.length;
        render();
      } else if (key === "\r" || key === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onKey);
        resolve(options[selected]);
      } else if (key === "\x03") {
        console.log("\n\x1b[2mCancelled.\x1b[0m");
        process.exit(0);
      }
    };

    process.stdin.on("data", onKey);
  });
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("\n\x1b[1m🌱 Grooted Dev App Launcher\x1b[0m\n");

  // 1. Pick environment
  const env = await select(
    "Select environment:",
    ENVIRONMENTS,
    (e) => `${e.name}${e.name === "development" ? "  \x1b[2m(default)\x1b[0m" : ""}`
  );
  console.log();

  // Load env vars
  const envFilePath = path.join("app", env.envFile);
  const envVars = loadEnvFile(envFilePath);
  const appPackage = `${BASE_BUNDLE_ID}${env.suffix}`;
  console.log(`\x1b[32m✓\x1b[0m Environment: \x1b[1m${env.name}\x1b[0m  (${appPackage})\n`);

  // 2. Find port
  const port = await findNextPort();
  console.log(`\x1b[32m✓\x1b[0m Port: \x1b[1m${port}\x1b[0m\n`);

  // 3. Pick ADB device
  const devices = getAdbDevices();
  let deviceFlag = "";
  if (devices.length === 0) {
    console.log("\x1b[33m⚠\x1b[0m No ADB devices found — launching without device target\n");
  } else if (devices.length === 1) {
    console.log(`\x1b[32m✓\x1b[0m Device: \x1b[1m${devices[0].model}\x1b[0m (${devices[0].id})\n`);
    deviceFlag = devices[0].id;
  } else {
    const picked = await select(
      "Select device:",
      devices,
      (d) => `${d.model}  \x1b[2m(${d.id})\x1b[0m`
    );
    deviceFlag = picked.id;
    console.log();
  }

  // 4. Summary
  console.log("\x1b[2m─────────────────────────────────\x1b[0m");
  console.log(`  Env:     \x1b[1m${env.name}\x1b[0m`);
  console.log(`  Port:    \x1b[1m${port}\x1b[0m`);
  if (deviceFlag) console.log(`  Device:  \x1b[1m${deviceFlag}\x1b[0m`);
  console.log(`  Package: \x1b[1m${appPackage}\x1b[0m`);
  console.log("\x1b[2m─────────────────────────────────\x1b[0m\n");

  // 5. Set up adb reverse for the port
  if (deviceFlag) {
    try {
      adb(`-s ${deviceFlag} reverse tcp:${port} tcp:${port}`);
      console.log(`\x1b[32m✓\x1b[0m adb reverse tcp:${port} → tcp:${port}\n`);
    } catch {
      console.log(`\x1b[33m⚠\x1b[0m Could not set up adb reverse — device may not connect to Metro\n`);
    }
  }

  // 6. Check if dev build is installed on device
  if (deviceFlag) {
    let isInstalled = false;
    try {
      const packages = adb(`-s ${deviceFlag} shell pm list packages ${appPackage}`);
      isInstalled = packages.includes(`package:${appPackage}`);
    } catch { /* assume not installed */ }

    if (!isInstalled) {
      console.log(`\x1b[33m⚠\x1b[0m ${appPackage} not installed on device\n`);
      const buildChoice = await select(
        "What would you like to do?",
        ["prebuild-install", "prebuild-only", "skip"],
        (opt) => {
          if (opt === "prebuild-install") return "Prebuild + Install on device";
          if (opt === "prebuild-only") return "Prebuild only (no install)";
          return "Skip — just start Metro";
        }
      );
      console.log();

      if (buildChoice !== "skip") {
        try {
          const buildEnv = { ...process.env, ...envVars, ...(env.variant ? { APP_VARIANT: env.variant } : {}) };
          console.log("\x1b[36m▸\x1b[0m Running prebuild...\n");
          execSync("bunx expo prebuild --clean --platform android", { cwd: "app", stdio: "inherit", env: buildEnv });

          if (buildChoice === "prebuild-install") {
            console.log("\n\x1b[36m▸\x1b[0m Building and installing on device...\n");
            execSync("bunx expo run:android --no-bundler", { cwd: "app", stdio: "inherit", env: buildEnv });
            console.log(`\n\x1b[32m✓\x1b[0m Dev build installed successfully\n`);
          } else {
            console.log(`\n\x1b[32m✓\x1b[0m Prebuild complete\n`);
          }
        } catch (e) {
          console.error(`\n\x1b[31m✗\x1b[0m Build failed.\n`);
          process.exit(1);
        }
      }
    } else {
      console.log(`\x1b[32m✓\x1b[0m ${appPackage} is installed on device\n`);
    }
  }

  // 7. Launch Metro dev server
  const args = ["expo", "start", "--port", String(port), "--clear"];

  const child = spawn("bunx", args, {
    cwd: "app",
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      ...envVars,
      ANDROID_HOME,
      PATH: `${path.join(ANDROID_HOME, "platform-tools")}:${path.join(ANDROID_HOME, "emulator")}:${process.env.PATH || ""}`,
      EXPO_NO_PROMPT: "1",
      ...(env.variant ? { APP_VARIANT: env.variant } : {}),
    },
  });

  // 8. Wait for Metro then auto-launch app on device
  if (deviceFlag) {
    const APP_PACKAGE = appPackage;

    async function waitForMetro(maxWaitMs = 15000) {
      const start = Date.now();
      while (Date.now() - start < maxWaitMs) {
        const ready = await new Promise((resolve) => {
          const req = http.get(`http://127.0.0.1:${port}/status`, { timeout: 1000 }, (res) => {
            let body = "";
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => resolve(body.includes("running") || res.statusCode === 200));
          });
          req.on("error", () => resolve(false));
          req.on("timeout", () => { req.destroy(); resolve(false); });
        });
        if (ready) return true;
        await new Promise((r) => setTimeout(r, 500));
      }
      return false;
    }

    async function launchOnDevice() {
      const metroReady = await waitForMetro();
      if (!metroReady) {
        console.log("\x1b[33m⚠ Metro not ready — launch the app manually on the device\x1b[0m");
        return;
      }

      try {
        const devUrl = `${env.scheme}://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A${port}`;
        adb(`-s ${deviceFlag} shell am start -W -a android.intent.action.VIEW -d "${devUrl}"`);
        console.log(`\x1b[32m✓\x1b[0m Launched dev client on \x1b[1m${deviceFlag}\x1b[0m`);
      } catch {
        try {
          adb(`-s ${deviceFlag} shell monkey -p ${APP_PACKAGE} -c android.intent.category.LAUNCHER 1`);
          console.log(`\x1b[32m✓\x1b[0m Launched \x1b[1m${APP_PACKAGE}\x1b[0m on \x1b[1m${deviceFlag}\x1b[0m`);
        } catch {
          console.log(`\x1b[33m⚠\x1b[0m Could not auto-launch — open the app manually`);
        }
      }
    }

    launchOnDevice();
  }

  child.on("exit", (code) => process.exit(code || 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
