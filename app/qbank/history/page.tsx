"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_QUESTIONS } from "@/lib/qbankData";
import { ensureSeeded, getSessions, type CompletedSession } from "@/lib/qbankSession";
import { History as HistoryIcon, ChevronRight, Trophy, Clock, Play } from "lucide-react";
import clsx from "clsx";

function modeLabel(m: CompletedSession["mode"]) {
  return m === "practice" ? "Practice" : m === "timed" ? "Timed" : "Mock";
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);

  useEffect(() => {
    ensureSeeded();
    setSessions(getSessions());
  }, []);

  return (
    <div className="mx-auto max-w-[1080px] px-6 lg:px-10 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-wider text-secondary inline-flex items-center gap-1.5">
            <HistoryIcon className="h-3.5 w-3.5" />
            Activity
          </div>
          <h1 className="mt-2 text-[28px] sm:text-[34px] font-extrabold tracking-tight text-primary">
            Session <span className="text-secondary">history</span>
          </h1>
          <p className="mt-1 text-[14px] text-ink-body">
            {sessions.length} completed session{sessions.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/qbank/start"
          className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-md text-white font-bold text-[14px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#5E35B1" }}
        >
          <Play className="h-4 w-4" />
          Start a new session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-12 text-center">
          <HistoryIcon className="h-8 w-8 text-ink-muted mx-auto" />
          <p className="mt-3 text-[14px] text-ink-body">
            No sessions yet. Once you complete a session it appears here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {sessions.map((s) => {
            const attempted = s.questionIds.filter((qid) => s.selected[qid]).length;
            const correct = s.questionIds.filter((qid) => {
              const sel = s.selected[qid];
              const q = DEMO_QUESTIONS.find((x) => x.id === qid);
              return q?.options.find((o) => o.id === sel)?.correct;
            }).length;
            const pct = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
            const min = Math.round((s.finishedAt - s.startedAt) / 60_000);
            const flagCount = Object.values(s.flagged).filter(Boolean).length;
            return (
              <li
                key={s.id}
                className="rounded-xl bg-white border border-line p-5 hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div
                  className={clsx(
                    "h-12 w-12 shrink-0 rounded-xl inline-flex items-center justify-center font-extrabold tabular-nums text-[15px]",
                    pct >= 70 ? "bg-emerald-100 text-emerald-700" : pct >= 50 ? "bg-cta-50 text-cta" : "bg-rose-100 text-rose-700",
                  )}
                  style={
                    pct >= 70
                      ? {}
                      : pct >= 50
                        ? { backgroundColor: "#5E35B11A", color: "#5E35B1" }
                        : {}
                  }
                >
                  {pct}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[12px] font-semibold">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-[10.5px] uppercase tracking-wider"
                      style={{
                        backgroundColor:
                          s.mode === "mock" ? "#003366" : s.mode === "timed" ? "#5E35B1" : "#3BADFF",
                      }}
                    >
                      {modeLabel(s.mode)}
                    </span>
                    <span className="text-[11.5px] font-bold uppercase tracking-wider text-secondary">
                      {s.pack ?? "Mixed"}
                    </span>
                    <span className="text-ink-muted">·</span>
                    <span className="text-ink-muted">{relativeTime(s.finishedAt)}</span>
                  </div>
                  <p className="mt-2 text-[14.5px] font-semibold leading-snug text-ink-headline">
                    {correct} correct · {attempted - correct} wrong
                    {s.questionIds.length - attempted > 0 && (
                      <> · {s.questionIds.length - attempted} skipped</>
                    )}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[12.5px] text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {s.questionIds.length} q
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {min} min
                    </span>
                    {flagCount > 0 && <span>{flagCount} flagged</span>}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted mt-2" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
