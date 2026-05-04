"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type RecentCard = {
  slug: string;
  title: string;
  sources: string[];
};

export function RecentlyUpdatedGrid({ cards }: { cards: RecentCard[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? cards : cards.slice(0, 4);
  const hasMore = cards.length > 4;

  return (
    <>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 items-start">
        {visible.map((c) => (
          <ArticleSourceCard
            key={c.slug}
            title={c.title}
            href={`/articles/${c.slug}`}
            sources={c.sources}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((s) => !s)}
            className="inline-flex h-11 items-center gap-1.5 px-7 rounded-md text-[14.5px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1" }}
          >
            {expanded ? (
              <>
                See less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                See all
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

function ArticleSourceCard({
  title,
  href,
  sources,
}: {
  title: string;
  href: string;
  sources: string[];
}) {
  return (
    <article
      className="rounded-2xl bg-white px-8 py-9 flex flex-col"
      style={{
        boxShadow:
          "0 24px 48px -16px rgba(0, 51, 102, 0.28), 0 8px 16px -4px rgba(0, 51, 102, 0.14), 0 2px 4px rgba(0, 0, 0, 0.06)",
      }}
    >
      <h3
        className="text-[24px] font-semibold text-center leading-[1.2]"
        style={{ color: "#003366" }}
      >
        {title}
      </h3>
      <div
        className="mt-6 space-y-4 text-[14.5px] leading-[1.55] text-center"
        style={{ color: "#1a1a1a" }}
      >
        {sources.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
      <Link
        href={href}
        className="group/btn relative mt-7 flex h-[52px] items-center justify-center rounded-md overflow-hidden hover-button transition-colors duration-300"
      >
        <span className="block text-white text-[15px] font-bold tracking-wide transition-transform duration-300 ease-out group-hover/btn:-translate-y-[200%]">
          View Here
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-white text-[15px] font-bold tracking-wide translate-y-[200%] transition-transform duration-300 ease-out group-hover/btn:translate-y-0">
          View Here
        </span>
      </Link>
    </article>
  );
}
