"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_QUESTIONS } from "@/lib/qbankData";
import {
  CheckCircle2,
  XCircle,
  Flag,
  Clock,
  RotateCcw,
  Home,
  ArrowRight,
  Trophy,
  Target,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

type SessionData = {
  current: number;
  selected: Record<string, string>;
  submitted: Record<string, boolean>;
  flagged: Record<string, boolean>;
  startedAt: number;
  finishedAt?: number;
};

export default function ResultsPage() {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gg_qbank_session");
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center max-w-sm">
          <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ink-headline mb-2">No Results Found</h2>
          <p className="text-[16px] text-ink-body mb-6">You haven't completed a session yet.</p>
          <Link
            href="/qbank"
            className="inline-flex items-center justify-center h-12 w-full rounded-xl text-white font-bold bg-cta hover:bg-cta-600 transition-all shadow-sm"
          >
            Start a session
          </Link>
        </div>
      </div>
    );
  }

  // Score
  const submitted = DEMO_QUESTIONS.filter((q) => session.submitted[q.id]);
  const correct = submitted.filter((q) => {
    const sel = session.selected[q.id];
    const opt = q.options.find((o) => o.id === sel);
    return opt?.correct;
  });
  const score = submitted.length > 0 ? Math.round((correct.length / submitted.length) * 100) : 0;
  const totalSeconds = session.finishedAt
    ? Math.round((session.finishedAt - session.startedAt) / 1000)
    : 0;
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="mx-auto max-w-[1000px] w-full px-5 lg:px-8 py-10 lg:py-16">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 text-primary mb-4">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-[34px] sm:text-[44px] font-extrabold tracking-tight text-ink-headline">
            Session <span className="text-secondary">Complete</span>
          </h1>
          <p className="mt-3 text-[16px] text-ink-body">
            Great job! Here's how you performed in this session.
          </p>
        </div>

        {/* Gamified Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Overall Score"
            value={`${score}%`}
            sub={`${correct.length} out of ${submitted.length} correct`}
            colorClass={score >= 80 ? "text-green-600" : score >= 60 ? "text-cta" : "text-red-600"}
            bgClass={score >= 80 ? "bg-green-50" : score >= 60 ? "bg-cta-50" : "bg-red-50"}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            label="Questions Answered"
            value={`${submitted.length}/${DEMO_QUESTIONS.length}`}
            sub={`${DEMO_QUESTIONS.length - submitted.length} questions skipped`}
            colorClass="text-primary"
            bgClass="bg-primary-50"
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            label="Time Spent"
            value={min > 0 ? `${min}m ${sec}s` : `${sec}s`}
            sub={
              submitted.length > 0
                ? `~${Math.round(totalSeconds / Math.max(1, submitted.length))}s per question`
                : "—"
            }
            colorClass="text-primary"
            bgClass="bg-primary-50"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Review List */}
        <div className="mt-14">
          <h2 className="text-[22px] font-bold text-ink-headline mb-6 flex items-center gap-2">
            Per-question review
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
            <ul className="divide-y divide-line">
              {DEMO_QUESTIONS.map((q, i) => {
                const sel = session.selected[q.id];
                const subbed = session.submitted[q.id];
                const flagged = session.flagged[q.id];
                const opt = q.options.find((o) => o.id === sel);
                const isCorrect = opt?.correct;
                
                return (
                  <li
                    key={q.id}
                    className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className={clsx(
                        "h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg text-[14px] font-bold mt-0.5",
                        !subbed
                          ? "bg-slate-100 text-ink-muted"
                          : isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {i + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-[11.5px] font-bold uppercase tracking-wider text-secondary">
                          {q.category}
                        </span>
                        {flagged && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            <Flag className="h-3 w-3 fill-amber-500 text-amber-500" />
                            Flagged
                          </span>
                        )}
                        {!subbed && (
                          <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-ink-muted">
                            Skipped
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[15px] sm:text-[16px] font-semibold leading-snug text-ink-headline mb-3">
                        {q.stem}
                      </p>
                      
                      {subbed && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-line">
                          <p className="text-[14px] text-ink-body mb-2">
                            <span className="text-ink-muted mr-1">Your answer:</span>
                            <strong className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {sel}. {opt?.text}
                            </strong>
                          </p>
                          {!isCorrect && (
                            <p className="text-[14px] text-ink-body">
                              <span className="text-ink-muted mr-1">Correct answer:</span>
                              <strong className="text-green-600">
                                {q.options.find((o) => o.correct)?.id}.{" "}
                                {q.options.find((o) => o.correct)?.text}
                              </strong>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-end gap-3">
                      {subbed && (
                        isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )
                      )}
                      <a
                        href={`/articles/${q.articleSlug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:text-secondary transition-colors"
                      >
                        Article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/qbank/session"
            onClick={() => {
              try { localStorage.removeItem("gg_qbank_session"); } catch {}
            }}
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl text-white font-bold text-[16px] bg-cta hover:bg-cta-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Try again
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-bold text-[16px] text-primary bg-white border-2 border-primary hover:bg-primary-50 transition-all w-full sm:w-auto"
          >
            Browse articles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl font-semibold text-[15px] text-ink-body hover:text-primary transition-colors w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  colorClass,
  bgClass,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  colorClass: string;
  bgClass: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-line shadow-sm flex flex-col items-center justify-center text-center">
      <div className={clsx("inline-flex items-center justify-center h-10 w-10 rounded-full mb-3", bgClass, colorClass)}>
        {icon}
      </div>
      <div className="text-[12px] font-bold uppercase tracking-wider text-ink-muted mb-1">
        {label}
      </div>
      <div className={clsx("text-[38px] font-extrabold leading-none mb-2", colorClass)}>
        {value}
      </div>
      <div className="text-[13px] text-ink-body">
        {sub}
      </div>
    </div>
  );
}
