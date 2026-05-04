"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_QUESTIONS, type Question } from "@/lib/qbankData";
import { listCustomQuestions } from "@/lib/customQuestions";
import { getScrapedArticle } from "@/lib/scrapedArticles";
import { getArticle, allCategories } from "@/lib/articles";
import { useSubscription } from "@/lib/subscription";
import {
  ensureSeeded,
  isBookmarked,
  toggleBookmark,
  getNote,
  setNote,
  addSession,
  getBookmarks,
} from "@/lib/qbankSession";
import {
  Flag,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  Clock,
  StickyNote,
} from "lucide-react";
import clsx from "clsx";

type Status = "unanswered" | "answered" | "flagged";
type Mode = "practice" | "timed" | "mock";

type SessionState = {
  current: number;
  selected: Record<string, string>;
  submitted: Record<string, boolean>;
  flagged: Record<string, boolean>;
  startedAt: number;
};

const TIMED_PER_Q = 90; // seconds per question in timed mode

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-ink-muted">Loading session…</div>}>
      <SessionInner />
    </Suspense>
  );
}

function SessionInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { ready, isUnlocked } = useSubscription();
  const mode = (sp.get("mode") as Mode) || "practice";
  const packSlug = sp.get("pack") || null;
  const requestedCount = parseInt(sp.get("count") || "0", 10);
  const difficultyFilter = sp.get("difficulty") || "all";
  const statusFilter = sp.get("status") || "all";

  const questions = useMemo(() => {
    let pool: Question[] = [...listCustomQuestions(), ...DEMO_QUESTIONS];
    if (packSlug) {
      const cat = allCategories.find((c) => c.slug === packSlug);
      const targetName = cat?.name ?? packSlug;
      pool = pool.filter((q) => q.category === targetName);
    }
    if (difficultyFilter !== "all") {
      pool = pool.filter((q) => q.difficulty === difficultyFilter);
    }
    if (statusFilter === "flagged") {
      const marks = getBookmarks();
      pool = pool.filter((q) => marks[q.id]);
    }
    if (requestedCount > 0 && pool.length > requestedCount) {
      // Shuffle then slice
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      pool = shuffled.slice(0, requestedCount);
    }
    return pool;
  }, [packSlug, requestedCount, difficultyFilter, statusFilter]);

  const [state, setState] = useState<SessionState>(() => ({
    current: 0,
    selected: {},
    submitted: {},
    flagged: {},
    startedAt: Date.now(),
  }));
  const [hideOptions, setHideOptions] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    mode === "timed" ? TIMED_PER_Q : null,
  );

  // Paywall redirect
  useEffect(() => {
    if (ready && !isUnlocked) router.replace("/qbank/pricing");
    if (typeof window !== "undefined") ensureSeeded();
  }, [ready, isUnlocked, router]);

  // Bookmarks/notes when current question changes
  const q = questions[state.current];
  useEffect(() => {
    if (!q) return;
    setBookmarked(isBookmarked(q.id));
    setNoteText(getNote(q.id));
    if (mode === "timed") setSecondsLeft(TIMED_PER_Q);
    setNoteOpen(false);
  }, [q?.id, mode]);

  // Timed mode: tick down
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSubmittedNow = q ? !!state.submitted[q.id] : false;
  useEffect(() => {
    if (mode !== "timed" || isSubmittedNow) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, q?.id, isSubmittedNow]);

  // Auto-submit on timeout in timed mode
  useEffect(() => {
    if (mode === "timed" && secondsLeft === 0 && q && !state.submitted[q.id]) {
      setState((s) => ({ ...s, submitted: { ...s.submitted, [q.id]: true } }));
    }
  }, [secondsLeft, mode, q, state.submitted]);

  if (!ready) return <div className="p-10 text-ink-muted">Loading…</div>;
  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-5">
        <Lock className="h-10 w-10 text-ink-muted" />
        <p className="text-[15px] text-ink-body">Redirecting to plans…</p>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-5">
        <p className="text-[16px] text-ink-body">No questions match your filters.</p>
        <Link
          href="/qbank/start"
          className="inline-flex h-10 items-center px-5 rounded-md text-white font-bold"
          style={{ backgroundColor: "#003366" }}
        >
          Adjust filters
        </Link>
      </div>
    );
  }

  if (!q) return null;
  const isMock = mode === "mock";
  const isSubmitted = !!state.submitted[q.id];
  // In mock mode we hide the per-question feedback regardless
  const showFeedback = isSubmitted && !isMock;
  const selected = state.selected[q.id] || null;
  const isFlagged = !!state.flagged[q.id];
  const progressPct = Math.round(
    (Object.keys(state.submitted).length / questions.length) * 100,
  );

  function pick(id: string) {
    if (isSubmitted) return;
    setState((s) => ({ ...s, selected: { ...s.selected, [q.id]: id } }));
  }
  function submit() {
    if (!selected) return;
    setState((s) => ({ ...s, submitted: { ...s.submitted, [q.id]: true } }));
  }
  function toggleFlag() {
    setState((s) => ({ ...s, flagged: { ...s.flagged, [q.id]: !s.flagged[q.id] } }));
  }
  function go(i: number) {
    if (i < 0 || i >= questions.length) return;
    setState((s) => ({ ...s, current: i }));
  }
  function handleBookmark() {
    const newVal = toggleBookmark(q.id);
    setBookmarked(newVal);
  }
  function handleSaveNote() {
    setNote(q.id, noteText);
  }
  function finish() {
    // Persist completed session for /qbank/results + history
    const completed = {
      id: `s-${Date.now()}`,
      startedAt: state.startedAt,
      finishedAt: Date.now(),
      mode,
      pack: packSlug
        ? allCategories.find((c) => c.slug === packSlug)?.name ?? "Mixed"
        : "Mixed",
      questionIds: questions.map((qq) => qq.id),
      selected: state.selected,
      flagged: state.flagged,
    };
    try {
      localStorage.setItem("gg_qbank_session", JSON.stringify({ ...state, finishedAt: completed.finishedAt }));
    } catch {}
    addSession(completed);
    router.push("/qbank/results");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-200">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%`, backgroundColor: "#3BADFF" }}
        />
      </div>

      {/* Sticky toolbar */}
      <header className="bg-white border-b border-line shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/qbank"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-muted hover:text-primary transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">End session</span>
            </Link>
            <span
              className="px-2 py-0.5 rounded text-white text-[10.5px] uppercase tracking-wider font-bold shrink-0"
              style={{
                backgroundColor:
                  mode === "mock" ? "#003366" : mode === "timed" ? "#5E35B1" : "#3BADFF",
              }}
            >
              {mode}
            </span>
            <div className="text-[13.5px] font-semibold text-ink-headline truncate hidden md:block">
              Question <span className="text-secondary">{state.current + 1}</span> of {questions.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === "timed" && (
              <div
                className={clsx(
                  "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-bold tabular-nums",
                  secondsLeft !== null && secondsLeft <= 10
                    ? "bg-rose-100 text-rose-700"
                    : "bg-primary-50 text-primary",
                )}
                style={
                  secondsLeft !== null && secondsLeft > 10
                    ? { backgroundColor: "#E3F2FD", color: "#003366" }
                    : {}
                }
              >
                <Clock className="h-3.5 w-3.5" />
                {secondsLeft !== null
                  ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, "0")}`
                  : "--:--"}
              </div>
            )}
            <button
              type="button"
              onClick={() => setHideOptions((v) => !v)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold border border-line text-ink-body hover:bg-slate-50"
              title="Hide answer options to test recall"
            >
              {hideOptions ? <Eye className="h-3.5 w-3.5 text-secondary" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{hideOptions ? "Show" : "Hide"}</span>
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={clsx(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold border transition-colors",
                bookmarked
                  ? "border-secondary-300 bg-accent-light text-primary"
                  : "border-line text-ink-body hover:bg-slate-50",
              )}
              title="Bookmark this question"
            >
              <Bookmark className={clsx("h-3.5 w-3.5", bookmarked && "fill-secondary text-secondary")} />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              className={clsx(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-semibold border transition-colors",
                isFlagged
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-line text-ink-body hover:bg-slate-50",
              )}
            >
              <Flag className={clsx("h-3.5 w-3.5", isFlagged && "fill-amber-500 text-amber-500")} />
              <span className="hidden sm:inline">{isFlagged ? "Flagged" : "Flag"}</span>
            </button>
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center h-8 px-4 rounded-full text-[12.5px] font-bold text-white bg-primary hover:bg-primary-700"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Question nav strip */}
        <div className="mx-auto max-w-[1480px] w-full px-5 lg:px-8 pb-3 flex flex-wrap gap-1.5">
          {questions.map((qq, i) => {
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
                className={clsx(
                  "h-7 w-7 rounded-sm text-[12px] font-bold inline-flex items-center justify-center transition-all",
                  isCurrent
                    ? "bg-primary text-white border-primary scale-105"
                    : status === "flagged"
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : status === "answered"
                        ? "bg-accent-light text-primary border-secondary-200"
                        : "bg-white text-ink-muted border-line hover:border-secondary hover:text-primary",
                )}
                style={{ borderWidth: "1.5px" }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <div
        className={clsx(
          "flex-1 mx-auto w-full px-5 lg:px-8 py-8 grid gap-6 transition-all",
          showFeedback ? "max-w-[1480px] lg:grid-cols-2" : "max-w-[760px] grid-cols-1",
        )}
      >
        <section className="flex flex-col">
          {/* Question */}
          <div className="bg-white rounded-xl shadow-sm border border-line p-6 lg:p-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                {q.category}
              </span>
              <span className="text-line">·</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted capitalize">
                {q.difficulty}
              </span>
            </div>
            {q.vignette && (
              <p className="text-[15.5px] leading-relaxed text-ink-body mb-4">{q.vignette}</p>
            )}
            <p className="text-[17px] sm:text-[18px] font-semibold leading-snug text-ink-headline">
              {q.stem}
            </p>
          </div>

          {/* Options */}
          {!hideOptions && (
            <div className="mt-5 space-y-2.5">
              {q.options.map((opt) => {
                const isSelected = selected === opt.id;
                const showCorrect = showFeedback && opt.correct;
                const showWrong = showFeedback && isSelected && !opt.correct;
                const justSubmittedNoFeedback = isSubmitted && isMock && isSelected;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pick(opt.id)}
                    disabled={isSubmitted}
                    className={clsx(
                      "w-full text-left rounded-xl p-4 transition-all",
                      isSubmitted ? "cursor-default" : "cursor-pointer hover:shadow-sm",
                      showCorrect
                        ? "bg-emerald-50 border-2 border-emerald-500"
                        : showWrong
                          ? "bg-rose-50 border-2 border-rose-500"
                          : isSelected || justSubmittedNoFeedback
                            ? "bg-accent-light border-2 border-secondary"
                            : "bg-white border-2 border-line hover:border-secondary",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={clsx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[13px] font-bold",
                          showCorrect
                            ? "bg-emerald-500 text-white"
                            : showWrong
                              ? "bg-rose-500 text-white"
                              : isSelected
                                ? "bg-secondary text-white"
                                : "bg-slate-100 text-primary",
                        )}
                      >
                        {opt.id}
                      </span>
                      <span className="flex-1 text-[14.5px] text-ink-body leading-relaxed">{opt.text}</span>
                      {showCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
                      {showWrong && <XCircle className="h-5 w-5 shrink-0 text-rose-600" />}
                    </div>
                    {showFeedback && (
                      <p className="mt-3 ml-10 text-[13.5px] leading-relaxed text-ink-muted">
                        {opt.rationale}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Notes panel */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:underline"
            >
              <StickyNote className="h-3.5 w-3.5" />
              {noteOpen ? "Hide note" : noteText ? "Edit note" : "Add a note"}
            </button>
            {noteOpen && (
              <div className="mt-2 rounded-xl bg-white border border-line p-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="Personal note for this question — visible only to you."
                  className="w-full px-3 py-2 rounded-md border border-line bg-white text-[13.5px] focus:outline-none"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="inline-flex items-center h-8 px-4 rounded-md text-white text-[12.5px] font-bold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#5E35B1" }}
                  >
                    Save note
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(state.current - 1)}
              disabled={state.current === 0}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md font-semibold text-[13.5px] disabled:opacity-40 border border-line text-primary hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={submit}
                disabled={!selected}
                className="inline-flex items-center h-11 px-7 rounded-md text-white font-bold text-[14.5px] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#5E35B1" }}
              >
                {isMock ? "Confirm answer" : "Submit answer"}
              </button>
            ) : state.current < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => go(state.current + 1)}
                className="inline-flex items-center gap-1.5 h-11 px-7 rounded-md text-white font-bold text-[14.5px] transition-opacity hover:opacity-90 bg-primary"
              >
                Next question
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="inline-flex items-center h-11 px-7 rounded-md text-white font-bold text-[14.5px] transition-opacity hover:opacity-90 bg-emerald-600"
              >
                Finish session
              </button>
            )}

            <button
              type="button"
              onClick={() => go(state.current + 1)}
              disabled={state.current === questions.length - 1}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md font-semibold text-[13.5px] disabled:opacity-40 border border-line text-primary hover:bg-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {showFeedback && <ArticlePane slug={q.articleSlug} anchor={q.articleAnchor} />}
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
    <aside
      className="rounded-xl bg-white border border-line shadow-sm flex flex-col"
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
      <div className="flex items-start justify-between gap-3 px-5 py-3 border-b border-line shrink-0">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Source guideline
          </div>
          <h3 className="mt-0.5 text-[15px] font-bold text-primary truncate">
            {article?.title ?? slug}
          </h3>
          {anchor && (
            <p className="text-[12px] text-ink-muted">
              Most relevant section: <strong>{anchor}</strong>
            </p>
          )}
        </div>
        <a
          href={`/articles/${slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-[12px] font-semibold hover:bg-slate-50 shrink-0 border border-line text-primary"
          title="Open full article"
        >
          Full
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

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
