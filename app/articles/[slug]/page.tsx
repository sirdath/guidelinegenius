import { notFound } from "next/navigation";
import {
  allArticles,
  getArticle,
  lastUpdatedLabel,
} from "@/lib/articles";
import { PageTopBand } from "@/components/PageTopBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeedbackBox } from "@/components/FeedbackBox";
import { ArticleBodyView } from "@/components/ArticleBodyView";
import { DisclaimerBlock } from "@/components/DisclaimerBlock";
import { getScrapedArticle } from "@/lib/scrapedArticles";
import { getScrapedSeo } from "@/lib/scrapedSeo";

export async function generateStaticParams() {
  return allArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  // Prefer scraped SEO from the live site (e.g. "Pneumothorax | UKMLA Guide"),
  // fall back to WXR-derived AIOSEO fields, then to plain article title.
  const seo = getScrapedSeo(slug);
  const title = seo?.title || article.seo.title || article.title;
  const description =
    seo?.description || article.seo.description || article.excerpt;
  const ogImage = seo?.og?.image;
  const canonical = seo?.canonical;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: seo?.og?.title || title,
      description: seo?.og?.description || description,
      type: (seo?.og?.type as any) || "article",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: (seo?.twitter?.card as any) || "summary_large_image",
      title: seo?.twitter?.title || title,
      description: seo?.twitter?.description || description,
      ...(seo?.twitter?.image ? { images: [seo.twitter.image] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const primary = article.categories[0];
  const updated = lastUpdatedLabel(article);

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
  ];
  if (primary) {
    breadcrumbs.push({ label: "Categories", href: "/categories" });
    breadcrumbs.push({ label: primary.name, href: `/categories/${primary.slug}` });
  }
  breadcrumbs.push({ label: article.title });

  const sourceLines = article.sources
    ? article.sources
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <article>
      <PageTopBand />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-10">
        {/* Centered title block */}
        <header className="text-center">
          <h1
            className="text-[34px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.1] tracking-tight"
            style={{ color: "#1a1a1a" }}
          >
            {article.title}
          </h1>
          {sourceLines.length > 0 && (
            <div
              data-article-sources
              className="mx-auto mt-5 max-w-3xl space-y-1.5 text-[14.5px] leading-[1.55]"
              style={{ color: "#003366" }}
            >
              {sourceLines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          )}
          {updated && (
            <p className="mt-5 text-[15px]" style={{ color: "#1a1a1a" }}>
              <strong>Article Last Updated:</strong> {updated}
            </p>
          )}
          {article.updateNotifications.length > 0 && (
            <div
              className="mx-auto mt-5 max-w-3xl rounded-md px-6 py-4 text-[14.5px] leading-relaxed text-left"
              style={{
                border: "1px solid #b8d6ff",
                backgroundColor: "#E3F2FD",
                color: "#1a1a1a",
              }}
            >
              {article.updateNotifications.map((u, i) => (
                <div key={i} className={i > 0 ? "mt-3 pt-3 border-t" : ""} style={i > 0 ? { borderColor: "#b8d6ff" } : {}}>
                  <p>{u.text}</p>
                  {u.date && <p className="mt-1.5 text-[13.5px]">Date: {u.date}</p>}
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Article body — prefer scraped live content (Elementor accordion HTML)
            when available, otherwise fall back to WXR-derived content. Local
            admin overrides (if any) are applied on the client. */}
        <div className="max-w-3xl mx-auto mt-12">
          {(() => {
            const scraped = getScrapedArticle(article.slug);
            return (
              <ArticleBodyView
                slug={article.slug}
                originalHtml={scraped?.bodyHtml ?? article.contentHtml}
                isLive={Boolean(scraped?.bodyHtml)}
              />
            );
          })()}
        </div>

        {/* Feedback */}
        <div className="max-w-3xl mx-auto">
          <FeedbackBox slug={article.slug} />
        </div>
      </div>

      {/* Disclaimer block matches live-site footer area */}
      <DisclaimerBlock />
    </article>
  );
}
