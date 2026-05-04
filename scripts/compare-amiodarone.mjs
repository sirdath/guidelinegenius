// Side-by-side screenshot of live amiodarone article vs ours
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(process.cwd(), "data/scrape-test");
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

async function shoot(url, file, accept) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  if (!accept) {
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem("gg_tnc_accepted_v1", "1"); } catch {}
    });
  }
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  if (accept) {
    await page.evaluate(() => {
      document
        .querySelectorAll(".elementor-popup-modal, [role='dialog'], [aria-modal='true'], .dialog-widget")
        .forEach((el) => el.remove());
      document.body.style.overflow = "auto";
    });
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.screenshot({ path: resolve(OUT, file), fullPage: true });
  await page.close();
  console.log(`saved ${file}`);
}

await shoot("https://www.guidelinegenius.com/amiodarone/", "amiodarone-live.png", true);
await shoot("http://localhost:3000/articles/amiodarone/", "amiodarone-ours.png", false);
await browser.close();
