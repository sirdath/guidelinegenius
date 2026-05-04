"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allArticles } from "@/lib/articles";
import { getScrapedSeo } from "@/lib/scrapedSeo";
import { listOverrides } from "@/lib/overrides";
import { Search as SearchIcon, ChevronRight } from "lucide-react";

export default function AdminSeoPage() {
  const [q, setQ] = useState("");
  const [overrides, setOverrides] = useState<Map<string, { seoTitle?: string; seoDescription?: string }>>(
    new Map(),
  );

  useEffect(() => {
    const map = new Map();
    for (const o of listOverrides()) {
      map.set(o.slug, { seoTitle: o.seoTitle, seoDescription: o.seoDescription });
    }
    setOverrides(map);
  }, []);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allArticles
      .map((a) => {
        const seo = getScrapedSeo(a.slug);
        const o = overrides.get(a.slug);
        const title = o?.seoTitle || seo?.title || a.seo?.title || a.title;
        const desc = o?.seoDescription || seo?.description || a.seo?.description || a.excerpt;
        const overridden = !!(o?.seoTitle || o?.seoDescription);
        return { slug: a.slug, title, desc, overridden, originalTitle: a.title };
      })
      .filter((r) =>
        !term ||
        r.title.toLowerCase().includes(term) ||
        r.slug.toLowerCase().includes(term),
      );
  }, [q, overrides]);

  return (
    <div>
      <h1
        className="text-[28px] font-extrabold tracking-tight"
        style={{ color: "#003366" }}
      >
        SEO bulk editor
      </h1>
      <p className="mt-1 text-[14px]" style={{ color: "#1a1a1a" }}>
        Review every article's meta title and description in one place. Click any row to open the full editor.
      </p>

      <div className="my-5 relative max-w-md">
        <SearchIcon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "#6B6A6A" }}
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by title or slug…"
          className="w-full h-11 pl-10 pr-4 rounded-md bg-white border text-[14px] focus:outline-none focus:ring-2"
          style={{ borderColor: "#cfd8e3" }}
        />
      </div>

      <p className="mb-3 text-[13px]" style={{ color: "#6B6A6A" }}>
        {rows.length} {rows.length === 1 ? "row" : "rows"}
      </p>

      <div
        className="rounded-md bg-white overflow-hidden"
        style={{ border: "1px solid #cfd8e3" }}
      >
        <div
          className="grid grid-cols-[1fr_60px_60px_24px] gap-3 px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wider sticky top-0"
          style={{
            borderBottom: "1px solid #cfd8e3",
            color: "#6B6A6A",
            backgroundColor: "#f4f6fa",
          }}
        >
          <div>Article · Meta title · Description</div>
          <div className="text-right">Title</div>
          <div className="text-right">Desc</div>
          <div></div>
        </div>
        <ul className="divide-y" style={{ borderColor: "#eef0f4" }}>
          {rows.slice(0, 200).map((r) => {
            const titleLen = r.title.length;
            const descLen = r.desc.length;
            return (
              <li key={r.slug}>
                <Link
                  href={`/admin/articles/edit?slug=${encodeURIComponent(r.slug)}`}
                  className="grid grid-cols-[1fr_60px_60px_24px] gap-3 items-center px-4 py-3 transition-colors hover:bg-[#f4f6fa]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[14px] font-semibold truncate"
                        style={{ color: "#003366" }}
                      >
                        {r.title}
                      </span>
                      {r.overridden && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: "#fef3c7", color: "#854d0e" }}
                        >
                          Edited
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12.5px] line-clamp-1" style={{ color: "#5A6B7E" }}>
                      {r.desc}
                    </div>
                  </div>
                  <div
                    className="text-[12px] text-right tabular-nums"
                    style={{ color: titleLen > 60 ? "#dc2626" : "#1a1a1a" }}
                  >
                    {titleLen}
                  </div>
                  <div
                    className="text-[12px] text-right tabular-nums"
                    style={{ color: descLen > 160 ? "#dc2626" : "#1a1a1a" }}
                  >
                    {descLen}
                  </div>
                  <ChevronRight className="h-4 w-4" style={{ color: "#9ab" }} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {rows.length > 200 && (
        <p className="mt-4 text-center text-[13px]" style={{ color: "#6B6A6A" }}>
          Showing first 200 of {rows.length} — refine the search to see more.
        </p>
      )}
    </div>
  );
}
