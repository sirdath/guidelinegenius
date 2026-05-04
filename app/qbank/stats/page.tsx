"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ensureSeeded, getSessions, computeStats, type Stats } from "@/lib/qbankSession";
import { BarChart3, Target, Flame, TrendingUp, Award } from "lucide-react";

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    ensureSeeded();
    setStats(computeStats(getSessions()));
  }, []);

  if (!stats) {
    return <div className="p-10 text-ink-muted">Loading…</div>;
  }

  const sortedCats = Object.entries(stats.byCategory).sort(
    (a, b) => b[1].correct / b[1].attempted - a[1].correct / a[1].attempted,
  );
  const strongest = sortedCats[0];
  const weakest = sortedCats[sortedCats.length - 1];

  return (
    <div className="mx-auto max-w-[1080px] px-6 lg:px-10 py-10 space-y-8">
      <div>
        <div className="text-[12px] font-bold uppercase tracking-wider text-secondary inline-flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5" />
          Performance analytics
        </div>
        <h1 className="mt-2 text-[28px] sm:text-[34px] font-extrabold tracking-tight text-primary">
          Your <span className="text-secondary">stats</span>
        </h1>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Headline label="Accuracy" value={`${stats.accuracyPct}%`} icon={<Target className="h-4 w-4" />} />
        <Headline
          label="Streak"
          value={`${stats.streakDays}`}
          sub="days"
          icon={<Flame className="h-4 w-4" />}
        />
        <Headline
          label="Sessions"
          value={`${stats.sessionsCount}`}
          sub="completed"
          icon={<Award className="h-4 w-4" />}
        />
        <Headline
          label="Questions"
          value={`${stats.totalAttempted}`}
          sub="attempted"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Strongest / weakest */}
      {strongest && weakest && strongest[0] !== weakest[0] && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Highlight
            tone="good"
            label="Strongest area"
            specialty={strongest[0]}
            pct={Math.round((strongest[1].correct / strongest[1].attempted) * 100)}
            attempted={strongest[1].attempted}
          />
          <Highlight
            tone="warn"
            label="Needs revision"
            specialty={weakest[0]}
            pct={Math.round((weakest[1].correct / weakest[1].attempted) * 100)}
            attempted={weakest[1].attempted}
          />
        </div>
      )}

      {/* Per-category bars */}
      <section className="rounded-xl bg-white border border-line p-6">
        <h2 className="text-[16px] font-bold text-primary">Specialty mastery</h2>
        <p className="text-[13px] text-ink-muted">
          Accuracy across the specialties you have practised so far.
        </p>
        <div className="mt-5 space-y-3">
          {sortedCats.map(([cat, data]) => {
            const pct = Math.round((data.correct / data.attempted) * 100);
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-[13.5px] mb-1.5">
                  <span className="font-semibold text-ink-headline truncate pr-3">{cat}</span>
                  <span className="tabular-nums text-ink-muted">
                    {data.correct}/{data.attempted} ·{" "}
                    <strong style={{ color: pct >= 70 ? "#059669" : pct >= 50 ? "#5E35B1" : "#dc2626" }}>
                      {pct}%
                    </strong>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        pct >= 70 ? "#10b981" : pct >= 50 ? "#3BADFF" : "#f43f5e",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent score trend */}
      {stats.recentScores.length > 0 && (
        <section className="rounded-xl bg-white border border-line p-6">
          <h2 className="text-[16px] font-bold text-primary">Recent sessions</h2>
          <p className="text-[13px] text-ink-muted">
            Score on each of your last {stats.recentScores.length} session{stats.recentScores.length === 1 ? "" : "s"}.
          </p>
          <div className="mt-6 flex items-end gap-3 h-40">
            {stats.recentScores.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="text-[11px] font-bold tabular-nums" style={{ color: "#003366" }}>
                  {s.pct}%
                </div>
                <div className="w-full bg-slate-100 rounded-t-md relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all"
                    style={{
                      height: `${s.pct}%`,
                      backgroundColor: s.pct >= 70 ? "#10b981" : s.pct >= 50 ? "#3BADFF" : "#f43f5e",
                    }}
                  />
                </div>
                <div className="text-[10.5px] text-ink-muted whitespace-nowrap">
                  {new Date(s.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="text-center pt-2">
        <Link
          href="/qbank/start"
          className="inline-flex items-center gap-1.5 h-11 px-6 rounded-md text-white font-bold text-[14px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#5E35B1" }}
        >
          Practice more
        </Link>
      </div>
    </div>
  );
}

function Headline({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-line p-5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-secondary">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-[32px] font-extrabold leading-none tabular-nums text-ink-headline">
        {value}
      </div>
      {sub && <div className="mt-1 text-[12.5px] text-ink-muted">{sub}</div>}
    </div>
  );
}

function Highlight({
  tone,
  label,
  specialty,
  pct,
  attempted,
}: {
  tone: "good" | "warn";
  label: string;
  specialty: string;
  pct: number;
  attempted: number;
}) {
  const bg = tone === "good" ? "#ecfdf5" : "#fef2f2";
  const border = tone === "good" ? "#a7f3d0" : "#fecaca";
  const accent = tone === "good" ? "#059669" : "#dc2626";
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </div>
      <div className="mt-1 text-[20px] font-extrabold text-primary truncate">{specialty}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-[28px] font-extrabold tabular-nums" style={{ color: accent }}>
          {pct}%
        </span>
        <span className="text-[12.5px] text-ink-muted">over {attempted} questions</span>
      </div>
    </div>
  );
}
