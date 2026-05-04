import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  const primary = article.categories[0];
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-ui-sm border border-line bg-white p-6 transition-all hover:border-secondary hover:shadow-[0_8px_30px_-12px_rgba(0,51,102,0.12)]"
    >
      {primary && (
        <div className="mb-3 inline-block text-[11px] font-bold uppercase tracking-wider text-secondary-600">
          {primary.name}
        </div>
      )}
      <h3 className="text-[18px] font-bold leading-snug text-ink-headline group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-body">
        {article.excerpt}
      </p>
      <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary-600 group-hover:text-secondary-700">
        View Here
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
