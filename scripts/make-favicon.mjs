// Build a high-contrast favicon: navy stethoscope-G mark sitting inside
// a soft light-blue circle so it pops against any browser-tab background.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = resolve(process.cwd(), "public/brand/logo-trimmed.png");
const APP_DIR = resolve(process.cwd(), "app");
const PUB_DIR = resolve(process.cwd(), "public");

const buf = readFileSync(SRC);
const meta = await sharp(buf).metadata();
console.log(`Logo source: ${meta.width}x${meta.height}`);

// Extract the leftmost square region (stethoscope-through-G icon area)
const side = Math.min(meta.width, meta.height);
const iconSquare = await sharp(buf)
  .extract({ left: 0, top: 0, width: side, height: meta.height })
  .resize({
    width: side,
    height: side,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .toBuffer();

async function makeFavicon(size) {
  const padding = Math.round(size * 0.18); // breathing room inside the disc
  const innerSize = size - padding * 2;

  // Light-blue circular background disc with subtle navy ring for definition
  const ring = Math.max(2, Math.round(size * 0.04));
  const r = (size - ring) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const discSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#E3F2FD"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#003366" stroke-width="${ring}"/>
    </svg>
  `;

  const innerIcon = await sharp(iconSquare)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  return sharp(Buffer.from(discSvg))
    .composite([{ input: innerIcon, left: padding, top: padding }])
    .png()
    .toBuffer();
}

const fav32 = await makeFavicon(32);
const fav192 = await makeFavicon(192);
const fav512 = await makeFavicon(512);

writeFileSync(resolve(APP_DIR, "icon.png"), fav192);
writeFileSync(resolve(APP_DIR, "apple-icon.png"), fav512);
writeFileSync(resolve(PUB_DIR, "favicon-32.png"), fav32);

console.log("Wrote app/icon.png (192), app/apple-icon.png (512), public/favicon-32.png (32)");
