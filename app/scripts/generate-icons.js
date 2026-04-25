/**
 * Icon Generator for Grooted
 * 
 * Generates all required app icon assets as SVG files that can be
 * converted to PNG. Uses the FarmIcon (sprout) design — white icon
 * on dark green (#154212) background.
 * 
 * Required icons:
 * - adaptive-icon.png (1024x1024) — Android adaptive icon foreground
 * - dev-adaptive-icon.png (1024x1024) — Dev variant
 * - splash-icon.png (288x288) — Splash screen
 * - notification-icon.png (96x96) — Push notification
 * - ios-light.png (1024x1024) — iOS light mode
 * - ios-dark.png (1024x1024) — iOS dark mode  
 * - ios-tinted.png (1024x1024) — iOS tinted mode
 * 
 * Run: node scripts/generate-icons.js
 * Then convert SVGs to PNGs using any tool (e.g., sharp, Inkscape, Figma)
 */

const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "..", "assets", "icons");

// The FarmIcon SVG paths (sprout with two leaves and soil line)
const SPROUT_PATHS = `
  <path d="M512 880V512" stroke="__COLOR__" stroke-width="__SW__" stroke-linecap="round"/>
  <path d="M512 512C512 341.3 341.3 256 170.7 256C170.7 426.7 341.3 512 512 512Z" stroke="__COLOR__" stroke-width="__SW__" stroke-linecap="round" stroke-linejoin="round" fill="__FILL__"/>
  <path d="M512 640C512 469.3 682.7 384 853.3 384C853.3 554.7 682.7 640 512 640Z" stroke="__COLOR__" stroke-width="__SW__" stroke-linecap="round" stroke-linejoin="round" fill="__FILL__"/>
  <path d="M170.7 880H853.3" stroke="__COLOR__" stroke-width="__SW__" stroke-linecap="round"/>
`;

function makeSvg({ size, bg, iconColor, fillOpacity = 0, strokeWidth = 48, rounded = true }) {
  const fill = fillOpacity > 0 ? iconColor.replace(")", `,${fillOpacity})`) : "none";
  const paths = SPROUT_PATHS
    .replace(/__COLOR__/g, iconColor)
    .replace(/__SW__/g, String(strokeWidth))
    .replace(/__FILL__/g, fill);

  const radius = rounded ? size / 2 : 0;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${bg ? `<rect width="1024" height="1024" rx="${radius}" fill="${bg}"/>` : ""}
  ${paths}
</svg>`;
}

const icons = [
  {
    name: "adaptive-icon.svg",
    config: { size: 1024, bg: "#154212", iconColor: "#FFFFFF", strokeWidth: 48 },
  },
  {
    name: "dev-adaptive-icon.svg",
    config: { size: 1024, bg: "#835425", iconColor: "#FFFFFF", strokeWidth: 48 },
  },
  {
    name: "splash-icon.svg",
    config: { size: 288, bg: null, iconColor: "#154212", strokeWidth: 48 },
  },
  {
    name: "notification-icon.svg",
    config: { size: 96, bg: null, iconColor: "#FFFFFF", strokeWidth: 64 },
  },
  {
    name: "ios-light.svg",
    config: { size: 1024, bg: "#FFFFFF", iconColor: "#154212", strokeWidth: 48 },
  },
  {
    name: "ios-dark.svg",
    config: { size: 1024, bg: "#154212", iconColor: "#FFFFFF", strokeWidth: 48 },
  },
  {
    name: "ios-tinted.svg",
    config: { size: 1024, bg: "#E8F5E9", iconColor: "#154212", strokeWidth: 48 },
  },
];

if (!fs.existsSync(ICON_DIR)) {
  fs.mkdirSync(ICON_DIR, { recursive: true });
}

for (const icon of icons) {
  const svg = makeSvg(icon.config);
  const filePath = path.join(ICON_DIR, icon.name);
  fs.writeFileSync(filePath, svg, "utf-8");
  console.log(`✅ Generated ${icon.name}`);
}

console.log(`\nSVG icons saved to ${ICON_DIR}`);
console.log("Convert to PNG using: https://svgtopng.com or sharp/Inkscape");
console.log("\nRequired PNG sizes:");
console.log("  adaptive-icon.png      → 1024x1024");
console.log("  dev-adaptive-icon.png  → 1024x1024");
console.log("  splash-icon.png        → 288x288");
console.log("  notification-icon.png  → 96x96");
console.log("  ios-light.png          → 1024x1024");
console.log("  ios-dark.png           → 1024x1024");
console.log("  ios-tinted.png         → 1024x1024");
