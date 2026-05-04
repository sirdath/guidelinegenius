import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "data/screenshots/article-compare");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

async function dismiss(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll(
        '.elementor-popup-modal, [role="dialog"], [aria-modal="true"], .dialog-widget',
      )
      .forEach((el) => el.remove());
    document.querySelectorAll("*").forEach((el) => {
      const s = window.getComputedStyle(el);
      if (s.position === "fixed") {
        const r = el.getBoundingClientRect();
        if (r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9) el.remove();
      }
    });
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  });
}

async function shoot(url, file, isLive) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  if (!isLive) {
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem("gg_tnc_accepted_v1", "1"); } catch {}
    });
  }
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
  } catch (e) {
    console.warn(`slow load ${url}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
  if (isLive) await dismiss(page);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: resolve(OUT_DIR, file),
    type: "png",
    fullPage: true,
  });
  await page.close();
  console.log(`Saved ${file}`);
}

await shoot(
  "https://www.guidelinegenius.com/abdominal-aortic-aneurysm-aaa/",
  "live-aaa-full.png",
  true,
);
await shoot(
  "http://localhost:3000/articles/abdominal-aortic-aneurysm-aaa",
  "ours-aaa-full.png",
  false,
);

await browser.close();
