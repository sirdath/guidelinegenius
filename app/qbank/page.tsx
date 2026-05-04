"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  Flame,
  Target,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { DEMO_QUESTIONS, type Question } from "@/lib/qbankData";
import { listCustomQuestions } from "@/lib/customQuestions";
import { allCategories, type Category } from "@/lib/articles";
import { useSubscription, PLAN_INFO } from "@/lib/subscription";
import {
  ensureSeeded,
  getSessions,
  computeStats,
  type Stats,
} from "@/lib/qbankSession";

export default function QbankHomePage() {
  const { ready, isUnlocked, plan, trialDaysLeft, startTrial } = useSubscription();
  const [stats, setStats] = useState<Stats | null>(null);
  const [questions, setQuestions] = useState<Question[]>([...DEMO_QUESTIONS]);

  useEffect(() => {
    ensureSeeded();
    setQuestions([...listCustomQuestions(), ...DEMO_QUESTIONS]);
    setStats(computeStats(getSessions()));
  }, []);

  const packs = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questions) map.set(q.category, (map.get(q.category) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([name, count]) => {
        const cat = allCategories.find((c) => c.name === name);
        return {
          name,
          count,
          slug: cat?.slug ?? name.toLowerCase().replace(/\s+/g, "-"),
          category: cat,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [questions]);

  const dailyGoal = 10;
  const todayCount = useMemo(() => {
    if (!stats) return 0;
    const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return getSessions().filter(
      (s) => Math.floor(s.finishedAt / (24 * 60 * 60 * 1000)) === today,
    ).reduce((acc, s) => acc + s.questionIds.filter((qid) => s.selected[qid]).length, 0);
  }, [stats]);

  return (
    <div>
      {/* Hero band */}
      <section className="bg-gradient-to-b from-accent-light to-slate-50 border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
                UKMLA Practice
              </div>
              <h1 className="mt-2 text-[34px] sm:text-[42px] font-extrabold leading-[1.05] tracking-tight text-primary">
                Question <span className="text-secondary">Bank</span>
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-body max-w-xl">
                Pick a study mode, target weak topics, and review questions
                alongside the source guideline.
              </p>
            </div>
            <SubscriptionStatus
              ready={ready}
              isUnlocked={isUnlocked}
              plan={plan}
              trialDaysLeft={trialDaysLeft}
              onStartTrial={startTrial}
            />
          </div>
        </div>
      </section>

      {/* Stats hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Target className="h-4 w-4" />}
              label="Accuracy"
              value={stats ? `${stats.accuracyPct}%` : "—"}
              sub={
                stats && stats.totalAttempted > 0
                  ? `${stats.totalCorrect}/${stats.totalAttempted} correct`
                  : "Start a session"
              }
              tone={
                stats && stats.accuracyPct >= 70
                  ? "good"
                  : stats && stats.accuracyPct >= 50
                    ? "warn"
                    : "neutral"
              }
            />
            <StatCard
              icon={<Flame className="h-4 w-4" />}
              label="Streak"
              value={stats ? `${stats.streakDays}` : "—"}
              sub={stats && stats.streakDays > 0 ? `day${stats.streakDays === 1 ? "" : "s"}` : "Build a streak"}
              tone={stats && stats.streakDays >= 3 ? "good" : "neutral"}
            />
            <StatCard
              icon={<Award className="h-4 w-4" />}
              label="Sessions"
              value={stats ? `${stats.sessionsCount}` : "—"}
              sub="completed"
              tone="neutral"
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              label="Today"
              value={`${todayCount}/${dailyGoal}`}
              sub="daily goal"
              tone={todayCount >= dailyGoal ? "good" : "neutral"}
              progress={Math.min(100, (todayCount / dailyGoal) * 100)}
            />
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-[18px] font-bold text-primary">Quick start</h2>
            <Link
              href="/qbank/start"
              className="text-[13px] font-semibold text-secondary hover:underline"
            >
              All filters →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ModeCard
              title="Practice"
              body="Untimed. Review explanations after every answer."
              cta="Start practice"
              href="/qbank/start?mode=practice"
              disabled={!isUnlocked}
              tone="primary"
            />
            <ModeCard
              title="Timed"
              body="90 sec per question. Build exam pace and recall."
              cta="Start timed"
              href="/qbank/start?mode=timed"
              disabled={!isUnlocked}
              tone="cta"
            />
            <ModeCard
              title="Mock exam"
              body="Full UKMLA-style sitting. Results revealed at the end."
              cta="Start mock"
              href="/qbank/start?mode=mock"
              disabled={!isUnlocked}
              tone="dark"
            />
          </div>
        </div>
      </section>

      {/* Mastery */}
      {stats && Object.keys(stats.byCategory).length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-8">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-primary">Topic mastery</h2>
                <p className="text-[13px] text-ink-muted">
                  Accuracy across the specialties you have already attempted.
                </p>
              </div>
              <Link
                href="/qbank/stats"
                className="text-[13px] font-semibold text-secondary hover:underline"
              >
                Detailed stats →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(stats.byCategory)
                .sort((a, b) => b[1].attempted - a[1].attempted)
                .map(([cat, data]) => {
                  const pct = Math.round((data.correct / data.attempted) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-[13px] mb-1.5">
                        <span className="font-semibold text-ink-headline truncate pr-3">{cat}</span>
                        <span className="tabular-nums text-ink-muted">
                          {data.correct}/{data.attempted} · <strong style={{ color: pct >= 70 ? "#059669" : pct >= 50 ? "#5E35B1" : "#dc2626" }}>{pct}%</strong>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct >= 70 ? "#10b981" : pct >= 50 ? "#3BADFF" : "#f43f5e",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* Mixed pack */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-8">
          <MixedPackCard total={questions.length} disabled={!isUnlocked} />
        </div>
      </section>

      {/* Specialty packs */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pb-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-[20px] font-bold text-primary">Study packs</h2>
              <p className="text-[13px] text-ink-muted">By specialty.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packs.map((p) => (
              <PackCard
                key={p.slug}
                name={p.name}
                slug={p.slug}
                count={p.count}
                category={p.category}
                disabled={!isUnlocked}
                accuracy={
                  stats?.byCategory[p.name]
                    ? Math.round(
                        (stats.byCategory[p.name].correct / stats.byCategory[p.name].attempted) *
                          100,
                      )
                    : null
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SubscriptionStatus({
  ready,
  isUnlocked,
  plan,
  trialDaysLeft,
  onStartTrial,
}: {
  ready: boolean;
  isUnlocked: boolean;
  plan: string;
  trialDaysLeft: number | null;
  onStartTrial: () => void;
}) {
  if (!ready) return <div className="h-12" aria-hidden />;
  if (isUnlocked) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-[13px] font-bold text-emerald-800">
        <ShieldCheck className="h-4 w-4" />
        {PLAN_INFO[plan as keyof typeof PLAN_INFO]?.label ?? "Active"}
        {trialDaysLeft !== null && (
          <span className="font-medium">
            · {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onStartTrial}
        className="inline-flex items-center gap-2 h-11 px-5 rounded-md text-white font-bold text-[14px] transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#5E35B1" }}
      >
        <Sparkles className="h-4 w-4" />
        Start free trial
      </button>
      <Link
        href="/qbank/pricing"
        className="inline-flex items-center gap-1.5 h-11 px-5 rounded-md font-semibold text-[14px] hover:bg-white border-2 border-primary text-primary transition-colors"
      >
        See plans
      </Link>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "good" | "warn" | "neutral";
  progress?: number;
}) {
  const accent =
    tone === "good" ? "#10b981" : tone === "warn" ? "#f59e0b" : "#3BADFF";
  return (
    <div className="rounded-xl bg-white border border-line p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-[28px] font-extrabold leading-none text-ink-headline tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-[12.5px] text-ink-muted">{sub}</div>
      {typeof progress === "number" && (
        <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: accent }}
          />
        </div>
      )}
    </div>
  );
}

function ModeCard({
  title,
  body,
  cta,
  href,
  disabled,
  tone,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
  disabled: boolean;
  tone: "primary" | "cta" | "dark";
}) {
  const bg = tone === "cta" ? "#5E35B1" : tone === "dark" ? "#003366" : "#0a4d8a";
  return (
    <div className="rounded-xl bg-white border border-line p-5 flex flex-col">
      <h3 className="text-[16px] font-bold text-primary">{title}</h3>
      <p className="mt-1 text-[13.5px] text-ink-body flex-1">{body}</p>
      {disabled ? (
        <Link
          href="/qbank/pricing"
          className="mt-4 inline-flex items-center justify-center gap-1.5 h-10 rounded-md text-[13.5px] font-bold text-ink-muted bg-slate-100 hover:bg-slate-200"
        >
          <Lock className="h-3.5 w-3.5" />
          Unlock to start
        </Link>
      ) : (
        <Link
          href={href}
          className="mt-4 inline-flex items-center justify-center gap-1.5 h-10 rounded-md text-white font-bold text-[13.5px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: bg }}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function MixedPackCard({ total, disabled }: { total: number; disabled: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 shadow-sm">
      <div
        className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "#E3F2FD", color: "#003366" }}
      >
        <Layers className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[18px] font-bold text-primary">Full bank</h3>
          <span className="text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-light text-primary">
            All specialties
          </span>
        </div>
        <p className="mt-1 text-[13.5px] text-ink-body">
          Mixed practice from every specialty — {total} question{total === 1 ? "" : "s"} loaded.
        </p>
      </div>
      <PackStartButton href="/qbank/session" disabled={disabled} primary />
    </div>
  );
}

function PackCard({
  name,
  slug,
  count,
  category,
  disabled,
  accuracy,
}: {
  name: string;
  slug: string;
  count: number;
  category: Category | undefined;
  disabled: boolean;
  accuracy: number | null;
}) {
  return (
    <div className="group rounded-xl bg-white border border-line shadow-sm overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9]" style={{ backgroundColor: "#FAF1EA" }}>
        {category?.image && (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {accuracy !== null && (
          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-bold tabular-nums shadow-sm">
            <TrendingUp
              className="h-3 w-3"
              style={{ color: accuracy >= 70 ? "#10b981" : accuracy >= 50 ? "#3BADFF" : "#f43f5e" }}
            />
            <span style={{ color: accuracy >= 70 ? "#059669" : accuracy >= 50 ? "#003366" : "#b91c1c" }}>
              {accuracy}%
            </span>
          </div>
        )}
      </div>
      <div className="px-5 py-5 flex-1 flex flex-col">
        <h3 className="text-[16px] font-bold text-primary leading-tight">{name}</h3>
        <p className="mt-1 text-[13px] text-ink-body">
          {count} question{count === 1 ? "" : "s"}
        </p>
        <div className="flex-1" />
        <div className="mt-4">
          <PackStartButton href={`/qbank/start?pack=${slug}`} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}

function PackStartButton({
  href,
  disabled,
  primary,
}: {
  href: string;
  disabled: boolean;
  primary?: boolean;
}) {
  if (disabled) {
    return (
      <Link
        href="/qbank/pricing"
        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-md text-[13.5px] font-bold text-ink-muted bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto"
      >
        <Lock className="h-3.5 w-3.5" />
        Unlock to start
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md text-white font-bold text-[13.5px] transition-opacity hover:opacity-90 w-full sm:w-auto"
      style={{ backgroundColor: primary ? "#5E35B1" : "#003366" }}
    >
      Configure pack
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
