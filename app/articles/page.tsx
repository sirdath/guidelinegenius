"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { allArticles, allCategories } from "@/lib/articles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleSearch } from "@/components/ArticleSearch";
import { PageTopBand } from "@/components/PageTopBand";
import { ArrowRight } from "lucide-react";

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20 text-center text-ink-muted">
          Loading…
        </div>
      }
    >
      <ArticlesPageInner />
    </Suspense>
  );
}

function ArticlesPageInner() {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const cat = sp.get("cat") ?? "";

  const results = useMemo(() => {
    let arr = allArticles;
    if (cat) arr = arr.filter((a) => a.categories.some((c) => c.slug === cat));
    if (q)
      arr = arr.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categories.some((c) => c.name.toLowerCase().includes(q)),
      );
    return arr;
  }, [q, cat]);

  const activeCat = allCategories.find((c) => c.slug === cat);

  return (
    <div>
      <PageTopBand />

      <div className="bg-white border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <aside className="lg:sticky lg:top-[180px] lg:self-start space-y-6">
          <ArticleSearch initial={q} />

          <div className="rounded-md border border-line bg-white p-5">
            <h2
              className="text-[13px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#3BADFF" }}
            >
              Specialty
            </h2>
            <ul className="mt-4 space-y-1 text-[14px]">
              <li>
                <Link
                  href={`/articles${q ? `?q=${encodeURIComponent(q)}` : ""}`}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
                    !cat ? "font-bold" : "hover:bg-accent-light/60"
                  }`}
                  style={{ color: "#1a1a1a", backgroundColor: !cat ? "#E3F2FD" : "transparent" }}
                >
                  <span>All</span>
                  <span className="text-[12px]" style={{ color: "#6B6A6A" }}>
                    {allArticles.length}
                  </span>
                </Link>
              </li>
              {allCategories.map((c) => {
                const params = new URLSearchParams();
                if (q) params.set("q", q);
                params.set("cat", c.slug);
                const active = cat === c.slug;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/articles?${params.toString()}`}
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
                        active ? "font-bold" : "hover:bg-accent-light/60"
                      }`}
                      style={{
                        color: "#1a1a1a",
                        backgroundColor: active ? "#E3F2FD" : "transparent",
                      }}
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      <span className="ml-auto text-[12px]" style={{ color: "#6B6A6A" }}>
                        {c.articleCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main>
          <p className="mb-5 text-[14px]" style={{ color: "#1a1a1a" }}>
            {results.length} {results.length === 1 ? "result" : "results"}
            {activeCat && (
              <>
                {" "}in <strong>{activeCat.name}</strong>
              </>
            )}
            {q && (
              <>
                {" "}for <strong>"{q}"</strong>
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div
              className="rounded-md border border-dashed p-12 text-center"
              style={{ borderColor: "#cfd8e3", color: "#6B6A6A" }}
            >
              No articles match your filters. Try a broader search.
            </div>
          ) : (
            <ul
              className="divide-y border rounded-md bg-white overflow-hidden"
              style={{ borderColor: "#ebebeb" }}
            >
              {results.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#f4f6fa]"
                  >
                    <div className="min-w-0 flex-1">
                      {a.categories[0] && (
                        <div
                          className="text-[10.5px] font-bold uppercase tracking-wider"
                          style={{ color: "#3BADFF" }}
                        >
                          {a.categories[0].name}
                        </div>
                      )}
                      <div
                        className="mt-1 text-[16.5px] font-semibold"
                        style={{ color: "#003366" }}
                      >
                        {a.title}
                      </div>
                      {a.excerpt && (
                        <div
                          className="mt-1 line-clamp-1 text-[13.5px]"
                          style={{ color: "#5A6B7E" }}
                        >
                          {a.excerpt}
                        </div>
                      )}
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "#3BADFF" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
