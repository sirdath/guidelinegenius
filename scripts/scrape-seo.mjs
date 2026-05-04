// Lightweight SEO scraper — fetches each article HTML and extracts the
// <title>, meta description, OpenGraph tags, Twitter card tags, canonical
// URL, and AIOSEO keywords. No headless browser needed since meta tags are
// in the static response. Runs ~10 articles in parallel for speed.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ARTICLES_FILE = resolve(process.cwd(), "data/generated/articles.json");
const SEO_FILE = resolve(process.cwd(), "data/generated/articles-seo.json");

const articles = JSON.parse(readFileSync(ARTICLES_FILE, "utf8"));
const existing = existsSync(SEO_FILE) ? JSON.parse(readFileSync(SEO_FILE, "utf8")) : {};

function decode(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&nbsp;/g, " ");
}

function extract(html) {
  const out = {
    title: null,
    description: null,
    canonical: null,
    og: {},
    twitter: {},
    keywords: null,
    schemaJson: null,
  };

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) out.title = decode(titleMatch[1].trim());

  // Meta tags — both `name="..."` and `property="..."` formats
  const metaRe = /<meta\s+(?:[^>]*?(?:name|property)="([^"]+)"[^>]*?content="([^"]*)"|[^>]*?content="([^"]*)"[^>]*?(?:name|property)="([^"]+)")[^>]*>/gi;
  let m;
  while ((m = metaRe.exec(html)) !== null) {
    const key = m[1] || m[4];
    const value = decode(m[2] || m[3] || "");
    if (!key) continue;
    const lower = key.toLowerCase();
    if (lower === "description") out.description = value;
    else if (lower === "keywords") out.keywords = value;
    else if (lower.startsWith("og:")) out.og[lower.slice(3)] = value;
    else if (lower.startsWith("twitter:")) out.twitter[lower.slice(8)] = value;
  }

  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (canonMatch) out.canonical = canonMatch[1];

  const schemaMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (schemaMatch) {
    try {
      out.schemaJson = JSON.parse(schemaMatch[1]);
    } catch {}
  }

  return out;
}

async function scrape(slug) {
  const url = `https://www.guidelinegenius.com/${slug}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return { slug, url, ...extract(html), scrapedAt: new Date().toISOString() };
}

async function runWithLimit(items, limit, fn) {
  const results = [];
  let cursor = 0;
  let done = 0;
  const total = items.length;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      const item = items[i];
      try {
        const r = await fn(item);
        results.push(r);
      } catch (e) {
        results.push({ slug: item.slug, error: String(e.message || e) });
      }
      done++;
      if (done % 25 === 0 || done === total) {
        process.stdout.write(`\r  ${done}/${total} (${Math.round((done / total) * 100)}%)`);
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  process.stdout.write("\n");
  return results;
}

const todo = articles.filter((a) => {
  const e = existing[a.slug];
  return !e || e.error || !e.title;
});

console.log(`Total: ${articles.length}, already done: ${articles.length - todo.length}, to scrape: ${todo.length}`);

const t0 = Date.now();
const results = await runWithLimit(todo, 10, (a) => scrape(a.slug));
for (const r of results) {
  if (r.slug) existing[r.slug] = r;
}

writeFileSync(SEO_FILE, JSON.stringify(existing, null, 2), "utf8");
console.log(`\nDone in ${Math.round((Date.now() - t0) / 1000)}s`);

// Summary
const failed = results.filter((r) => r.error);
const ok = results.filter((r) => !r.error);
console.log(`  ${ok.length} succeeded`);
console.log(`  ${failed.length} failed`);
if (failed.length > 0) {
  console.log("Failures:");
  for (const f of failed.slice(0, 10)) {
    console.log(`  - ${f.slug}: ${f.error}`);
  }
}
console.log(`Output: ${SEO_FILE}`);
