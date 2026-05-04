import scrapedRaw from "@/data/generated/articles-live.json";

export type ScrapedArticle = {
  slug: string;
  url: string;
  title: string | null;
  bodyHtml: string | null;
  bodyChars: number;
  sourcesText: string | null;
  lastUpdated: string | null;
  updateNotification: string | null;
  scrapedAt: string;
  error?: string;
};

const scraped = scrapedRaw as Record<string, ScrapedArticle>;

export function getScrapedArticle(slug: string): ScrapedArticle | null {
  const entry = scraped[slug];
  if (!entry || entry.error || !entry.bodyHtml) return null;
  return entry;
}

export function hasScrapedContent(slug: string): boolean {
  return Boolean(getScrapedArticle(slug));
}
