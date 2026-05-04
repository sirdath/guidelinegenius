"use client";
import { useEffect, useState } from "react";
import { CollapsibleArticleBody } from "./CollapsibleArticleBody";
import { LiveArticleBody } from "./LiveArticleBody";
import { getOverride, type ArticleOverride } from "@/lib/overrides";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

// Reads the article HTML, looks for a localStorage override on mount,
// and renders whichever content is current. Also patches the document
// title and visible <h1> when the override touches the title.
export function ArticleBodyView({
  slug,
  originalHtml,
  isLive,
}: {
  slug: string;
  originalHtml: string;
  isLive: boolean;
}) {
  const [override, setOverride] = useState<ArticleOverride | null>(null);

  useEffect(() => {
    const o = getOverride(slug);
    if (o) {
      setOverride(o);
      // Patch tab title + visible H1 if title overridden
      if (o.title) {
        // Update document.title (tab text)
        if (o.seoTitle) {
          document.title = `${o.seoTitle} · Guideline Genius`;
        }
        // Update visible H1 tag
        const h1 = document.querySelector<HTMLHeadingElement>("article header h1");
        if (h1) h1.textContent = o.title;
      }
      if (o.seoTitle && !o.title) {
        document.title = `${o.seoTitle} · Guideline Genius`;
      }
      // Patch sources block if overridden
      if (o.sources !== undefined) {
        const sourcesEl = document.querySelector<HTMLDivElement>("[data-article-sources]");
        if (sourcesEl) {
          if (o.sources.trim() === "") {
            sourcesEl.style.display = "none";
          } else {
            sourcesEl.style.display = "";
            const lines = o.sources.split(/\n+/).map((l) => l.trim()).filter(Boolean);
            sourcesEl.innerHTML = lines.map((l) => `<p>${escapeHtml(l)}</p>`).join("");
          }
        }
      }
    }
  }, [slug]);

  const html = override?.contentHtml ?? originalHtml;

  return (
    <div>
      {override && (
        <div
          className="mb-6 flex items-start gap-3 rounded-md p-4 text-[13.5px]"
          style={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#7c2d12",
          }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong>Local edit preview.</strong> You're viewing changes saved
            from the admin panel. They live in your browser only —{" "}
            <Link href={`/admin/articles/edit?slug=${slug}`} className="underline font-semibold">
              edit again
            </Link>{" "}
            or clear them to see the original.
          </div>
        </div>
      )}
      {isLive ? <LiveArticleBody html={html} /> : <CollapsibleArticleBody html={html} />}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c),
  );
}
