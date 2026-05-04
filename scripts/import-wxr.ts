import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

type Raw = Record<string, any>;

const ROOT = process.cwd();
const WXR_PATH = resolve(ROOT, "data/wp-export.xml");
const OUT_DIR = resolve(ROOT, "data/generated");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
});

const arr = <T>(v: T | T[] | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const cdata = (n: any): string => {
  if (n == null) return "";
  if (typeof n === "string") return n;
  if (typeof n === "object" && "__cdata" in n) return String(n.__cdata ?? "");
  if (typeof n === "object" && "#text" in n) return String(n["#text"] ?? "");
  return String(n);
};

function getMeta(item: Raw, key: string): string {
  const metas = arr(item["wp:postmeta"]);
  for (const m of metas) {
    const k = cdata(m["wp:meta_key"]);
    if (k === key) return cdata(m["wp:meta_value"]);
  }
  return "";
}

// Convert WP's quirky <input type="button" name="URL" value="label"> reference
// pattern into proper <a> links.
function normaliseHtml(html: string): string {
  let out = html;
  out = out.replace(
    /<input\b[^>]*\bname="([^"]+)"[^>]*\bvalue="([^"]+)"[^>]*\/?>(\s*<\/input>)?/gi,
    (_m, url, label) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ref-link">${label}</a>`,
  );
  out = out.replace(/<input\b[^>]*\bvalue="([^"]+)"[^>]*\bname="([^"]+)"[^>]*\/?>/gi,
    (_m, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ref-link">${label}</a>`);
  // Drop bespoke <div divtype="greendiv">, <abbr type="underline"> custom attrs
  out = out.replace(/\s+divtype="[^"]*"/gi, "");
  out = out.replace(/\s+type="underline"/gi, "");
  // Strip empty <p>&nbsp;</p>
  out = out.replace(/<p>(\s|&nbsp;)*<\/p>/gi, "");
  return out;
}

function plainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(html: string, max = 220): string {
  const t = plainText(html);
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function readingMinutes(html: string): number {
  const wc = plainText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wc / 220));
}

console.log(`Reading ${WXR_PATH}…`);
const xml = readFileSync(WXR_PATH, "utf8");
console.log(`Parsing XML (${(xml.length / 1024 / 1024).toFixed(1)} MB)…`);
const doc = parser.parse(xml);

const channel: Raw = doc.rss?.channel ?? {};
const itemsRaw = arr<Raw>(channel.item);

// ---- Categories ----
type Category = {
  slug: string;
  name: string;
  parent: string | null;
  image: string | null;
};

const categories: Category[] = arr<Raw>(channel["wp:category"]).map((c) => {
  const slug = cdata(c["wp:category_nicename"]);
  const name = cdata(c["wp:cat_name"]);
  const parent = cdata(c["wp:category_parent"]) || null;
  let image: string | null = null;
  for (const tm of arr<Raw>(c["wp:termmeta"])) {
    if (cdata(tm["wp:meta_key"]) === "z_taxonomy_image") {
      image = cdata(tm["wp:meta_value"]) || null;
    }
  }
  return { slug, name, parent, image };
});

// ---- Attachment lookup by id (for featured images) ----
const attachmentById = new Map<string, string>();
for (const it of itemsRaw) {
  if (cdata(it["wp:post_type"]) !== "attachment") continue;
  const id = cdata(it["wp:post_id"]);
  const url = cdata(it["wp:attachment_url"]);
  if (id && url) attachmentById.set(id, url);
}

// ---- Articles ----
type Article = {
  id: string;
  slug: string;
  title: string;
  status: string;
  publishedAt: string;
  modifiedAt: string;
  authors: string[];
  reviewers: string[];
  lastEdited: string | null;
  categories: { slug: string; name: string }[];
  contentHtml: string;
  excerpt: string;
  readingMinutes: number;
  sources: string;
  updateNotifications: { date: string | null; text: string }[];
  featuredImage: string | null;
  seo: { title: string; description: string };
};

function parseFooterNote(note: string): {
  authors: string[];
  reviewers: string[];
  lastEdited: string | null;
} {
  const out: { authors: string[]; reviewers: string[]; lastEdited: string | null } = {
    authors: [],
    reviewers: [],
    lastEdited: null,
  };
  if (!note) return out;
  const splitNames = (s: string) =>
    s
      .split(/,| and /i)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  for (const raw of note.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const author = line.match(/^Authors?:\s*(.*)$/i);
    if (author) {
      out.authors.push(...splitNames(author[1]));
      continue;
    }
    const reviewer = line.match(/^Reviewers?:\s*(.*)$/i);
    if (reviewer) {
      out.reviewers.push(...splitNames(reviewer[1]));
      continue;
    }
    const edited = line.match(/^Last\s+edited:\s*(.*)$/i);
    if (edited && edited[1]) {
      out.lastEdited = formatUkDate(edited[1].trim());
    }
  }
  return out;
}

function formatUkDate(s: string): string {
  // Accepts "14/05/25" or "14/05/2025" → "14 May 2025"
  const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (!m) return s;
  const [, dd, mm, yyRaw] = m;
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const yr = parseInt(yyRaw, 10);
  const year = yr < 100 ? 2000 + yr : yr;
  const monthName = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ][month - 1];
  if (!monthName || isNaN(day)) return s;
  return `${day} ${monthName} ${year}`;
}

function parseUpdateNotifications(s: string): { date: string | null; text: string }[] {
  if (!s) return [];
  // Entries are separated by blank lines; each may end with "Date: dd/mm/yy".
  return s
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const m = chunk.match(/Date:\s*(.+?)\s*$/i);
      if (m) {
        return {
          date: formatUkDate(m[1].trim()),
          text: chunk.replace(/\s*Date:\s*.+?\s*$/i, "").trim(),
        };
      }
      return { date: null, text: chunk };
    });
}

const articles: Article[] = [];
for (const it of itemsRaw) {
  if (cdata(it["wp:post_type"]) !== "post") continue;
  const status = cdata(it["wp:status"]);
  if (status !== "publish") continue;

  const id = cdata(it["wp:post_id"]);
  const title = cdata(it.title);
  const slug = cdata(it["wp:post_name"]) || id;
  const rawHtml = cdata(it["content:encoded"]);
  const contentHtml = normaliseHtml(rawHtml);
  const cats = arr<Raw>(it.category)
    .filter((c) => c["@_domain"] === "category")
    .map((c) => ({
      slug: c["@_nicename"] ?? "",
      name: cdata(c),
    }))
    .filter((c) => c.slug);

  const sources = getMeta(it, "summary");
  const footerNote = getMeta(it, "footer_note");
  const { authors, reviewers, lastEdited } = parseFooterNote(footerNote);
  const updateNotifications = parseUpdateNotifications(getMeta(it, "article_update_notification"));
  const thumbId = getMeta(it, "_thumbnail_id");
  const featuredImage = thumbId ? attachmentById.get(thumbId) ?? null : null;

  articles.push({
    id,
    slug,
    title,
    status,
    publishedAt: cdata(it["wp:post_date_gmt"]) || cdata(it["wp:post_date"]),
    modifiedAt: cdata(it["wp:post_modified_gmt"]) || cdata(it["wp:post_modified"]),
    authors,
    reviewers,
    lastEdited,
    categories: cats,
    contentHtml,
    excerpt: makeExcerpt(contentHtml),
    readingMinutes: readingMinutes(contentHtml),
    sources,
    updateNotifications,
    featuredImage,
    seo: {
      title: getMeta(it, "_aioseo_title") || title,
      description: getMeta(it, "_aioseo_description") || makeExcerpt(contentHtml, 160),
    },
  });
}

articles.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));

// ---- Pages (About, Contact, Privacy, Terms, etc.) ----
type Page = {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  modifiedAt: string;
  seo: { title: string; description: string };
};

// Skip WP pages that we render natively in Next.js — their WP content is just
// theme/Elementor cruft we don't want.
const SKIP_PAGE_SLUGS = new Set([
  "home",
  "categories",
  "subscribe",
  "questionnaire",
  "questionnaire-2",
  "login",
  "signup",
  "register",
  "checkout",
  "my-account",
  "account",
]);

const pages: Page[] = [];
for (const it of itemsRaw) {
  if (cdata(it["wp:post_type"]) !== "page") continue;
  if (cdata(it["wp:status"]) !== "publish") continue;
  const slug = cdata(it["wp:post_name"]);
  if (!slug || SKIP_PAGE_SLUGS.has(slug)) continue;

  const rawHtml = cdata(it["content:encoded"]);
  // Skip pages that are essentially Elementor placeholders (very short or empty content)
  if (rawHtml.replace(/<[^>]+>/g, "").trim().length < 200) continue;

  const contentHtml = normaliseHtml(rawHtml);
  pages.push({
    id: cdata(it["wp:post_id"]),
    slug,
    title: cdata(it.title),
    contentHtml,
    excerpt: makeExcerpt(contentHtml, 200),
    modifiedAt: cdata(it["wp:post_modified_gmt"]) || cdata(it["wp:post_modified"]),
    seo: {
      title: getMeta(it, "_aioseo_title") || cdata(it.title),
      description: getMeta(it, "_aioseo_description") || makeExcerpt(contentHtml, 160),
    },
  });
}

// ---- Stats per category ----
const catCounts = new Map<string, number>();
for (const a of articles) for (const c of a.categories) catCounts.set(c.slug, (catCounts.get(c.slug) ?? 0) + 1);
const categoriesWithCount = categories
  .map((c) => ({ ...c, articleCount: catCounts.get(c.slug) ?? 0 }))
  .filter((c) => c.articleCount > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, "articles.json"), JSON.stringify(articles, null, 2), "utf8");
writeFileSync(
  resolve(OUT_DIR, "categories.json"),
  JSON.stringify(categoriesWithCount, null, 2),
  "utf8",
);
writeFileSync(resolve(OUT_DIR, "pages.json"), JSON.stringify(pages, null, 2), "utf8");

const summaryReport = {
  totalArticles: articles.length,
  totalCategories: categoriesWithCount.length,
  totalPages: pages.length,
  pagesImported: pages.map((p) => p.slug),
  attachmentsIndexed: attachmentById.size,
  sampleTitles: articles.slice(0, 5).map((a) => a.title),
  longestArticleWords: Math.max(...articles.map((a) => plainText(a.contentHtml).split(/\s+/).length)),
  averageReadingMinutes:
    Math.round((articles.reduce((s, a) => s + a.readingMinutes, 0) / articles.length) * 10) / 10,
};
writeFileSync(resolve(OUT_DIR, "import-report.json"), JSON.stringify(summaryReport, null, 2), "utf8");

console.log("\nImport complete.");
console.log(`  Articles:   ${summaryReport.totalArticles}`);
console.log(`  Categories: ${summaryReport.totalCategories}`);
console.log(`  Pages:      ${summaryReport.totalPages} (${summaryReport.pagesImported.join(", ")})`);
console.log(`  Avg read:   ${summaryReport.averageReadingMinutes} min`);
console.log(`  Output:     ${OUT_DIR}`);
