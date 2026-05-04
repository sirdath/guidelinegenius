import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "data/screenshots/live");
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { name: "01-home",     url: "https://www.guidelinegenius.com/" },
  { name: "02-article",  url: "https://www.guidelinegenius.com/abdominal-aortic-aneurysm-aaa/" },
  { name: "03-category", url: "https://www.guidelinegenius.com/category/cardiovascular/" },
  { name: "04-about",    url: "https://www.guidelinegenius.com/about/" },
  { name: "05-contact",  url: "https://www.guidelinegenius.com/contact-us/" },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});

async function dismissTncModal(page) {
  // Inject CSS to nuke all Elementor popups + restore body scroll
  await page.addStyleTag({
    content: `
      .elementor-popup-modal, .dialog-widget, .dialog-lightbox-widget,
      [class*="elementor-popup"], div[role="dialog"], div[aria-modal="true"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      body, html {
        overflow: auto !important;
        position: static !important;
        height: auto !important;
      }
      body::before, body::after { display: none !important; }
    `,
  });
  // Also remove from DOM entirely so they can't paint
  await page.evaluate(() => {
    const selectors = [
      ".elementor-popup-modal",
      ".dialog-widget",
      ".dialog-lightbox-widget",
      "[role='dialog']",
      "[aria-modal='true']",
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }
    // Find any fixed-position element covering the whole viewport (likely backdrop)
    document.querySelectorAll("*").forEach((el) => {
      const s = window.getComputedStyle(el);
      if (s.position === "fixed") {
        const r = el.getBoundingClientRect();
        if (r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9) {
          el.remove();
        }
      }
    });
    // Restore scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  });
}

for (const t of targets) {
  console.log(`Capturing ${t.url}…`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  try {
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 });
  } catch (e) {
    console.warn(`  Slow load: ${e.message}; continuing`);
  }
  await new Promise((r) => setTimeout(r, 1500));
  await dismissTncModal(page);
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: resolve(OUT_DIR, `${t.name}-fold.png`),
    type: "png",
    fullPage: false,
  });
  await page.screenshot({
    path: resolve(OUT_DIR, `${t.name}-full.png`),
    type: "png",
    fullPage: true,
  });
  await page.close();
  console.log(`  Saved ${t.name}-fold.png + ${t.name}-full.png`);
}

await browser.close();
console.log("\nDone. Output:", OUT_DIR);
