// Local-only article overrides — admin edits live in the user's browser
// localStorage, applied on top of the imported article data when shown.
// Real persistence requires a backend (Supabase) in a later phase.

export type ArticleOverride = {
  slug: string;
  title?: string;
  contentHtml?: string;
  sources?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoCanonical?: string;
  seoOgImage?: string;
  updatedAt: string;
};

const STORAGE_KEY = "gg_article_overrides_v1";

function readMap(): Record<string, ArticleOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, ArticleOverride>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function getOverride(slug: string): ArticleOverride | null {
  return readMap()[slug] ?? null;
}

export function setOverride(slug: string, patch: Partial<ArticleOverride>) {
  const map = readMap();
  map[slug] = {
    ...(map[slug] ?? { slug, updatedAt: new Date().toISOString() }),
    ...patch,
    slug,
    updatedAt: new Date().toISOString(),
  };
  writeMap(map);
}

export function clearOverride(slug: string) {
  const map = readMap();
  delete map[slug];
  writeMap(map);
}

export function listOverrides(): ArticleOverride[] {
  return Object.values(readMap()).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1,
  );
}

export function clearAllOverrides() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
