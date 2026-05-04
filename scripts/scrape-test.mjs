// Test scrape: pull ONE article from the live site, extract the article body,
// and save raw + extracted HTML so we can compare against our current import.
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SLUG = process.argv[2] || "abdominal-aortic-aneurysm-aaa";
const URL = `https://www.guidelinegenius.com/${SLUG}/`;
const OUT_DIR = resolve(process.cwd(), "data/scrape-test");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

console.log(`Loading ${URL}…`);
await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2000));

// Dismiss any popup
await page.evaluate(() => {
  document
    .querySelectorAll(
      ".elementor-popup-modal, [role='dialog'], [aria-modal='true'], .dialog-widget",
    )
    .forEach((el) => el.remove());
  document.body.style.overflow = "auto";
});

// Probe: list candidate selectors and their content sizes so we know what
// to grab in the production scraper.
const probe = await page.evaluate(() => {
  const selectors = [
    "main",
    "article",
    ".entry-content",
    ".post-content",
    ".elementor-location-single",
    ".elementor-section.uicore-content",
    ".uicore-post-content",
    "[data-elementor-type='single-post']",
    "[data-elementor-type='wp-post']",
    ".uicore-content .elementor-widget-theme-post-content",
    ".elementor-widget-theme-post-content",
    ".elementor-widget-theme-post-content .elementor-widget-container",
  ];
  return selectors.map((s) => {
    const el = document.querySelector(s);
    return {
      selector: s,
      found: !!el,
      textLength: el ? (el.textContent || "").length : 0,
      htmlLength: el ? el.outerHTML.length : 0,
    };
  });
});

console.log("\nSelector probe:");
console.log(JSON.stringify(probe, null, 2));

// Confirmed selector after probing the live HTML: .gg-main-article-content
const candidate = await page.$(".gg-main-article-content");
let extracted = null;
if (candidate) {
  extracted = await page.evaluate((el) => el.innerHTML, candidate);
}

// Also grab the title + last-updated meta + sources for completeness
const meta = await page.evaluate(() => {
  const titleEl = document.querySelector("h1.elementor-heading-title, h1");
  const lastUpdated = document.body.innerText.match(/Article Last Updated:\s*([0-9\/]+)/);
  return {
    title: titleEl ? titleEl.textContent.trim() : null,
    lastUpdated: lastUpdated ? lastUpdated[1] : null,
  };
});

writeFileSync(resolve(OUT_DIR, `${SLUG}-extracted.html`), extracted || "<!-- extraction failed -->", "utf8");
writeFileSync(resolve(OUT_DIR, `${SLUG}-meta.json`), JSON.stringify(meta, null, 2), "utf8");
writeFileSync(resolve(OUT_DIR, `${SLUG}-probe.json`), JSON.stringify(probe, null, 2), "utf8");
// Full page dump for fallback inspection
const fullHtml = await page.content();
writeFileSync(resolve(OUT_DIR, `${SLUG}-fullpage.html`), fullHtml, "utf8");

console.log(`\nMeta:`, meta);
console.log(`Extracted body length: ${extracted ? extracted.length : 0} chars`);
console.log(`Saved to: ${OUT_DIR}`);

await browser.close();
