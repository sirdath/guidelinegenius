// Local-only QBank state: completed sessions, bookmarks, notes, derived stats.
// Seeded with realistic mock data on first visit so the UI looks "lived-in"
// for the demo. Real backend wiring (Supabase) is a follow-up phase.

import { DEMO_QUESTIONS } from "./qbankData";

const SESSIONS_KEY = "gg_qbank_history_v1";
const BOOKMARKS_KEY = "gg_qbank_bookmarks_v1";
const NOTES_KEY = "gg_qbank_notes_v1";
const SEEDED_KEY = "gg_qbank_seeded_v1";

export type CompletedSession = {
  id: string;
  startedAt: number;
  finishedAt: number;
  mode: "practice" | "timed" | "mock";
  pack: string | null; // category name or "Mixed"
  selected: Record<string, string>; // qId → optionId
  questionIds: string[];
  flagged: Record<string, boolean>;
};

export type Bookmarks = Record<string, true>;
export type Notes = Record<string, string>;

// ---------- read/write helpers ----------

function readSessions(): CompletedSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeSessions(arr: CompletedSession[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(arr));
  } catch {}
}

function readBookmarks(): Bookmarks {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeBookmarks(b: Bookmarks) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(b));
  } catch {}
}

function readNotes(): Notes {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeNotes(n: Notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(n));
  } catch {}
}

// ---------- public API ----------

export function getSessions(): CompletedSession[] {
  return readSessions().sort((a, b) => b.finishedAt - a.finishedAt);
}

export function addSession(s: CompletedSession) {
  const arr = readSessions();
  arr.push(s);
  writeSessions(arr);
}

export function clearSessions() {
  writeSessions([]);
}

export function getBookmarks(): Bookmarks {
  return readBookmarks();
}

export function isBookmarked(id: string): boolean {
  return !!readBookmarks()[id];
}

export function toggleBookmark(id: string): boolean {
  const b = readBookmarks();
  if (b[id]) {
    delete b[id];
    writeBookmarks(b);
    return false;
  }
  b[id] = true;
  writeBookmarks(b);
  return true;
}

export function getNote(id: string): string {
  return readNotes()[id] ?? "";
}

export function setNote(id: string, text: string) {
  const n = readNotes();
  if (text.trim().length === 0) delete n[id];
  else n[id] = text;
  writeNotes(n);
}

// ---------- seeded mock data ----------

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(SEEDED_KEY) === "1") return;
  } catch {
    return;
  }

  // Seed a few completed sessions across the past 10 days
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const ids = DEMO_QUESTIONS.map((q) => q.id);

  function pickRandom<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  }

  const seeded: CompletedSession[] = [
    {
      id: "seed-1",
      startedAt: now - 1 * day - 18 * 60 * 1000,
      finishedAt: now - 1 * day,
      mode: "practice",
      pack: "Cardiovascular",
      questionIds: pickRandom(ids, 5),
      selected: {},
      flagged: {},
    },
    {
      id: "seed-2",
      startedAt: now - 3 * day - 22 * 60 * 1000,
      finishedAt: now - 3 * day,
      mode: "timed",
      pack: "Mixed",
      questionIds: pickRandom(ids, 8),
      selected: {},
      flagged: {},
    },
    {
      id: "seed-3",
      startedAt: now - 5 * day - 14 * 60 * 1000,
      finishedAt: now - 5 * day,
      mode: "practice",
      pack: "Endocrine and Metabolic",
      questionIds: pickRandom(ids, 4),
      selected: {},
      flagged: {},
    },
    {
      id: "seed-4",
      startedAt: now - 7 * day - 30 * 60 * 1000,
      finishedAt: now - 7 * day,
      mode: "mock",
      pack: "Mixed",
      questionIds: pickRandom(ids, 8),
      selected: {},
      flagged: {},
    },
    {
      id: "seed-5",
      startedAt: now - 10 * day - 12 * 60 * 1000,
      finishedAt: now - 10 * day,
      mode: "practice",
      pack: "Acute and Emergency",
      questionIds: pickRandom(ids, 3),
      selected: {},
      flagged: {},
    },
  ];

  // Generate plausible correct/wrong picks: ~70% correct on average
  for (const sess of seeded) {
    for (const qid of sess.questionIds) {
      const q = DEMO_QUESTIONS.find((x) => x.id === qid);
      if (!q) continue;
      const correctOpt = q.options.find((o) => o.correct);
      const isCorrect = Math.random() < 0.7;
      sess.selected[qid] = isCorrect
        ? correctOpt!.id
        : q.options.filter((o) => !o.correct)[Math.floor(Math.random() * (q.options.length - 1))]?.id ?? correctOpt!.id;
    }
    // ~10% flagged
    for (const qid of sess.questionIds) {
      if (Math.random() < 0.1) sess.flagged[qid] = true;
    }
  }

  writeSessions(seeded);

  // Seed a couple of bookmarks + a sample note
  writeBookmarks({ q3: true, q7: true });
  writeNotes({
    q3: "Remember: needle aspiration first for primary spontaneous pneumothorax >2cm. Chest drain is rescue if aspiration fails.",
  });

  try {
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {}
}

// ---------- derived stats ----------

export type Stats = {
  totalAttempted: number;
  totalCorrect: number;
  accuracyPct: number;
  streakDays: number;
  sessionsCount: number;
  byCategory: Record<string, { attempted: number; correct: number }>;
  recentScores: { date: number; pct: number }[];
};

export function computeStats(sessions: CompletedSession[]): Stats {
  let attempted = 0;
  let correct = 0;
  const byCategory: Record<string, { attempted: number; correct: number }> = {};

  for (const s of sessions) {
    for (const qid of s.questionIds) {
      const sel = s.selected[qid];
      if (!sel) continue;
      const q = DEMO_QUESTIONS.find((x) => x.id === qid);
      if (!q) continue;
      attempted++;
      const isCorrect = q.options.find((o) => o.id === sel)?.correct ?? false;
      if (isCorrect) correct++;
      const cat = q.category;
      byCategory[cat] = byCategory[cat] ?? { attempted: 0, correct: 0 };
      byCategory[cat].attempted++;
      if (isCorrect) byCategory[cat].correct++;
    }
  }

  const accuracyPct = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);

  // Streak: consecutive days back from today with at least one session finished
  const dayMs = 24 * 60 * 60 * 1000;
  const today = Math.floor(Date.now() / dayMs);
  const daysWithSession = new Set(
    sessions.map((s) => Math.floor(s.finishedAt / dayMs)),
  );
  let streak = 0;
  for (let d = today; d >= today - 60; d--) {
    if (daysWithSession.has(d)) streak++;
    else if (d !== today) break; // allow skipping today
  }
  // No streak if user has zero sessions
  if (sessions.length === 0) streak = 0;

  const recentScores = sessions
    .slice(0, 7)
    .map((s) => {
      const att = s.questionIds.filter((qid) => s.selected[qid]).length;
      const cor = s.questionIds.filter((qid) => {
        const sel = s.selected[qid];
        const q = DEMO_QUESTIONS.find((x) => x.id === qid);
        return q?.options.find((o) => o.id === sel)?.correct;
      }).length;
      return {
        date: s.finishedAt,
        pct: att === 0 ? 0 : Math.round((cor / att) * 100),
      };
    })
    .reverse();

  return {
    totalAttempted: attempted,
    totalCorrect: correct,
    accuracyPct,
    streakDays: streak,
    sessionsCount: sessions.length,
    byCategory,
    recentScores,
  };
}
