import { notFound } from "next/navigation";
import {
  allArticles,
  getArticle,
  lastUpdatedLabel,
} from "@/lib/articles";
import { PageTopBand } from "@/components/PageTopBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeedbackBox } from "@/components/FeedbackBox";
import { CollapsibleArticleBody } from "@/components/CollapsibleArticleBody";
import { DisclaimerBlock } from "@/components/DisclaimerBlock";

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
  return {
    title: article.seo.title || article.title,
    description: article.seo.description || article.excerpt,
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

        {/* Article body — h1 = group title, h2 = collapsible accordion */}
        <div className="max-w-3xl mx-auto mt-12">
          <CollapsibleArticleBody html={article.contentHtml} />
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
