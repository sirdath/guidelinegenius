// Admin-authored questions saved in localStorage. Merged with DEMO_QUESTIONS
// when running a session. Real persistence will move to Supabase later.
import type { Question } from "./qbankData";

const STORAGE_KEY = "gg_qbank_custom_questions_v1";

export type CustomQuestion = Question & {
  createdAt: string;
  updatedAt: string;
};

function readMap(): Record<string, CustomQuestion> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, CustomQuestion>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function listCustomQuestions(): CustomQuestion[] {
  return Object.values(readMap()).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1,
  );
}

export function getCustomQuestion(id: string): CustomQuestion | null {
  return readMap()[id] ?? null;
}

export function saveCustomQuestion(q: Omit<Question, "id"> & { id?: string }): CustomQuestion {
  const map = readMap();
  const id = q.id || `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const existing = map[id];
  const next: CustomQuestion = {
    ...q,
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  map[id] = next;
  writeMap(map);
  return next;
}

export function deleteCustomQuestion(id: string) {
  const map = readMap();
  delete map[id];
  writeMap(map);
}
