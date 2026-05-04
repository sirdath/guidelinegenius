"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  listCustomQuestions,
  deleteCustomQuestion,
  type CustomQuestion,
} from "@/lib/customQuestions";
import { DEMO_QUESTIONS } from "@/lib/qbankData";
import { Plus, FileText, Trash2, Pencil, ChevronRight } from "lucide-react";

export default function AdminQbankPage() {
  const [custom, setCustom] = useState<CustomQuestion[]>([]);

  useEffect(() => {
    setCustom(listCustomQuestions());
  }, []);

  function refresh() {
    setCustom(listCustomQuestions());
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    deleteCustomQuestion(id);
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-primary">
            Question bank
          </h1>
          <p className="mt-1 text-[14px] text-ink-body">
            {custom.length} custom · {DEMO_QUESTIONS.length} built-in demo
          </p>
        </div>
        <Link
          href="/admin/qbank/new"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md text-white font-bold text-[13.5px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#5E35B1" }}
        >
          <Plus className="h-4 w-4" />
          New question
        </Link>
      </div>

      {/* Custom questions */}
      <h2 className="text-[16px] font-bold text-primary">Custom questions</h2>
      {custom.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <FileText className="h-8 w-8 text-ink-muted mx-auto" />
          <p className="mt-3 text-[14px] text-ink-body">
            No custom questions yet. Authoring questions stores them in your
            browser; the production version syncs them to the cloud.
          </p>
          <Link
            href="/admin/qbank/new"
            className="mt-5 inline-flex items-center gap-1.5 h-10 px-5 rounded-md text-white font-bold text-[13.5px]"
            style={{ backgroundColor: "#5E35B1" }}
          >
            <Plus className="h-4 w-4" />
            Create the first one
          </Link>
        </div>
      ) : (
        <ul
          className="mt-3 divide-y rounded-xl bg-white overflow-hidden border border-line"
        >
          {custom.map((q) => {
            const correct = q.options.find((o) => o.correct);
            return (
              <li key={q.id} className="px-4 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-secondary">
                      {q.category}
                    </span>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-muted">
                      {q.difficulty}
                    </span>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Custom
                    </span>
                  </div>
                  <p className="mt-1 text-[14.5px] font-semibold leading-snug text-ink-headline truncate">
                    {q.stem}
                  </p>
                  <p className="mt-1 text-[12.5px] text-ink-muted truncate">
                    Correct: <strong className="text-emerald-700">{correct?.id}.</strong>{" "}
                    {correct?.text} · Article: /{q.articleSlug}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/qbank/new?id=${q.id}`}
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-[12.5px] font-semibold hover:bg-slate-50 border border-line text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-[12.5px] font-semibold hover:bg-rose-50 border border-line text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Built-in demo */}
      <h2 className="mt-10 text-[16px] font-bold text-primary">
        Built-in demo questions
      </h2>
      <p className="mt-1 text-[12.5px] text-ink-muted">
        Read-only sample questions that ship with the site.
      </p>
      <ul className="mt-3 divide-y rounded-xl bg-white overflow-hidden border border-line">
        {DEMO_QUESTIONS.map((q) => {
          const correct = q.options.find((o) => o.correct);
          return (
            <li key={q.id} className="px-4 py-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-secondary">
                  {q.category}
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-muted">
                  {q.difficulty}
                </span>
              </div>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-ink-headline truncate">
                {q.stem}
              </p>
              <p className="mt-0.5 text-[12px] text-ink-muted truncate">
                Correct: {correct?.id}. {correct?.text}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
