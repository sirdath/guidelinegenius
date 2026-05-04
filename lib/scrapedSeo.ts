import seoRaw from "@/data/generated/articles-seo.json";

export type ScrapedSeo = {
  slug: string;
  url: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  keywords: string | null;
  scrapedAt: string;
  error?: string;
};

const seo = seoRaw as Record<string, ScrapedSeo>;

export function getScrapedSeo(slug: string): ScrapedSeo | null {
  const e = seo[slug];
  if (!e || e.error) return null;
  return e;
}
