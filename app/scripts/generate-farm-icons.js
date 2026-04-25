const sharp = require("sharp");
const path = require("path");

const ICON_DIR = path.join(__dirname, "..", "assets", "icons");

// The FarmIcon SVG — sprout with two leaves and soil line
// Matches exactly what's in src/components/icons/TabIcons.tsx FarmIcon
function makeSvg({ size, bg, color, sw }) {
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${bg ? `<rect width="24" height="24" fill="${bg}"/>` : ""}
  <path d="M12 22V12" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
  <path d="M12 12C12 8 8 6 4 6C4 10 8 12 12 12Z" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 15C12 11 16 9 20 9C20 13 16 15 12 15Z" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 22H20" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
</svg>`);
}

const icons = [
  // Production app icon — white sprout on dark green
  { name: "adaptive-icon.png", size: 1024, bg: "#154212", color: "#FFFFFF", sw: 1.2 },
  // Dev variant — white sprout on brown
  { name: "dev-adaptive-icon.png", size: 1024, bg: "#835425", color: "#FFFFFF", sw: 1.2 },
  // iOS light — green sprout on white
  { name: "ios-light.png", size: 1024, bg: "#FFFFFF", color: "#154212", sw: 1.2 },
  // iOS dark — white sprout on dark green
  { name: "ios-dark.png", size: 1024, bg: "#154212", color: "#FFFFFF", sw: 1.2 },
  // iOS tinted — green sprout on light green
  { name: "ios-tinted.png", size: 1024, bg: "#E8F5E9", color: "#154212", sw: 1.2 },
  // Splash — green sprout, transparent bg
  { name: "splash-icon.png", size: 512, bg: null, color: "#154212", sw: 1.2 },
  // Notification — white only, transparent bg
  { name: "notification-icon.png", size: 192, bg: null, color: "#FFFFFF", sw: 1.5 },
];

async function run() {
  for (const { name, size, bg, color, sw } of icons) {
    const svg = makeSvg({ size: 24, bg, color, sw });
    
    await sharp(svg, { density: 300 })
      .resize(size, size)
      .png()
      .toFile(path.join(ICON_DIR, name));
    
    console.log(`✅ ${name} (${size}x${size})`);
  }
  console.log("\nAll FarmIcon app icons generated!");
}

run().catch(console.error);
