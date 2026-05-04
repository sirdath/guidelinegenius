"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
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
import clsx from "clsx";

type Status = "unanswered" | "answered" | "flagged";

type SessionState = {
  current: number;
  selected: Record<string, string>;
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

  const progressPct = Math.round((Object.keys(state.submitted).length / DEMO_QUESTIONS.length) * 100);

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
    try {
      localStorage.setItem(
        "gg_qbank_session",
        JSON.stringify({ ...state, finishedAt: Date.now() })
      );
    } catch {}
    router.push("/qbank/results");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200">
        <div
          className="h-full bg-secondary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-line shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 h-14 flex items-center justify-between gap-4">
          <Link
            href="/qbank"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-muted hover:text-primary transition-colors"
          >
            <X className="h-4 w-4" />
            End session
          </Link>
          
          <div className="text-[14px] font-semibold text-ink-headline">
            Question <span className="text-secondary">{state.current + 1}</span> of {DEMO_QUESTIONS.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideOptions((v) => !v)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold border border-line text-ink-body hover:bg-slate-50 transition-colors"
              title="Hide answer options to test recall"
            >
              {hideOptions ? <Eye className="h-3.5 w-3.5 text-secondary" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{hideOptions ? "Show options" : "Hide options"}</span>
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              className={clsx(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold border transition-colors",
                isFlagged
                  ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-line text-ink-body hover:bg-slate-50"
              )}
            >
              <Flag className={clsx("h-3.5 w-3.5", isFlagged && "fill-amber-500 text-amber-500")} />
              <span className="hidden sm:inline">{isFlagged ? "Flagged" : "Flag"}</span>
            </button>
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center h-8 px-4 rounded-full text-[12.5px] font-bold text-white bg-primary hover:bg-primary-700 transition-colors"
            >
              Finish
            </button>
          </div>
        </div>
        
        {/* Nav Strip */}
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 pb-3 flex flex-wrap gap-1.5">
          {DEMO_QUESTIONS.map((qq, i) => {
            const status: Status = state.flagged[qq.id] ? "flagged" : state.submitted[qq.id] ? "answered" : "unanswered";
            const isCurrent = i === state.current;
            return (
              <button
                key={qq.id}
                type="button"
                onClick={() => go(i)}
                title={`Question ${i + 1}`}
                className={clsx(
                  "h-7 w-7 rounded-sm text-[12px] font-bold inline-flex items-center justify-center transition-all",
                  isCurrent
                    ? "bg-primary text-white border-primary shadow-sm transform scale-105"
                    : status === "flagged"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : status === "answered"
                    ? "bg-accent-light text-primary border-secondary-200"
                    : "bg-white text-ink-muted border-line hover:border-secondary hover:text-primary"
                )}
                style={{ borderWidth: "1.5px" }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <div className={clsx("flex-1 mx-auto w-full max-w-[1480px] px-5 lg:px-8 py-6 grid gap-6", isSubmitted ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl")}>
        <section className="flex flex-col">
          {/* Question Block */}
          <div className="bg-white rounded-xl shadow-sm border border-line p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-secondary">
                {q.category}
              </span>
              <span className="text-line">•</span>
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
                {q.difficulty}
              </span>
            </div>
            
            {q.vignette && (
              <p className="text-[16px] leading-relaxed text-ink-body mb-5">
                {q.vignette}
              </p>
            )}
            <p className="text-[18px] sm:text-[20px] font-semibold leading-snug text-ink-headline">
              {q.stem}
            </p>
          </div>

          {/* Options */}
          {!hideOptions && (
            <div className="mt-5 space-y-3">
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
                    className={clsx(
                      "w-full text-left rounded-xl p-4 transition-all duration-200 relative overflow-hidden group",
                      !isSubmitted && "hover:border-secondary hover:bg-slate-50 hover:shadow-sm cursor-pointer",
                      isSubmitted && "cursor-default",
                      showCorrect
                        ? "bg-green-50 border-green-500 shadow-sm"
                        : showWrong
                        ? "bg-red-50 border-red-400"
                        : isSelected
                        ? "bg-accent-light border-secondary shadow-sm"
                        : "bg-white border-line"
                    )}
                    style={{ borderWidth: "2px" }}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={clsx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold transition-colors",
                          showCorrect
                            ? "bg-green-500 text-white"
                            : showWrong
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-secondary text-white"
                            : "bg-slate-100 text-ink-muted group-hover:bg-slate-200"
                        )}
                      >
                        {opt.id}
                      </span>
                      <span className={clsx("flex-1 text-[15px] sm:text-[16px] leading-relaxed pt-0.5", showCorrect || isSelected ? "text-ink-headline font-medium" : "text-ink-body")}>
                        {opt.text}
                      </span>
                      {showCorrect && <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500 animate-in zoom-in" />}
                      {showWrong && <XCircle className="h-6 w-6 shrink-0 text-red-500 animate-in zoom-in" />}
                    </div>
                    {isSubmitted && (
                      <div className="mt-3 ml-11">
                        <p className={clsx("text-[14px] leading-relaxed p-3 rounded-lg", showCorrect ? "bg-green-100/50 text-green-900" : showWrong ? "bg-red-100/50 text-red-900" : "bg-slate-50 text-ink-muted")}>
                          {opt.rationale}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-8 flex items-center justify-between gap-3 sticky bottom-4 z-10 bg-slate-50/90 backdrop-blur-sm p-2 rounded-2xl border border-line/50 shadow-sm">
            <button
              type="button"
              onClick={() => go(state.current - 1)}
              disabled={state.current === 0}
              className="inline-flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl font-bold text-[14px] text-ink-body hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all min-w-[110px]"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={submit}
                disabled={!selected}
                className="flex-1 max-w-[280px] inline-flex items-center justify-center h-12 px-7 rounded-xl text-white font-bold text-[16px] shadow-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 bg-cta"
              >
                Submit answer
              </button>
            ) : state.current < DEMO_QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => go(state.current + 1)}
                className="flex-1 max-w-[280px] inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-white font-bold text-[16px] shadow-sm transition-all hover:scale-[1.02] active:scale-95 bg-primary"
              >
                Next question
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="flex-1 max-w-[280px] inline-flex items-center justify-center h-12 px-7 rounded-xl text-white font-bold text-[16px] shadow-sm transition-all hover:scale-[1.02] active:scale-95 bg-green-600"
              >
                Finish session
              </button>
            )}

            <button
              type="button"
              onClick={() => go(state.current + 1)}
              disabled={state.current === DEMO_QUESTIONS.length - 1}
              className="inline-flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl font-bold text-[14px] text-ink-body hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all min-w-[110px]"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {isSubmitted && <ArticlePane slug={q.articleSlug} anchor={q.articleAnchor} />}
      </div>
    </div>
  );
}

function ArticlePane({ slug, anchor }: { slug: string; anchor?: string }) {
  const article = useMemo(() => getArticle(slug), [slug]);
  const scraped = useMemo(() => getScrapedArticle(slug), [slug]);
  const html = scraped?.bodyHtml ?? article?.contentHtml ?? "";

  const cleanedHtml = html.replace(/<button[^>]*class="panel-close"[\s\S]*?<\/button>/gi, "");

  return (
    <aside className="rounded-xl bg-white shadow-sm flex flex-col border border-line sticky top-20 overflow-hidden" style={{ maxHeight: "calc(100vh - 100px)" }}>
      <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-line bg-slate-50/50 shrink-0">
        <div className="min-w-0">
          <div className="text-[11.5px] font-bold uppercase tracking-wider text-secondary">
            Source guideline
          </div>
          <h3 className="mt-1 text-[16px] font-bold truncate text-primary">
            {article?.title ?? slug}
          </h3>
          {anchor && (
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Relevant section: <strong className="text-ink-body">{anchor}</strong>
            </p>
          )}
        </div>
        <a
          href={`/articles/${slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-semibold text-primary bg-white border border-line shadow-sm hover:bg-slate-50 transition-colors shrink-0"
          title="Open full article"
        >
          Read full
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="overflow-y-auto px-6 py-5 post-template-default scroll-smooth">
        <link rel="stylesheet" href="/css/aaa-acc.css" />
        <style>{`
          .qbank-article .accordion-content,
          .qbank-article .accordion-subcontent { display: block !important; }
          .qbank-article .accordion-header,
          .qbank-article .accordion-subheader { pointer-events: none; }
          .qbank-article .accordion-header::after { display: none !important; }
        `}</style>
        <div
          className="qbank-article gg-main-article-content text-[14.5px] leading-relaxed text-ink-body"
          dangerouslySetInnerHTML={{ __html: cleanedHtml }}
        />
      </div>
    </aside>
  );
}
