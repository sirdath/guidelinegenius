import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "data/screenshots/ours");
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { name: "01-home",     url: "http://localhost:3000/" },
  { name: "02-article",  url: "http://localhost:3000/articles/abdominal-aortic-aneurysm-aaa" },
  { name: "03-category", url: "http://localhost:3000/categories/cardiovascular" },
  { name: "04-about",    url: "http://localhost:3000/about" },
  { name: "05-contact",  url: "http://localhost:3000/contact" },
];

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

for (const t of targets) {
  console.log(`Capturing ${t.url}…`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  // Pre-set localStorage to dismiss our T&C modal
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("gg_tnc_accepted_v1", "1");
    } catch {}
  });
  try {
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 });
  } catch (e) {
    console.warn(`  Slow load: ${e.message}; continuing`);
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: resolve(OUT_DIR, `${t.name}-fold.png`),
    type: "png",
    fullPage: false,
  });
  await page.close();
  console.log(`  Saved ${t.name}-fold.png`);
}

await browser.close();
console.log("Done.");
