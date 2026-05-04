// Batch scraper test: pull a small sample of articles to verify fidelity
// before running on the full 383. Saves to data/scrape-test/articles-live.json.
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SLUGS = process.argv.slice(2);
if (SLUGS.length === 0) {
  console.error("Usage: scrape-batch-test.mjs <slug1> <slug2> ...");
  process.exit(1);
}

const OUT_DIR = resolve(process.cwd(), "data/scrape-test");
mkdirSync(OUT_DIR, { recursive: true });

const OUT_FILE = resolve(OUT_DIR, "articles-live.json");
const existing = existsSync(OUT_FILE) ? JSON.parse(readFileSync(OUT_FILE, "utf8")) : {};

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

async function scrapeOne(slug) {
  const url = `https://www.guidelinegenius.com/${slug}/`;
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  );
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  } catch (e) {
    console.warn(`  slow load on ${slug}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500));

  // Dismiss any popup
  await page.evaluate(() => {
    document
      .querySelectorAll(
        ".elementor-popup-modal, [role='dialog'], [aria-modal='true'], .dialog-widget",
      )
      .forEach((el) => el.remove());
  });

  // Extract structured data
  const data = await page.evaluate(() => {
    function text(sel) {
      const el = document.querySelector(sel);
      return el ? (el.textContent || "").trim() : null;
    }
    function html(sel) {
      const el = document.querySelector(sel);
      return el ? el.innerHTML : null;
    }

    // Source citations are in a specific Elementor widget area beneath the title
    const sourceEls = Array.from(document.querySelectorAll(".gg-source-list, .uicore-post-meta + * p, .summcent p"));
    const sources = sourceEls
      .map((el) => (el.textContent || "").trim())
      .filter(Boolean);

    // Last updated (already extracted via meta)
    const luMatch = document.body.innerText.match(/Article Last Updated:\s*([0-9\/]+)/);

    // Update notification block
    const updateNotificationEl = document.querySelector(".summcent + * .elementor-shortcode, .summcent .elementor-shortcode");
    const updateNotification = updateNotificationEl ? updateNotificationEl.innerHTML.trim() : null;

    return {
      title: text("h1.elementor-heading-title") || text("h1"),
      bodyHtml: html(".gg-main-article-content"),
      bodyChars: html(".gg-main-article-content")?.length ?? 0,
      sourcesText: sources.length > 0 ? sources.join("\n\n") : null,
      lastUpdated: luMatch ? luMatch[1] : null,
      updateNotification,
    };
  });

  await page.close();
  return { slug, url, ...data, scrapedAt: new Date().toISOString() };
}

console.log(`Scraping ${SLUGS.length} articles…\n`);
for (const slug of SLUGS) {
  process.stdout.write(`  ${slug.padEnd(40)} `);
  const t0 = Date.now();
  try {
    const data = await scrapeOne(slug);
    existing[slug] = data;
    console.log(`✓ ${data.bodyChars} chars  (${Date.now() - t0}ms)`);
  } catch (e) {
    console.log(`✗ ${e.message}`);
    existing[slug] = { slug, error: String(e), scrapedAt: new Date().toISOString() };
  }
  // Politeness delay
  await new Promise((r) => setTimeout(r, 1500));
}

writeFileSync(OUT_FILE, JSON.stringify(existing, null, 2), "utf8");
console.log(`\nSaved ${Object.keys(existing).length} entries to ${OUT_FILE}`);

await browser.close();
