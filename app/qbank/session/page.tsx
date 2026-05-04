"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DEMO_QUESTIONS, type Question } from "@/lib/qbankData";
import { getScrapedArticle } from "@/lib/scrapedArticles";
import { getArticle } from "@/lib/articles";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

type Status = "unanswered" | "answered" | "flagged";

type SessionState = {
  current: number;
  selected: Record<string, string>; // questionId → optionId
  submitted: Record<string, boolean>;
  flagged: Record<string, boolean>;
  startedAt: number;
};

const initial: SessionState = {
  current: 0,
  selected: {},
  submitted: {},
  flagged: {},
  startedAt: Date.now(),
};

export default function SessionPage() {
  const router = useRouter();
  const [state, setState] = useState<SessionState>(initial);
  const [hideOptions, setHideOptions] = useState(false);
  const q: Question = DEMO_QUESTIONS[state.current];
  const isSubmitted = !!state.submitted[q.id];
  const selected = state.selected[q.id] || null;
  const isFlagged = !!state.flagged[q.id];

  function pick(id: string) {
    if (isSubmitted) return;
    setState((s) => ({ ...s, selected: { ...s.selected, [q.id]: id } }));
  }

  function submit() {
    if (!selected) return;
    setState((s) => ({ ...s, submitted: { ...s.submitted, [q.id]: true } }));
  }

  function toggleFlag() {
    setState((s) => ({
      ...s,
      flagged: { ...s.flagged, [q.id]: !s.flagged[q.id] },
    }));
  }

  function go(i: number) {
    if (i < 0 || i >= DEMO_QUESTIONS.length) return;
    setState((s) => ({ ...s, current: i }));
  }

  function finish() {
    // Persist to localStorage so the results page can read it
    try {
      localStorage.setItem(
        "gg_qbank_session",
        JSON.stringify({ ...state, finishedAt: Date.now() }),
      );
    } catch {}
    router.push("/qbank/results");
  }

  const correctOption = q.options.find((o) => o.correct);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F5F8FB" }}
    >
      {/* Top bar */}
      <header
        className="bg-white border-b"
        style={{ borderColor: "#cfd8e3" }}
      >
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 h-14 flex items-center justify-between gap-4">
          <Link
            href="/qbank"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
            style={{ color: "#003366" }}
          >
            <X className="h-4 w-4" />
            End session
          </Link>
          <div className="text-[13.5px]" style={{ color: "#1a1a1a" }}>
            <strong>{state.current + 1}</strong> / {DEMO_QUESTIONS.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideOptions((v) => !v)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-semibold hover:bg-[#f4f6fa]"
              style={{ border: "1px solid #cfd8e3", color: "#003366" }}
              title="Hide answer options to test recall"
            >
              {hideOptions ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {hideOptions ? "Show options" : "Hide options"}
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-semibold hover:bg-[#f4f6fa]"
              style={{
                border: "1px solid #cfd8e3",
                color: isFlagged ? "#b45309" : "#003366",
                backgroundColor: isFlagged ? "#fef3c7" : "transparent",
              }}
            >
              <Flag className="h-3.5 w-3.5" />
              {isFlagged ? "Flagged" : "Flag"}
            </button>
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center h-8 px-4 rounded-md text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#003366" }}
            >
              Finish
            </button>
          </div>
        </div>
        {/* Question nav strip */}
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 pb-3 flex flex-wrap gap-1.5">
          {DEMO_QUESTIONS.map((qq, i) => {
            const status: Status = state.flagged[qq.id]
              ? "flagged"
              : state.submitted[qq.id]
                ? "answered"
                : "unanswered";
            const isCurrent = i === state.current;
            return (
              <button
                key={qq.id}
                type="button"
                onClick={() => go(i)}
                title={`Question ${i + 1}`}
                className="h-7 w-7 rounded text-[11.5px] font-bold inline-flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: isCurrent
                    ? "#003366"
                    : status === "flagged"
                      ? "#fef3c7"
                      : status === "answered"
                        ? "#E3F2FD"
                        : "#ffffff",
                  color: isCurrent
                    ? "#ffffff"
                    : status === "flagged"
                      ? "#b45309"
                      : "#003366",
                  border: `1px solid ${isCurrent ? "#003366" : "#cfd8e3"}`,
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main content — split pane after submission, single pane before */}
      <div
        className={`flex-1 mx-auto w-full max-w-[1480px] px-5 lg:px-8 py-6 grid gap-6 ${
          isSubmitted ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl"
        }`}
      >
        {/* Left: question + answer + explanation */}
        <section className="flex flex-col">
          {/* Vignette / stem */}
          <div
            className="rounded-md bg-white p-6"
            style={{ border: "1px solid #cfd8e3" }}
          >
            <div
              className="text-[11.5px] font-bold uppercase tracking-wider"
              style={{ color: "#3BADFF" }}
            >
              {q.category} · {q.difficulty}
            </div>
            {q.vignette && (
              <p
                className="mt-3 text-[15px] leading-relaxed"
                style={{ color: "#1a1a1a" }}
              >
                {q.vignette}
              </p>
            )}
            <p
              className="mt-4 text-[16px] font-semibold leading-snug"
              style={{ color: "#003366" }}
            >
              {q.stem}
            </p>
          </div>

          {/* Options */}
          {!hideOptions && (
            <div className="mt-4 space-y-2.5">
              {q.options.map((opt) => {
                const isSelected = selected === opt.id;
                const showCorrect = isSubmitted && opt.correct;
                const showWrong = isSubmitted && isSelected && !opt.correct;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pick(opt.id)}
                    disabled={isSubmitted}
                    className="w-full text-left rounded-md p-4 transition-colors"
                    style={{
                      backgroundColor: showCorrect
                        ? "#dcfce7"
                        : showWrong
                          ? "#fee2e2"
                          : isSelected
                            ? "#E3F2FD"
                            : "#ffffff",
                      border: `1.5px solid ${
                        showCorrect
                          ? "#16a34a"
                          : showWrong
                            ? "#dc2626"
                            : isSelected
                              ? "#3BADFF"
                              : "#cfd8e3"
                      }`,
                      cursor: isSubmitted ? "default" : "pointer",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold"
                        style={{
                          backgroundColor: showCorrect
                            ? "#16a34a"
                            : showWrong
                              ? "#dc2626"
                              : isSelected
                                ? "#3BADFF"
                                : "#f4f6fa",
                          color: showCorrect || showWrong || isSelected ? "#fff" : "#003366",
                        }}
                      >
                        {opt.id}
                      </span>
                      <span className="flex-1 text-[14.5px]" style={{ color: "#1a1a1a" }}>
                        {opt.text}
                      </span>
                      {showCorrect && (
                        <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#16a34a" }} />
                      )}
                      {showWrong && (
                        <XCircle className="h-5 w-5 shrink-0" style={{ color: "#dc2626" }} />
                      )}
                    </div>
                    {isSubmitted && (
                      <p
                        className="mt-3 ml-9 text-[13.5px] leading-relaxed"
                        style={{ color: "#5A6B7E" }}
                      >
                        {opt.rationale}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action bar */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(state.current - 1)}
              disabled={state.current === 0}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md font-semibold text-[13.5px] disabled:opacity-40"
              style={{ border: "1px solid #cfd8e3", color: "#003366" }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={submit}
                disabled={!selected}
                className="inline-flex items-center h-11 px-7 rounded-md text-white font-bold text-[15px] transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#5E35B1" }}
              >
                Submit answer
              </button>
            ) : state.current < DEMO_QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => go(state.current + 1)}
                className="inline-flex items-center gap-1.5 h-11 px-7 rounded-md text-white font-bold text-[15px] transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#003366" }}
              >
                Next question
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="inline-flex items-center h-11 px-7 rounded-md text-white font-bold text-[15px] transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#16a34a" }}
              >
                Finish session
              </button>
            )}

            <button
              type="button"
              onClick={() => go(state.current + 1)}
              disabled={state.current === DEMO_QUESTIONS.length - 1}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md font-semibold text-[13.5px] disabled:opacity-40"
              style={{ border: "1px solid #cfd8e3", color: "#003366" }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Right pane: linked article (Amboss-style) — only after submit */}
        {isSubmitted && <ArticlePane slug={q.articleSlug} anchor={q.articleAnchor} />}
      </div>
    </div>
  );
}

function ArticlePane({ slug, anchor }: { slug: string; anchor?: string }) {
  const article = useMemo(() => getArticle(slug), [slug]);
  const scraped = useMemo(() => getScrapedArticle(slug), [slug]);
  const html = scraped?.bodyHtml ?? article?.contentHtml ?? "";

  // Strip the panel-close buttons (Elementor "Collapse" SVGs) — they
  // make no sense out of context in a sidebar render.
  const cleanedHtml = html.replace(/<button[^>]*class="panel-close"[\s\S]*?<\/button>/gi, "");

  return (
    <aside
      className="rounded-md bg-white flex flex-col"
      style={{ border: "1px solid #cfd8e3", maxHeight: "calc(100vh - 180px)" }}
    >
      <div
        className="flex items-start justify-between gap-3 px-5 py-3 border-b shrink-0"
        style={{ borderColor: "#cfd8e3" }}
      >
        <div className="min-w-0">
          <div className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: "#3BADFF" }}>
            Source guideline
          </div>
          <h3 className="mt-0.5 text-[15px] font-bold truncate" style={{ color: "#003366" }}>
            {article?.title ?? slug}
          </h3>
          {anchor && (
            <p className="text-[12px]" style={{ color: "#6B6A6A" }}>
              Most relevant section: <strong>{anchor}</strong>
            </p>
          )}
        </div>
        <a
          href={`/articles/${slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-[12px] font-semibold hover:bg-[#f4f6fa] shrink-0"
          style={{ border: "1px solid #cfd8e3", color: "#003366" }}
          title="Open full article"
        >
          Full
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Render the live-scraped accordion HTML, with auto-open all sections
          for inline reading. The aaa-acc.css matches accordion styles. */}
      <div className="overflow-y-auto px-5 py-4 post-template-default">
        <link rel="stylesheet" href="/css/aaa-acc.css" />
        <style>{`
          .qbank-article .accordion-content,
          .qbank-article .accordion-subcontent { display: block !important; }
          .qbank-article .accordion-header,
          .qbank-article .accordion-subheader { pointer-events: none; }
          .qbank-article .accordion-header::after { display: none !important; }
        `}</style>
        <div
          className="qbank-article gg-main-article-content"
          dangerouslySetInnerHTML={{ __html: cleanedHtml }}
        />
      </div>
    </aside>
  );
}
