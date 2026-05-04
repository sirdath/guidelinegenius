"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getArticle } from "@/lib/articles";
import { getScrapedArticle } from "@/lib/scrapedArticles";
import { getScrapedSeo } from "@/lib/scrapedSeo";
import {
  getOverride,
  setOverride,
  clearOverride,
  type ArticleOverride,
} from "@/lib/overrides";
import { ChevronLeft, ExternalLink, Save, RotateCcw, Eye } from "lucide-react";

export default function AdminArticleEditPage() {
  return (
    <Suspense
      fallback={
        <div className="text-ink-muted">Loading editor…</div>
      }
    >
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const slug = sp.get("slug") || "";
  const article = slug ? getArticle(slug) : null;
  const scraped = slug ? getScrapedArticle(slug) : null;
  const scrapedSeo = slug ? getScrapedSeo(slug) : null;

  // Defaults from imported data + scraped fallbacks
  const baseline = useMemo(
    () => ({
      title: article?.title ?? "",
      contentHtml:
        scraped?.bodyHtml ?? article?.contentHtml ?? "",
      sources: article?.sources ?? "",
      seoTitle:
        scrapedSeo?.title ?? article?.seo?.title ?? article?.title ?? "",
      seoDescription:
        scrapedSeo?.description ??
        article?.seo?.description ??
        article?.excerpt ??
        "",
      seoCanonical: scrapedSeo?.canonical ?? "",
      seoOgImage: scrapedSeo?.og?.image ?? "",
    }),
    [article, scraped, scrapedSeo],
  );

  const [form, setForm] = useState(baseline);
  const [saved, setSaved] = useState(false);
  const [hasOverride, setHasOverride] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const o = getOverride(slug);
    if (o) {
      setHasOverride(true);
      setForm({
        title: o.title ?? baseline.title,
        contentHtml: o.contentHtml ?? baseline.contentHtml,
        sources: o.sources ?? baseline.sources,
        seoTitle: o.seoTitle ?? baseline.seoTitle,
        seoDescription: o.seoDescription ?? baseline.seoDescription,
        seoCanonical: o.seoCanonical ?? baseline.seoCanonical,
        seoOgImage: o.seoOgImage ?? baseline.seoOgImage,
      });
    } else {
      setForm(baseline);
    }
  }, [slug, baseline]);

  if (!article) {
    return (
      <div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1 text-[13px] hover:underline"
          style={{ color: "#003366" }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to articles
        </Link>
        <p className="mt-6 text-[14px]" style={{ color: "#1a1a1a" }}>
          Article not found. The slug <code>{slug}</code> does not exist in the library.
        </p>
      </div>
    );
  }

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function handleSave() {
    const patch: Partial<ArticleOverride> = {};
    if (form.title !== baseline.title) patch.title = form.title;
    if (form.contentHtml !== baseline.contentHtml) patch.contentHtml = form.contentHtml;
    if (form.sources !== baseline.sources) patch.sources = form.sources;
    if (form.seoTitle !== baseline.seoTitle) patch.seoTitle = form.seoTitle;
    if (form.seoDescription !== baseline.seoDescription)
      patch.seoDescription = form.seoDescription;
    if (form.seoCanonical !== baseline.seoCanonical)
      patch.seoCanonical = form.seoCanonical;
    if (form.seoOgImage !== baseline.seoOgImage)
      patch.seoOgImage = form.seoOgImage;

    if (Object.keys(patch).length === 0) {
      setSaved(true);
      return;
    }
    setOverride(slug, patch);
    setHasOverride(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!confirm("Discard all edits to this article?")) return;
    clearOverride(slug);
    setHasOverride(false);
    setForm(baseline);
  }

  const titleCount = form.seoTitle.length;
  const descCount = form.seoDescription.length;

  return (
    <div>
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1 text-[13px] hover:underline mb-3"
        style={{ color: "#003366" }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="text-[24px] font-extrabold tracking-tight truncate"
            style={{ color: "#003366" }}
          >
            {article.title}
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "#6B6A6A" }}>
            /articles/{article.slug}
            {hasOverride && (
              <span
                className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#fef3c7", color: "#854d0e" }}
              >
                Edited
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/articles/${article.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-[13.5px] font-semibold hover:bg-[#f4f6fa]"
            style={{ border: "1px solid #cfd8e3", color: "#003366" }}
          >
            <Eye className="h-4 w-4" />
            Preview
            <ExternalLink className="h-3 w-3" />
          </a>
          {hasOverride && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-[13.5px] font-semibold hover:bg-[#f4f6fa]"
              style={{ border: "1px solid #cfd8e3", color: "#1a1a1a" }}
            >
              <RotateCcw className="h-4 w-4" />
              Discard edits
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1" }}
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <Section title="Article">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
            />
          </Field>
          <Field label="Sources / references" hint="Plain text. Each source on its own line.">
            <textarea
              value={form.sources}
              onChange={(e) => update("sources", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
            />
          </Field>
          <Field
            label="Body HTML"
            hint="The article body. Live-scraped content uses Elementor accordion structure (h2.ac-title for groups, .accordion-section for collapsible items)."
          >
            <textarea
              value={form.contentHtml}
              onChange={(e) => update("contentHtml", e.target.value)}
              rows={18}
              spellCheck={false}
              className="w-full px-3 py-2 rounded-md border bg-white text-[12.5px] font-mono leading-relaxed focus:outline-none"
              style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
            />
            <p className="text-[12px] mt-1" style={{ color: "#6B6A6A" }}>
              {form.contentHtml.length.toLocaleString()} chars
            </p>
          </Field>
        </Section>

        <Section title="SEO">
          <Field
            label="Meta title"
            hint={`Browser-tab title and SERP heading. ${titleCount}/60 ideal.`}
          >
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{
                borderColor: titleCount > 60 ? "#dc2626" : "#cfd8e3",
                color: "#1a1a1a",
              }}
            />
          </Field>
          <Field
            label="Meta description"
            hint={`SERP snippet. ${descCount}/160 ideal.`}
          >
            <textarea
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{
                borderColor: descCount > 160 ? "#dc2626" : "#cfd8e3",
                color: "#1a1a1a",
              }}
            />
          </Field>
          <Field label="Canonical URL" hint="Leave blank to use the default.">
            <input
              type="url"
              value={form.seoCanonical}
              onChange={(e) => update("seoCanonical", e.target.value)}
              placeholder="https://www.guidelinegenius.com/abdominal-aortic-aneurysm-aaa/"
              className="w-full h-10 px-3 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
            />
          </Field>
          <Field label="OG image URL" hint="The image shared when this article is posted on social media.">
            <input
              type="url"
              value={form.seoOgImage}
              onChange={(e) => update("seoOgImage", e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full h-10 px-3 rounded-md border bg-white text-[14px] focus:outline-none"
              style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
            />
          </Field>

          {/* Live SERP preview */}
          <div
            className="mt-4 rounded-md p-4"
            style={{ backgroundColor: "#f4f6fa", border: "1px solid #cfd8e3" }}
          >
            <div className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "#6B6A6A" }}>
              Google SERP preview
            </div>
            <div className="text-[12px] mb-1" style={{ color: "#5A6B7E" }}>
              {form.seoCanonical || `https://guidelinegenius.dathproject.com/articles/${slug}/`}
            </div>
            <div
              className="text-[18px] leading-snug truncate"
              style={{ color: "#1a0dab" }}
            >
              {form.seoTitle || "Untitled"}
            </div>
            <div className="mt-1 text-[13px] line-clamp-2" style={{ color: "#4d5156" }}>
              {form.seoDescription || "No description"}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-md bg-white p-6"
      style={{ border: "1px solid #cfd8e3" }}
    >
      <h2 className="text-[16px] font-bold mb-4" style={{ color: "#003366" }}>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-[12.5px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: "#003366" }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[12px]" style={{ color: "#6B6A6A" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
