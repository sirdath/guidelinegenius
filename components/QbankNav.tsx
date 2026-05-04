"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Play, Bookmark, History, BarChart3 } from "lucide-react";
import clsx from "clsx";

const TABS = [
  { href: "/qbank", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/qbank/start", label: "Practice", icon: Play },
  { href: "/qbank/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/qbank/history", label: "History", icon: History },
  { href: "/qbank/stats", label: "Stats", icon: BarChart3 },
];

// Hide nav on these routes (full-screen experiences)
const HIDDEN_PREFIXES = ["/qbank/session", "/qbank/results", "/qbank/pricing"];

export function QbankNav() {
  const pathname = usePathname() ?? "";
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="bg-white border-b border-line">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "inline-flex items-center gap-2 h-12 px-4 text-[13.5px] font-semibold border-b-2 transition-colors whitespace-nowrap",
                active
                  ? "text-primary border-primary"
                  : "text-ink-muted border-transparent hover:text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
