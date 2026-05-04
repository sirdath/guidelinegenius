// Strip X-Amz-* signed-URL query params from any href in the imported
// article content. Those presigned links expired 5 minutes after creation
// and only trip secret scanners.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve(process.cwd(), "data/generated/articles.json");
const raw = readFileSync(FILE, "utf8");

let stripped = 0;
const cleaned = raw.replace(
  /href=\\"([^"\\]+)\\"/g,
  (whole, url) => {
    if (!url.includes("X-Amz-")) return whole;
    try {
      const u = new URL(url.replace(/&amp;/g, "&"));
      const dropped = [];
      for (const k of [...u.searchParams.keys()]) {
        if (k.startsWith("X-Amz-") || k === "hash" || k === "host" || k === "tsoh" || k === "rh" || k === "ua" || k === "rr" || k === "cc" || k === "sid" || k === "tid") {
          u.searchParams.delete(k);
          dropped.push(k);
        }
      }
      if (dropped.length === 0) return whole;
      stripped++;
      return `href=\\"${u.toString()}\\"`;
    } catch {
      return whole;
    }
  },
);

writeFileSync(FILE, cleaned, "utf8");
console.log(`Stripped ${stripped} signed-URL parameters from ${FILE}`);
console.log(`Size before: ${raw.length}`);
console.log(`Size after:  ${cleaned.length}`);
