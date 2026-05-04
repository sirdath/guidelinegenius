"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_QUESTIONS } from "@/lib/qbankData";
import { listCustomQuestions } from "@/lib/customQuestions";
import { ensureSeeded, getBookmarks, getNote, toggleBookmark } from "@/lib/qbankSession";
import { Bookmark, BookmarkX, MessageSquare, ChevronRight, Play } from "lucide-react";

export default function BookmarksPage() {
  const [marks, setMarks] = useState<Record<string, true>>({});
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    ensureSeeded();
    setMarks(getBookmarks());
  }, [refresh]);

  const all = [...listCustomQuestions(), ...DEMO_QUESTIONS];
  const bookmarked = all.filter((q) => marks[q.id]);

  return (
    <div className="mx-auto max-w-[1080px] px-6 lg:px-10 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-wider text-secondary inline-flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            Bookmarked questions
          </div>
          <h1 className="mt-2 text-[28px] sm:text-[34px] font-extrabold tracking-tight text-primary">
            Your <span className="text-secondary">bookmarks</span>
          </h1>
          <p className="mt-1 text-[14px] text-ink-body">
            {bookmarked.length} question{bookmarked.length === 1 ? "" : "s"} saved for later review.
          </p>
        </div>
        {bookmarked.length > 0 && (
          <Link
            href="/qbank/session?status=flagged"
            className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-md text-white font-bold text-[14px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1" }}
          >
            <Play className="h-4 w-4" />
            Review all in a session
          </Link>
        )}
      </div>

      {bookmarked.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-12 text-center">
          <Bookmark className="h-8 w-8 text-ink-muted mx-auto" />
          <p className="mt-3 text-[14.5px] font-semibold text-ink-headline">
            No bookmarks yet
          </p>
          <p className="mt-1 text-[13.5px] text-ink-muted max-w-md mx-auto">
            Click the bookmark icon during a session to save questions you want to revisit.
            Bookmarks live in your browser only — no account required.
          </p>
          <Link
            href="/qbank/start"
            className="mt-5 inline-flex h-11 items-center px-5 rounded-md text-white font-bold text-[13.5px]"
            style={{ backgroundColor: "#5E35B1" }}
          >
            Start a session
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {bookmarked.map((q) => {
            const note = getNote(q.id);
            const correct = q.options.find((o) => o.correct);
            return (
              <li
                key={q.id}
                className="rounded-xl bg-white border border-line p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-secondary">
                        {q.category}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-muted capitalize">
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-headline">
                      {q.stem}
                    </p>
                    <p className="mt-1 text-[12.5px] text-ink-muted">
                      Correct: <strong className="text-emerald-700">{correct?.id}.</strong>{" "}
                      {correct?.text}
                    </p>
                    {note && (
                      <div
                        className="mt-3 rounded-md p-3 text-[13px] flex items-start gap-2"
                        style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7" }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
                        <span className="text-amber-900">{note}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleBookmark(q.id);
                        setRefresh((r) => r + 1);
                      }}
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-[12.5px] font-semibold hover:bg-rose-50 border border-line text-rose-600"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/articles/${q.articleSlug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[12.5px] font-semibold hover:bg-slate-50 border border-line text-primary"
                    >
                      Article
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
