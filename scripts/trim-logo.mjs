import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = resolve(process.cwd(), "public/brand/logo.png");
const OUT = resolve(process.cwd(), "public/brand/logo-trimmed.png");

const buf = readFileSync(SRC);
const orig = await sharp(buf).metadata();
console.log(`Original: ${orig.width}x${orig.height}`);

// Trim transparent borders, then trim near-white if any
const trimmed = await sharp(buf)
  .trim({ background: "transparent", threshold: 1 })
  .toBuffer();
const trimmedMeta = await sharp(trimmed).metadata();
console.log(`Trimmed:  ${trimmedMeta.width}x${trimmedMeta.height}`);

writeFileSync(OUT, trimmed);
console.log(`Saved → ${OUT}`);
