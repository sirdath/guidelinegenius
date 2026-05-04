"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_QUESTIONS, type Question } from "@/lib/qbankData";
import { listCustomQuestions } from "@/lib/customQuestions";
import { allCategories } from "@/lib/articles";
import { useSubscription } from "@/lib/subscription";
import { Play, Clock, Award, ChevronRight, Settings2, Lock } from "lucide-react";
import clsx from "clsx";

type Mode = "practice" | "timed" | "mock";

const COUNTS = [5, 10, 20, 40] as const;
const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;
const STATUSES = ["all", "unanswered", "incorrect", "flagged"] as const;

export default function StartPage() {
  return (
    <Suspense fallback={<div className="p-8 text-ink-muted">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { ready, isUnlocked } = useSubscription();

  const [mode, setMode] = useState<Mode>((sp.get("mode") as Mode) || "practice");
  const [pack, setPack] = useState<string>(sp.get("pack") || "");
  const [count, setCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  useEffect(() => {
    if (ready && !isUnlocked) router.replace("/qbank/pricing");
  }, [ready, isUnlocked, router]);

  const allQuestions = useMemo<Question[]>(
    () => [...listCustomQuestions(), ...DEMO_QUESTIONS],
    [],
  );

  const filtered = useMemo(() => {
    let arr = allQuestions;
    if (pack) {
      const cat = allCategories.find((c) => c.slug === pack);
      const targetName = cat?.name ?? pack;
      arr = arr.filter((q) => q.category === targetName);
    }
    if (difficulty !== "all") arr = arr.filter((q) => q.difficulty === difficulty);
    return arr;
  }, [allQuestions, pack, difficulty]);

  const willRun = Math.min(count, filtered.length);
  const startHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (pack) params.set("pack", pack);
    params.set("count", String(count));
    if (difficulty !== "all") params.set("difficulty", difficulty);
    if (status !== "all") params.set("status", status);
    return `/qbank/session?${params.toString()}`;
  }, [mode, pack, count, difficulty, status]);

  return (
    <div className="mx-auto max-w-[1080px] px-6 lg:px-10 py-10 lg:py-14">
      <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-secondary">
        <Settings2 className="h-3.5 w-3.5" />
        Configure session
      </div>
      <h1 className="mt-2 text-[28px] sm:text-[34px] font-extrabold tracking-tight text-primary">
        Build your <span className="text-secondary">practice session</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <Section title="Mode">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ModeButton
                active={mode === "practice"}
                onClick={() => setMode("practice")}
                title="Practice"
                body="Untimed. Submit and review one question at a time."
                icon={<Play className="h-4 w-4" />}
              />
              <ModeButton
                active={mode === "timed"}
                onClick={() => setMode("timed")}
                title="Timed"
                body="90 seconds per question. Auto-advance on timeout."
                icon={<Clock className="h-4 w-4" />}
              />
              <ModeButton
                active={mode === "mock"}
                onClick={() => setMode("mock")}
                title="Mock exam"
                body="Full sitting. Results revealed at the end only."
                icon={<Award className="h-4 w-4" />}
              />
            </div>
          </Section>

          <Section title="Specialty">
            <div className="flex flex-wrap gap-2">
              <Pill active={pack === ""} onClick={() => setPack("")}>
                All
              </Pill>
              {allCategories.map((c) => (
                <Pill key={c.slug} active={pack === c.slug} onClick={() => setPack(c.slug)}>
                  {c.name}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Number of questions">
            <div className="flex flex-wrap gap-2">
              {COUNTS.map((n) => (
                <Pill key={n} active={count === n} onClick={() => setCount(n)}>
                  {n}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Difficulty">
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <Pill key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                  <span className="capitalize">{d}</span>
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Question status">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <Pill key={s} active={status === s} onClick={() => setStatus(s)}>
                  <span className="capitalize">{s}</span>
                </Pill>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-ink-muted">
              Filter by your prior performance — currently demo-seeded so all
              statuses behave like "all" until more sessions are saved.
            </p>
          </Section>
        </div>

        {/* Summary card */}
        <aside className="lg:sticky lg:top-[180px] lg:self-start">
          <div className="rounded-xl bg-white border border-line p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-primary uppercase tracking-wider">
              Summary
            </h2>
            <dl className="mt-4 space-y-3 text-[13.5px]">
              <Row label="Mode" value={modeLabel(mode)} />
              <Row
                label="Specialty"
                value={
                  pack
                    ? allCategories.find((c) => c.slug === pack)?.name ?? pack
                    : "All specialties"
                }
              />
              <Row label="Questions" value={`${willRun}`} subtle={count > willRun ? `(of ${count} requested)` : undefined} />
              <Row label="Difficulty" value={difficulty} capitalize />
              <Row label="Status filter" value={status} capitalize />
            </dl>

            <div className="mt-5 pt-4 border-t border-line">
              <p className="text-[13px] text-ink-body">
                {willRun > 0
                  ? `Estimated ${estimateMinutes(mode, willRun)} min`
                  : "Adjust filters — no questions match."}
              </p>
            </div>

            {ready && !isUnlocked ? (
              <Link
                href="/qbank/pricing"
                className="mt-5 inline-flex items-center justify-center gap-1.5 h-12 w-full rounded-md text-[14px] font-bold text-ink-muted bg-slate-100 hover:bg-slate-200"
              >
                <Lock className="h-4 w-4" />
                Unlock to start
              </Link>
            ) : (
              <Link
                href={willRun > 0 ? startHref : "#"}
                aria-disabled={willRun === 0}
                onClick={(e) => {
                  if (willRun === 0) e.preventDefault();
                }}
                className={clsx(
                  "mt-5 inline-flex items-center justify-center gap-1.5 h-12 w-full rounded-md text-white font-bold text-[14px] transition-opacity",
                  willRun > 0 ? "hover:opacity-90" : "opacity-40 cursor-not-allowed",
                )}
                style={{ backgroundColor: "#5E35B1" }}
              >
                Start session
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white border border-line p-5">
      <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-primary mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  body,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-xl p-4 text-left transition-all",
        active
          ? "border-2 border-cta bg-cta/5 ring-2 ring-cta/20"
          : "border-2 border-line bg-white hover:border-secondary",
      )}
      style={active ? { borderColor: "#5E35B1", backgroundColor: "#5E35B10D" } : {}}
    >
      <div
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white"
        style={{ backgroundColor: active ? "#5E35B1" : "#003366" }}
      >
        {icon}
      </div>
      <div className="mt-2 text-[15px] font-bold text-primary">{title}</div>
      <div className="mt-1 text-[12.5px] text-ink-body leading-relaxed">{body}</div>
    </button>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "h-9 px-3.5 rounded-full text-[12.5px] font-semibold transition-colors",
        active
          ? "bg-primary text-white border border-primary"
          : "bg-white text-primary border border-line hover:bg-slate-50",
      )}
    >
      {children}
    </button>
  );
}

function Row({
  label,
  value,
  subtle,
  capitalize,
}: {
  label: string;
  value: string | number;
  subtle?: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd
        className={clsx("font-semibold text-ink-headline text-right", capitalize && "capitalize")}
      >
        {value}
        {subtle && <span className="ml-1 text-[12px] font-normal text-ink-muted">{subtle}</span>}
      </dd>
    </div>
  );
}

function modeLabel(m: Mode) {
  return m === "practice" ? "Practice" : m === "timed" ? "Timed" : "Mock exam";
}

function estimateMinutes(mode: Mode, n: number) {
  if (mode === "timed") return Math.ceil((n * 90) / 60);
  if (mode === "mock") return Math.ceil((n * 75) / 60);
  return Math.ceil((n * 60) / 60); // practice
}
