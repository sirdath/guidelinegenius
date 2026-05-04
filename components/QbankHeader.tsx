"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Play,
  Bookmark,
  History,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useSubscription, PLAN_INFO } from "@/lib/subscription";

const TABS = [
  { href: "/qbank", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/qbank/start", label: "Practice", icon: Play },
  { href: "/qbank/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/qbank/history", label: "History", icon: History },
  { href: "/qbank/stats", label: "Stats", icon: BarChart3 },
];

// Hide QBank sub-nav on full-screen experiences (the actual session player +
// final results screen take over the viewport themselves).
const HIDDEN_PREFIXES = ["/qbank/session", "/qbank/results"];

// Sub-navigation strip that sits below the main SiteHeader inside the
// /qbank section. Blue background to brand the section while keeping the
// regular site chrome visible above so the page still feels like the rest
// of guidelinegenius.com.
export function QbankHeader() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { ready, isUnlocked, plan, trialDaysLeft, startTrial } = useSubscription();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div style={{ backgroundColor: "#003366" }} className="text-white">
      <div className="mx-auto max-w-[1480px] w-full pl-3 pr-4 lg:pl-5 lg:pr-10 flex items-center gap-1 overflow-x-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 pr-3 mr-2 border-r border-white/15 shrink-0">
          <span className="text-[12.5px] font-extrabold uppercase tracking-wider whitespace-nowrap">
            Question Bank
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
            style={{ backgroundColor: "#5E35B1", color: "#fff" }}
          >
            UKMLA
          </span>
        </div>

        {/* Tabs */}
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "inline-flex items-center gap-1.5 h-11 px-3.5 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap",
                active
                  ? "text-white border-white"
                  : "text-white/70 border-transparent hover:text-white",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </Link>
          );
        })}

        <div className="flex-1" />

        {/* Subscription status / CTA on the right */}
        {ready && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11.5px] font-bold text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                {PLAN_INFO[plan as keyof typeof PLAN_INFO]?.label ?? "Active"}
                {trialDaysLeft !== null && (
                  <span className="font-medium">· {trialDaysLeft}d left</span>
                )}
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    startTrial();
                    router.refresh();
                  }}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-[11.5px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#5E35B1" }}
                >
                  <Sparkles className="h-3 w-3" />
                  Free trial
                </button>
                <Link
                  href="/qbank/pricing"
                  className={clsx(
                    "inline-flex items-center h-7 px-3 rounded-md text-[11.5px] font-semibold border border-white/30 transition-colors",
                    pathname.startsWith("/qbank/pricing")
                      ? "bg-white/15 text-white"
                      : "text-white/85 hover:bg-white/10",
                  )}
                >
                  Plans
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
