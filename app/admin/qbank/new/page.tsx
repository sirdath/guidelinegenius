"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { allArticles, allCategories } from "@/lib/articles";
import {
  saveCustomQuestion,
  getCustomQuestion,
  type CustomQuestion,
} from "@/lib/customQuestions";
import type { AnswerOption, Question } from "@/lib/qbankData";
import { ChevronLeft, Save, Search as SearchIcon, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

const OPTION_IDS = ["A", "B", "C", "D", "E"] as const;
const DIFFICULTIES: Question["difficulty"][] = ["easy", "medium", "hard"];

export default function AdminQuestionEditorPage() {
  return (
    <Suspense fallback={<div className="text-ink-muted">Loading editor…</div>}>
      <Inner />
    </Suspense>
  );
}

type FormState = {
  category: string;
  difficulty: Question["difficulty"];
  vignette: string;
  stem: string;
  options: { id: string; text: string; correct: boolean; rationale: string }[];
  articleSlug: string;
  articleAnchor: string;
};

const blank: FormState = {
  category: "",
  difficulty: "medium",
  vignette: "",
  stem: "",
  options: OPTION_IDS.map((id, i) => ({
    id,
    text: "",
    correct: i === 0,
    rationale: "",
  })),
  articleSlug: "",
  articleAnchor: "",
};

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const editId = sp.get("id");
  const [form, setForm] = useState<FormState>(blank);
  const [saved, setSaved] = useState(false);
  const [articleQuery, setArticleQuery] = useState("");
  const [articleListOpen, setArticleListOpen] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const existing = getCustomQuestion(editId);
    if (existing) {
      setForm({
        category: existing.category,
        difficulty: existing.difficulty,
        vignette: existing.vignette ?? "",
        stem: existing.stem,
        options: OPTION_IDS.map((id) => {
          const o = existing.options.find((x) => x.id === id);
          return {
            id,
            text: o?.text ?? "",
            correct: o?.correct ?? false,
            rationale: o?.rationale ?? "",
          };
        }),
        articleSlug: existing.articleSlug,
        articleAnchor: existing.articleAnchor ?? "",
      });
    }
  }, [editId]);

  const articleResults = useMemo(() => {
    const q = articleQuery.trim().toLowerCase();
    if (!q) return allArticles.slice(0, 8);
    return allArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [articleQuery]);

  const selectedArticle = useMemo(
    () => allArticles.find((a) => a.slug === form.articleSlug),
    [form.articleSlug],
  );

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function updateOption(idx: number, patch: Partial<FormState["options"][number]>) {
    setForm((f) => ({
      ...f,
      options: f.options.map((o, i) => (i === idx ? { ...o, ...patch } : o)),
    }));
    setSaved(false);
  }

  function setCorrect(idx: number) {
    setForm((f) => ({
      ...f,
      options: f.options.map((o, i) => ({ ...o, correct: i === idx })),
    }));
    setSaved(false);
  }

  // Validation
  const filledOptions = form.options.filter((o) => o.text.trim().length > 0);
  const correctOption = form.options.find((o) => o.correct && o.text.trim().length > 0);
  const errors: string[] = [];
  if (!form.category) errors.push("Choose a specialty");
  if (!form.stem.trim()) errors.push("Write a question stem");
  if (filledOptions.length < 2) errors.push("Add at least 2 answer options");
  if (!correctOption) errors.push("Mark one of the filled options as correct");
  if (!form.articleSlug) errors.push("Link a source article");

  function handleSave() {
    if (errors.length > 0) return;
    const cleanOptions: AnswerOption[] = form.options
      .filter((o) => o.text.trim().length > 0)
      .map((o) => ({
        id: o.id as AnswerOption["id"],
        text: o.text.trim(),
        correct: o.correct,
        rationale: o.rationale.trim() || (o.correct ? "Correct answer." : "Incorrect."),
      }));
    const payload: Omit<Question, "id"> & { id?: string } = {
      ...(editId ? { id: editId } : {}),
      category: form.category,
      difficulty: form.difficulty,
      vignette: form.vignette.trim() || undefined,
      stem: form.stem.trim(),
      options: cleanOptions,
      articleSlug: form.articleSlug,
      articleAnchor: form.articleAnchor.trim() || undefined,
    };
    const out = saveCustomQuestion(payload);
    setSaved(true);
    if (!editId) {
      router.replace(`/admin/qbank/new?id=${out.id}`);
    }
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div>
      <Link
        href="/admin/qbank"
        className="inline-flex items-center gap-1 text-[13px] hover:underline mb-3 text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to question bank
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-primary">
            {editId ? "Edit question" : "New question"}
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            UKMLA-style multiple choice · 2–5 options · one correct answer · linked to a source article.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={errors.length > 0}
          className={clsx(
            "inline-flex items-center gap-1.5 h-10 px-5 rounded-md font-bold text-[13.5px] text-white transition-opacity hover:opacity-90",
            errors.length > 0 && "opacity-40 cursor-not-allowed",
          )}
          style={{ backgroundColor: "#5E35B1" }}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved" : "Save question"}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
          <strong>Before saving:</strong>
          <ul className="mt-1.5 list-disc pl-5 space-y-0.5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {/* Meta */}
        <Section title="Meta">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Specialty" required>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-line bg-white text-[14px] focus:outline-none"
              >
                <option value="">Select a specialty…</option>
                {allCategories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty" required>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update("difficulty", d)}
                    className={clsx(
                      "h-10 px-4 rounded-md text-[13px] font-semibold capitalize transition-colors",
                      form.difficulty === d
                        ? "bg-primary text-white"
                        : "border border-line text-primary hover:bg-slate-50",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* Question text */}
        <Section title="Question">
          <Field label="Vignette (optional)" hint="Clinical case context shown above the stem.">
            <textarea
              value={form.vignette}
              onChange={(e) => update("vignette", e.target.value)}
              rows={3}
              placeholder="A 72-year-old man attends his GP for a routine check…"
              className="w-full px-3 py-2 rounded-md border border-line bg-white text-[14px] focus:outline-none"
            />
          </Field>
          <Field label="Stem" required hint="The question itself.">
            <textarea
              value={form.stem}
              onChange={(e) => update("stem", e.target.value)}
              rows={2}
              placeholder="What is the most appropriate first-line investigation?"
              className="w-full px-3 py-2 rounded-md border border-line bg-white text-[14px] focus:outline-none"
            />
          </Field>
        </Section>

        {/* Options */}
        <Section title="Answer options">
          <p className="text-[12.5px] text-ink-muted mb-3">
            Click the letter on the left to mark the correct option. Leave any
            unused options blank — they will be discarded on save.
          </p>
          <div className="space-y-3">
            {form.options.map((opt, i) => (
              <div
                key={opt.id}
                className={clsx(
                  "rounded-xl p-3 border-2 transition-colors",
                  opt.correct ? "border-emerald-400 bg-emerald-50" : "border-line bg-white",
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrect(i)}
                    title="Mark as correct"
                    className={clsx(
                      "h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-md text-[13px] font-bold transition-colors",
                      opt.correct
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-primary hover:bg-secondary hover:text-white",
                    )}
                  >
                    {opt.id}
                  </button>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(i, { text: e.target.value })}
                      placeholder={`Option ${opt.id} text`}
                      className="w-full h-10 px-3 rounded-md border border-line bg-white text-[14px] focus:outline-none"
                    />
                    <textarea
                      value={opt.rationale}
                      onChange={(e) => updateOption(i, { rationale: e.target.value })}
                      placeholder="Why is this option correct or incorrect? (Shown after submit.)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-md border border-line bg-white text-[13px] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateOption(i, { text: "", rationale: "" })}
                    title="Clear option"
                    className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-md text-ink-muted hover:bg-slate-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Article link */}
        <Section title="Source article">
          <Field
            label="Linked article"
            required
            hint="Search by title or slug. The selected article opens side-by-side after the user submits their answer."
          >
            <div className="space-y-2">
              {selectedArticle && (
                <div className="rounded-md border-2 border-emerald-400 bg-emerald-50 p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-primary truncate">
                      {selectedArticle.title}
                    </div>
                    <div className="text-[12px] text-ink-muted truncate">
                      /{selectedArticle.slug} ·{" "}
                      {selectedArticle.categories.map((c) => c.name).join(", ")}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => update("articleSlug", "")}
                    className="text-[12.5px] font-semibold text-rose-600 hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              )}
              {!selectedArticle && (
                <>
                  <div className="relative">
                    <SearchIcon
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      value={articleQuery}
                      onChange={(e) => {
                        setArticleQuery(e.target.value);
                        setArticleListOpen(true);
                      }}
                      onFocus={() => setArticleListOpen(true)}
                      placeholder="Search 383 articles…"
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-line bg-white text-[14px] focus:outline-none"
                    />
                  </div>
                  {articleListOpen && (
                    <ul
                      className="rounded-md border border-line bg-white max-h-64 overflow-y-auto divide-y divide-line"
                    >
                      {articleResults.map((a) => (
                        <li key={a.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              update("articleSlug", a.slug);
                              setArticleListOpen(false);
                              setArticleQuery("");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50"
                          >
                            <div className="text-[14px] font-semibold text-primary truncate">
                              {a.title}
                            </div>
                            <div className="text-[12px] text-ink-muted truncate">
                              /{a.slug} ·{" "}
                              {a.categories.map((c) => c.name).join(", ")}
                            </div>
                          </button>
                        </li>
                      ))}
                      {articleResults.length === 0 && (
                        <li className="px-4 py-3 text-[13px] text-ink-muted">
                          No matches. Try a different term.
                        </li>
                      )}
                    </ul>
                  )}
                </>
              )}
            </div>
          </Field>
          <Field
            label="Most relevant section (optional)"
            hint='Shown above the article in the side pane. e.g. "Investigations".'
          >
            <input
              type="text"
              value={form.articleAnchor}
              onChange={(e) => update("articleAnchor", e.target.value)}
              placeholder="Investigations"
              className="w-full h-10 px-3 rounded-md border border-line bg-white text-[14px] focus:outline-none"
            />
          </Field>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-6 border border-line">
      <h2 className="text-[15px] font-bold text-primary mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider text-primary mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-ink-muted">{hint}</p>}
    </div>
  );
}
