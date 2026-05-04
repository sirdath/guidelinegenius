import articlesJson from "@/data/generated/articles.json";
import categoriesJson from "@/data/generated/categories.json";

export type Article = (typeof articlesJson)[number];
export type Category = (typeof categoriesJson)[number];

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&nbsp;": " ",
};

export function decodeEntities(s: string): string {
  return s.replace(/&[#a-z0-9]+;/g, (m) => ENTITIES[m] ?? m);
}

const all = articlesJson as Article[];
const cats = categoriesJson as Category[];

export const allArticles: Article[] = all.map((a) => ({
  ...a,
  title: decodeEntities(a.title),
  excerpt: decodeEntities(a.excerpt),
  categories: a.categories.map((c) => ({ ...c, name: decodeEntities(c.name) })),
}));

// Default order: alphabetical. Pages can re-sort client-side.
export const allCategories: Category[] = cats
  .map((c) => ({ ...c, name: decodeEntities(c.name) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const bySlug = new Map(allArticles.map((a) => [a.slug, a]));
export function getArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

const catBySlug = new Map(allCategories.map((c) => [c.slug, c]));
export function getCategory(slug: string): Category | undefined {
  return catBySlug.get(slug);
}

export function articlesInCategory(slug: string): Article[] {
  return allArticles.filter((a) => a.categories.some((c) => c.slug === slug));
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return allArticles;
  return allArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.categories.some((c) => c.name.toLowerCase().includes(q)),
  );
}

export function recentArticles(n = 8): Article[] {
  return allArticles.slice(0, n);
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function parseUkDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  // "14 May 2025" → Date
  const m = s.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (!m) return null;
  const idx = MONTHS.findIndex((mn) => mn.toLowerCase() === m[2].toLowerCase());
  if (idx < 0) return null;
  return new Date(Date.UTC(parseInt(m[3], 10), idx, parseInt(m[1], 10)));
}

// "Last updated" prefers the most recent change-log entry date, then the
// editorial last-edited date, then the WordPress modified timestamp.
export function lastUpdatedLabel(a: Article): string | null {
  const candidates: Date[] = [];
  for (const u of a.updateNotifications) {
    const d = parseUkDate(u.date);
    if (d) candidates.push(d);
  }
  const edited = parseUkDate(a.lastEdited);
  if (edited) candidates.push(edited);
  if (candidates.length === 0 && a.modifiedAt) {
    const d = new Date(a.modifiedAt.replace(" ", "T") + "Z");
    if (!isNaN(d.getTime())) candidates.push(d);
  }
  if (candidates.length === 0) return null;
  const max = candidates.reduce((a, b) => (a > b ? a : b));
  return `${max.getUTCDate()} ${MONTHS[max.getUTCMonth()]} ${max.getUTCFullYear()}`;
}

export function siteStats() {
  return {
    articleCount: allArticles.length,
    categoryCount: allCategories.length,
    totalReadingMinutes: allArticles.reduce((s, a) => s + a.readingMinutes, 0),
  };
}
