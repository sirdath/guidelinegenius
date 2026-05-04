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
} from "lucide-react";

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center" style={{ color: "#1a1a1a" }}>
          <p className="text-[16px]">No session results found.</p>
          <Link
            href="/qbank"
            className="mt-4 inline-flex items-center h-11 px-6 rounded-md text-white font-bold"
            style={{ backgroundColor: "#5E35B1" }}
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
    <div style={{ backgroundColor: "#F5F8FB" }} className="min-h-[80vh]">
      <div className="mx-auto max-w-[960px] w-full px-5 lg:px-8 py-10 lg:py-14">
        <h1
          className="text-center text-[34px] sm:text-[42px] font-extrabold tracking-tight"
          style={{ color: "#003366" }}
        >
          Session{" "}
          <span style={{ color: "#3BADFF" }}>complete</span>
        </h1>

        <div
          className="mt-8 rounded-md bg-white p-7 grid grid-cols-1 sm:grid-cols-3 gap-5"
          style={{ border: "1px solid #cfd8e3" }}
        >
          <Stat
            label="Score"
            value={`${score}%`}
            sub={`${correct.length} / ${submitted.length} correct`}
            color={score >= 80 ? "#16a34a" : score >= 60 ? "#5E35B1" : "#dc2626"}
          />
          <Stat
            label="Answered"
            value={`${submitted.length}/${DEMO_QUESTIONS.length}`}
            sub={`${DEMO_QUESTIONS.length - submitted.length} skipped`}
            color="#003366"
          />
          <Stat
            label="Time"
            value={min > 0 ? `${min}m ${sec}s` : `${sec}s`}
            sub={
              submitted.length > 0
                ? `~${Math.round(totalSeconds / Math.max(1, submitted.length))}s per question`
                : "—"
            }
            color="#003366"
            icon={<Clock className="h-4 w-4" />}
          />
        </div>

        <h2
          className="mt-10 text-[20px] font-bold"
          style={{ color: "#003366" }}
        >
          Per-question review
        </h2>
        <ul
          className="mt-4 divide-y rounded-md bg-white overflow-hidden"
          style={{ border: "1px solid #cfd8e3" }}
        >
          {DEMO_QUESTIONS.map((q, i) => {
            const sel = session.selected[q.id];
            const subbed = session.submitted[q.id];
            const flagged = session.flagged[q.id];
            const opt = q.options.find((o) => o.id === sel);
            const isCorrect = opt?.correct;
            return (
              <li
                key={q.id}
                className="px-5 py-4 flex items-start gap-4"
                style={{ borderColor: "#eef0f4" }}
              >
                <span
                  className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md text-[12px] font-bold"
                  style={{
                    backgroundColor: !subbed
                      ? "#f4f6fa"
                      : isCorrect
                        ? "#dcfce7"
                        : "#fee2e2",
                    color: !subbed ? "#6B6A6A" : isCorrect ? "#16a34a" : "#dc2626",
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[11.5px] font-bold uppercase tracking-wider"
                      style={{ color: "#3BADFF" }}
                    >
                      {q.category}
                    </span>
                    {flagged && (
                      <span
                        className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#fef3c7", color: "#854d0e" }}
                      >
                        <Flag className="h-2.5 w-2.5" />
                        Flagged
                      </span>
                    )}
                    {!subbed && (
                      <span
                        className="text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#f4f6fa", color: "#6B6A6A" }}
                      >
                        Skipped
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1 text-[14.5px] font-semibold leading-snug"
                    style={{ color: "#1a1a1a" }}
                  >
                    {q.stem}
                  </p>
                  {subbed && (
                    <p className="mt-1.5 text-[13px]" style={{ color: "#5A6B7E" }}>
                      Your answer: <strong style={{ color: isCorrect ? "#16a34a" : "#dc2626" }}>
                        {sel}. {opt?.text}
                      </strong>
                      {!isCorrect && (
                        <>
                          {" · "}Correct: <strong style={{ color: "#16a34a" }}>
                            {q.options.find((o) => o.correct)?.id}.{" "}
                            {q.options.find((o) => o.correct)?.text}
                          </strong>
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {subbed && (
                    isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: "#16a34a" }} />
                    ) : (
                      <XCircle className="h-5 w-5" style={{ color: "#dc2626" }} />
                    )
                  )}
                  <a
                    href={`/articles/${q.articleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold hover:underline"
                    style={{ color: "#003366" }}
                  >
                    Article
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/qbank/session"
            onClick={() => {
              try { localStorage.removeItem("gg_qbank_session"); } catch {}
            }}
            className="inline-flex items-center gap-1.5 h-12 px-6 rounded-md text-white font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1" }}
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 h-12 px-6 rounded-md font-bold"
            style={{ border: "1.5px solid #003366", color: "#003366" }}
          >
            Browse articles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-12 px-6 rounded-md font-semibold"
            style={{ color: "#003366" }}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider"
        style={{ color: "#6B6A6A" }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-[34px] font-extrabold leading-none" style={{ color }}>
        {value}
      </div>
      <div className="mt-1 text-[12.5px]" style={{ color: "#5A6B7E" }}>
        {sub}
      </div>
    </div>
  );
}
