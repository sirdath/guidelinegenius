import Link from "next/link";
import { allArticles } from "@/lib/articles";
import { Clock } from "lucide-react";

export function RecentArticlesSidebar({ excludeSlug }: { excludeSlug?: string }) {
  const recent = allArticles.filter((a) => a.slug !== excludeSlug).slice(0, 8);
  return (
    <aside className="rounded-ui-sm border border-line bg-white p-6">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-600">
        Recent
      </h3>
      <ul className="mt-4 space-y-3.5">
        {recent.map((a) => (
          <li key={a.id} className="border-b border-line pb-3.5 last:border-0 last:pb-0">
            <Link
              href={`/articles/${a.slug}`}
              className="group block"
            >
              <div className="text-[14.5px] font-semibold leading-snug text-ink-headline group-hover:text-secondary-600">
                {a.title}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-muted">
                <Clock className="h-3 w-3" />
                {a.readingMinutes} min read
                {a.categories[0] && (
                  <>
                    <span className="mx-1">·</span>
                    <span>{a.categories[0].name}</span>
                  </>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
