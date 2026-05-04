"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, X as CloseIcon } from "lucide-react";
import { allArticles, type Article } from "@/lib/articles";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo<Article[]>(() => {
    const t = q.trim().toLowerCase();
    if (!t) return allArticles.slice(0, 8);
    return allArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(t) ||
          a.excerpt.toLowerCase().includes(t) ||
          a.categories.some((c) => c.name.toLowerCase().includes(t)),
      )
      .slice(0, 12);
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-4 sm:p-8">
      <div
        className="w-full max-w-3xl rounded-md bg-white shadow-2xl overflow-hidden"
        style={{ marginTop: "5vh", maxHeight: "85vh" }}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 border-b border-line px-6 py-4">
          <SearchIcon className="h-5 w-5 shrink-0" style={{ color: "#9ab" }} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles…"
            className="flex-1 bg-transparent text-[16px] focus:outline-none"
            style={{ color: "#1a1a1a" }}
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent-light"
            style={{ color: "#9ab" }}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: "65vh" }}>
          {!q && (
            <div
              className="px-6 pt-4 pb-2 text-[12.5px] font-bold uppercase tracking-wider"
              style={{ color: "#6B6A6A" }}
            >
              Recent
            </div>
          )}
          {results.length === 0 ? (
            <div className="p-10 text-center" style={{ color: "#6B6A6A" }}>
              No articles match "{q}".
            </div>
          ) : (
            <ul>
              {results.map((a) => (
                <li key={a.id} className="border-b last:border-0" style={{ borderColor: "#eef0f4" }}>
                  <Link
                    href={`/articles/${a.slug}`}
                    onClick={onClose}
                    className="block px-6 py-4 transition-colors hover:bg-[#f4f6fa]"
                  >
                    <div
                      className="text-[17px] font-bold leading-tight"
                      style={{ color: "#003366" }}
                    >
                      {a.title}
                    </div>
                    {a.excerpt && (
                      <div
                        className="mt-1.5 text-[13.5px] leading-[1.5] line-clamp-2"
                        style={{ color: "#5A6B7E" }}
                      >
                        {a.title} {a.excerpt}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
