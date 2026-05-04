// Full-fidelity scraper for every published article on guidelinegenius.com.
// Reads slugs from articles.json, filters out already-scraped ones in
// articles-live.json, and incrementally appends after each successful scrape
// so partial progress is never lost.
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ARTICLES_FILE = resolve(process.cwd(), "data/generated/articles.json");
const LIVE_FILE = resolve(process.cwd(), "data/generated/articles-live.json");

const allArticles = JSON.parse(readFileSync(ARTICLES_FILE, "utf8"));
const live = existsSync(LIVE_FILE)
  ? JSON.parse(readFileSync(LIVE_FILE, "utf8"))
  : {};

const slugs = allArticles.map((a) => a.slug);
const todo = slugs.filter((s) => {
  const e = live[s];
  // Re-scrape on error or missing body
  return !e || e.error || !e.bodyHtml;
});

console.log(`Total articles: ${slugs.length}`);
console.log(`Already scraped: ${slugs.length - todo.length}`);
console.log(`To scrape now:   ${todo.length}`);
console.log("");

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
);

async function scrapeOne(slug) {
  const url = `https://www.guidelinegenius.com/${slug}/`;
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  } catch (e) {
    // domcontentloaded is enough for most pages even if some background asset hangs
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 800));

  await page.evaluate(() => {
    document
      .querySelectorAll(
        ".elementor-popup-modal, [role='dialog'], [aria-modal='true'], .dialog-widget",
      )
      .forEach((el) => el.remove());
  });

  const data = await page.evaluate(() => {
    const text = (sel) => {
      const el = document.querySelector(sel);
      return el ? (el.textContent || "").trim() : null;
    };
    const html = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.innerHTML : null;
    };
    const luMatch = document.body.innerText.match(/Article Last Updated:\s*([0-9\/]+)/);
    return {
      title: text("h1.elementor-heading-title") || text("h1"),
      bodyHtml: html(".gg-main-article-content"),
      bodyChars: html(".gg-main-article-content")?.length ?? 0,
      lastUpdated: luMatch ? luMatch[1] : null,
    };
  });

  if (!data.bodyHtml || data.bodyChars < 500) {
    throw new Error(`empty or tiny body (${data.bodyChars} chars)`);
  }
  return data;
}

let success = 0;
let failed = 0;
const startTime = Date.now();

for (let i = 0; i < todo.length; i++) {
  const slug = todo[i];
  const url = `https://www.guidelinegenius.com/${slug}/`;
  const t0 = Date.now();
  try {
    const data = await scrapeOne(slug);
    live[slug] = {
      slug,
      url,
      ...data,
      scrapedAt: new Date().toISOString(),
    };
    success++;
    const ms = Date.now() - t0;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const eta = Math.round((elapsed / (i + 1)) * (todo.length - i - 1));
    console.log(
      `[${(i + 1).toString().padStart(3)}/${todo.length}] ✓ ${slug.padEnd(50)} ${data.bodyChars.toString().padStart(6)} chars  ${ms}ms  (eta ${Math.floor(eta / 60)}m${eta % 60}s)`,
    );
  } catch (e) {
    failed++;
    live[slug] = {
      slug,
      url,
      error: String(e.message || e),
      scrapedAt: new Date().toISOString(),
    };
    console.log(`[${(i + 1).toString().padStart(3)}/${todo.length}] ✗ ${slug.padEnd(50)} ${e.message || e}`);
  }

  // Save after every article so progress isn't lost on crash
  writeFileSync(LIVE_FILE, JSON.stringify(live, null, 2), "utf8");

  // Politeness delay
  await new Promise((r) => setTimeout(r, 700));
}

await browser.close();

const totalMs = Date.now() - startTime;
console.log("");
console.log(`Done in ${Math.round(totalMs / 1000)}s.`);
console.log(`  ${success} succeeded`);
console.log(`  ${failed} failed`);
console.log(`Output: ${LIVE_FILE}`);
