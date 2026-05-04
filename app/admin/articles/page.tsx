"use client";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { allArticles, allCategories } from "@/lib/articles";
import { listOverrides } from "@/lib/overrides";
import { Search as SearchIcon, ChevronRight, ExternalLink } from "lucide-react";

export default function AdminArticlesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [editedSlugs, setEditedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditedSlugs(new Set(listOverrides().map((o) => o.slug)));
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let arr = allArticles;
    if (cat) arr = arr.filter((a) => a.categories.some((c) => c.slug === cat));
    if (term)
      arr = arr.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.slug.toLowerCase().includes(term),
      );
    return arr;
  }, [q, cat]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "#003366" }}>
            Articles
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "#1a1a1a" }}>
            {allArticles.length} articles · click any to edit
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#6B6A6A" }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles by title or slug…"
            className="w-full h-11 pl-10 pr-4 rounded-md bg-white border text-[14px] focus:outline-none focus:ring-2"
            style={{ borderColor: "#cfd8e3" }}
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-11 px-3 rounded-md bg-white border text-[14px] focus:outline-none"
          style={{ borderColor: "#cfd8e3", color: "#1a1a1a" }}
        >
          <option value="">All specialties</option>
          {allCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-3 text-[13px]" style={{ color: "#6B6A6A" }}>
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      <ul
        className="divide-y rounded-md bg-white overflow-hidden"
        style={{ border: "1px solid #cfd8e3" }}
      >
        {results.slice(0, 200).map((a) => {
          const edited = editedSlugs.has(a.slug);
          return (
            <li key={a.id}>
              <Link
                href={`/admin/articles/edit?slug=${encodeURIComponent(a.slug)}`}
                className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[#f4f6fa]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate" style={{ color: "#003366" }}>
                      {a.title}
                    </span>
                    {edited && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#fef3c7", color: "#854d0e" }}
                      >
                        Edited
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12.5px] truncate" style={{ color: "#6B6A6A" }}>
                    /{a.slug}
                    {a.categories[0] && <> · {a.categories[0].name}</>}
                  </div>
                </div>
                <a
                  href={`/articles/${a.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-white"
                  style={{ color: "#6B6A6A", border: "1px solid #cfd8e3" }}
                  title="Open public article"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "#9ab" }} />
              </Link>
            </li>
          );
        })}
      </ul>

      {results.length > 200 && (
        <p className="mt-4 text-center text-[13px]" style={{ color: "#6B6A6A" }}>
          Showing first 200 of {results.length} — refine the search to see more.
        </p>
      )}
    </div>
  );
}
