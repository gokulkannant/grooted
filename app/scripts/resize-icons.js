const sharp = require("sharp");
const path = require("path");

const ICON_DIR = path.join(__dirname, "..", "assets", "icons");
const SOURCE = path.join(ICON_DIR, "plant-source.png");

const targets = [
  { name: "adaptive-icon.png", size: 1024 },
  { name: "dev-adaptive-icon.png", size: 1024 },
  { name: "ios-light.png", size: 1024 },
  { name: "ios-dark.png", size: 1024 },
  { name: "ios-tinted.png", size: 1024 },
  { name: "splash-icon.png", size: 288 },
  { name: "notification-icon.png", size: 96 },
];

async function run() {
  for (const { name, size } of targets) {
    await sharp(SOURCE)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(ICON_DIR, name));
    console.log(`✅ ${name} (${size}x${size})`);
  }
  console.log("\nDone!");
}

run().catch(console.error);
