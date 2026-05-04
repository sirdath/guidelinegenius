import puppeteer from "puppeteer";
import { resolve } from "node:path";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  try { localStorage.setItem("gg_tnc_accepted_v1", "1"); } catch {}
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({
  path: resolve(process.cwd(), "data/screenshots/ours/01-home-full.png"),
  type: "png",
  fullPage: true,
});
console.log("Saved");
await browser.close();
