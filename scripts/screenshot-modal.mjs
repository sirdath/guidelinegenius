import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "data/screenshots/ours");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

// Don't pre-accept — modal should be visible
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({
  path: resolve(OUT_DIR, "00-tnc-modal.png"),
  type: "png",
  fullPage: false,
});
console.log("Saved 00-tnc-modal.png");

await browser.close();
