"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Play,
  Bookmark,
  History,
  BarChart3,
  ArrowLeft,
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

// Hide the QBank header on these full-screen experiences
const HIDDEN_PREFIXES = ["/qbank/session", "/qbank/results"];

export function QbankHeader() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { ready, isUnlocked, plan, trialDaysLeft, startTrial } = useSubscription();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <header
      style={{ backgroundColor: "#003366" }}
      className="text-white sticky top-0 z-30 shadow-md"
    >
      {/* Top row: branded back link + logo + sub badge + auth */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1480px] w-full pl-3 pr-6 lg:pl-5 lg:pr-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[12.5px] font-semibold text-white/85 hover:bg-white/10 transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <span className="hidden sm:block h-5 w-px bg-white/20 shrink-0" />
            <Link
              href="/qbank"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Question Bank — Overview"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/20">
                <Image
                  src="/brand/logo-trimmed.png"
                  alt=""
                  width={278}
                  height={148}
                  className="h-5 w-auto"
                />
              </span>
              <span className="hidden sm:flex items-baseline gap-1.5">
                <span className="text-[14.5px] font-extrabold tracking-tight">Guideline Genius</span>
                <span
                  className="text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "#5E35B1", color: "#fff" }}
                >
                  QBank
                </span>
              </span>
            </Link>
          </div>

          {ready && (
            <div className="flex items-center gap-3 shrink-0">
              {isUnlocked ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[12px] font-bold text-emerald-200 border border-emerald-400/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {PLAN_INFO[plan as keyof typeof PLAN_INFO]?.label ?? "Active"}
                  {trialDaysLeft !== null && (
                    <span className="font-medium">
                      · {trialDaysLeft}d left
                    </span>
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
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#5E35B1" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Free trial
                  </button>
                  <Link
                    href="/qbank/pricing"
                    className="hidden sm:inline-flex items-center h-8 px-3 rounded-md text-[12.5px] font-semibold border border-white/30 text-white hover:bg-white/10"
                  >
                    Plans
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: tabs */}
      <div>
        <div className="mx-auto max-w-[1480px] w-full pl-3 pr-6 lg:pl-5 lg:pr-10 flex items-center gap-1 overflow-x-auto">
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
                    ? "text-white border-white"
                    : "text-white/70 border-transparent hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
          <div className="flex-1 hidden lg:block" />
          <Link
            href="/qbank/pricing"
            className={clsx(
              "hidden lg:inline-flex items-center h-12 px-4 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap",
              pathname.startsWith("/qbank/pricing")
                ? "text-white border-white"
                : "text-white/60 border-transparent hover:text-white",
            )}
          >
            Plans &amp; pricing
          </Link>
        </div>
      </div>
    </header>
  );
}
