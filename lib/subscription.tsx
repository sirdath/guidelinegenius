"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Plan = "free" | "trial" | "yearly" | "three_year";

const PLAN_KEY = "gg_sub_plan";
const TRIAL_END_KEY = "gg_sub_trial_ends";

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7-day free trial

export const PLAN_INFO = {
  free: { label: "Free", priceLabel: "Free", durationLabel: "" },
  trial: { label: "Free trial", priceLabel: "7 days", durationLabel: "trial" },
  yearly: { label: "Yearly access", priceLabel: "€40", durationLabel: "1 year" },
  three_year: { label: "3-year access", priceLabel: "€80", durationLabel: "3 years" },
} as const;

type SubState = {
  plan: Plan;
  trialEndsAt: number | null;
  ready: boolean;
  isUnlocked: boolean; // grants QBank access (trial active or paid)
  trialDaysLeft: number | null;
  startTrial: () => void;
  upgrade: (plan: "yearly" | "three_year") => void;
  reset: () => void;
};

const SubContext = createContext<SubState>({
  plan: "free",
  trialEndsAt: null,
  ready: false,
  isUnlocked: false,
  trialDaysLeft: null,
  startTrial: () => {},
  upgrade: () => {},
  reset: () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>("free");
  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const p = (localStorage.getItem(PLAN_KEY) as Plan) || "free";
      const tEnds = localStorage.getItem(TRIAL_END_KEY);
      setPlan(p);
      setTrialEndsAt(tEnds ? parseInt(tEnds, 10) : null);
    } catch {}
    setReady(true);
  }, []);

  // Trial expiration check
  const now = Date.now();
  const trialActive =
    plan === "trial" && trialEndsAt !== null && now < trialEndsAt;
  const isUnlocked =
    plan === "yearly" || plan === "three_year" || trialActive;

  const trialDaysLeft = trialActive
    ? Math.max(0, Math.ceil((trialEndsAt! - now) / (24 * 60 * 60 * 1000)))
    : null;

  function startTrial() {
    const ends = Date.now() + TRIAL_DURATION_MS;
    try {
      localStorage.setItem(PLAN_KEY, "trial");
      localStorage.setItem(TRIAL_END_KEY, String(ends));
    } catch {}
    setPlan("trial");
    setTrialEndsAt(ends);
  }

  function upgrade(p: "yearly" | "three_year") {
    try {
      localStorage.setItem(PLAN_KEY, p);
      localStorage.removeItem(TRIAL_END_KEY);
    } catch {}
    setPlan(p);
    setTrialEndsAt(null);
  }

  function reset() {
    try {
      localStorage.removeItem(PLAN_KEY);
      localStorage.removeItem(TRIAL_END_KEY);
    } catch {}
    setPlan("free");
    setTrialEndsAt(null);
  }

  return (
    <SubContext.Provider
      value={{ plan, trialEndsAt, ready, isUnlocked, trialDaysLeft, startTrial, upgrade, reset }}
    >
      {children}
    </SubContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubContext);
}
