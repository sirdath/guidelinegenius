import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[16px]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {it.href && !last ? (
                <Link
                  href={it.href}
                  className="font-medium hover:underline transition-colors"
                  style={{ color: "#3BADFF" }}
                >
                  {it.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: last ? "#1a1a1a" : "#3BADFF",
                    fontWeight: last ? 600 : 500,
                  }}
                >
                  {it.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  className="h-[18px] w-[18px] shrink-0"
                  style={{ color: "#9ab" }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
