// Build favicon from the trimmed logo. Extract the left-side icon area
// (stethoscope + "G"), make it square, save at multiple sizes for browsers.
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SRC = resolve(process.cwd(), "public/brand/logo-trimmed.png");
const APP_DIR = resolve(process.cwd(), "app");
const PUB_DIR = resolve(process.cwd(), "public");

const buf = readFileSync(SRC);
const meta = await sharp(buf).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

// The trimmed logo is wider than tall (278x148-ish). Extract the leftmost
// square region which contains the stethoscope-through-G mark.
const side = Math.min(meta.width, meta.height);

// Extract from the LEFT — that's where the stethoscope+G icon sits
const cropped = await sharp(buf)
  .extract({
    left: 0,
    top: 0,
    width: side,
    height: meta.height,
  })
  // Pad to square if needed (top-bottom)
  .resize({
    width: side,
    height: side,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .toBuffer();

// 32x32 favicon — main browser tab icon
const fav32 = await sharp(cropped)
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toBuffer();

// 192x192 — Android homescreen, large favicon
const fav192 = await sharp(cropped)
  .resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toBuffer();

// 512x512 — Apple touch icon equivalent / PWA
const fav512 = await sharp(cropped)
  .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toBuffer();

writeFileSync(resolve(APP_DIR, "icon.png"), fav192);
writeFileSync(resolve(APP_DIR, "apple-icon.png"), fav512);
writeFileSync(resolve(PUB_DIR, "favicon-32.png"), fav32);

console.log("Wrote app/icon.png, app/apple-icon.png, public/favicon-32.png");
