const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "..", "assets", "icons");

const conversions = [
  { svg: "adaptive-icon.svg", png: "adaptive-icon.png", size: 1024 },
  { svg: "dev-adaptive-icon.svg", png: "dev-adaptive-icon.png", size: 1024 },
  { svg: "splash-icon.svg", png: "splash-icon.png", size: 288 },
  { svg: "notification-icon.svg", png: "notification-icon.png", size: 96 },
  { svg: "ios-light.svg", png: "ios-light.png", size: 1024 },
  { svg: "ios-dark.svg", png: "ios-dark.png", size: 1024 },
  { svg: "ios-tinted.svg", png: "ios-tinted.png", size: 1024 },
];

async function convert() {
  for (const { svg, png, size } of conversions) {
    const svgPath = path.join(ICON_DIR, svg);
    const pngPath = path.join(ICON_DIR, png);
    
    if (!fs.existsSync(svgPath)) {
      console.log(`⚠️  Skipping ${svg} (not found)`);
      continue;
    }

    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    
    console.log(`✅ ${png} (${size}x${size})`);
  }
  console.log("\nDone! All icons generated.");
}

convert().catch(console.error);
