"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Clock, Crown } from "lucide-react";
import { useSubscription, PLAN_INFO } from "@/lib/subscription";

export default function QbankPricingPage() {
  const { plan, isUnlocked, trialDaysLeft, ready, startTrial, upgrade } = useSubscription();
  const router = useRouter();

  function go(action: () => void) {
    action();
    router.push("/qbank");
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-b from-accent-light to-slate-50">
        <div className="mx-auto max-w-[1080px] px-6 lg:px-10 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-[40px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight text-primary">
              Unlock the <span className="text-secondary">Question Bank</span>
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-body">
              All UKMLA-style practice questions, every source guideline,
              spaced-repetition review and timed mocks. Start with a free trial,
              or unlock immediately.
            </p>
            {ready && isUnlocked && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-[13px] font-bold text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Active: {PLAN_INFO[plan].label}
                {trialDaysLeft !== null && ` · ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left`}
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Free Trial */}
            <PlanCard
              tone="muted"
              eyebrow="No card required"
              title="Free trial"
              price="Free"
              period="for 7 days"
              features={[
                "All practice questions unlocked",
                "Article side-by-side review",
                "Spaced-repetition queue",
                "Cancel anytime",
              ]}
              cta={
                ready && plan === "trial"
                  ? "Trial active"
                  : plan === "yearly" || plan === "three_year"
                    ? "Already a member"
                    : "Start free trial"
              }
              ctaDisabled={ready && plan !== "free"}
              onClick={() => go(startTrial)}
            />

            {/* Yearly */}
            <PlanCard
              tone="featured"
              eyebrow="Most popular"
              title="1 year access"
              price="€40"
              period="one-time"
              features={[
                "Everything in trial",
                "Full UKMLA bank",
                "Topic-focused mock exams",
                "Performance analytics",
                "Priority support",
              ]}
              cta={plan === "yearly" ? "Active" : "Get yearly access"}
              ctaDisabled={plan === "yearly"}
              onClick={() => go(() => upgrade("yearly"))}
            />

            {/* 3 Year */}
            <PlanCard
              tone="muted"
              eyebrow="Best value · save 33%"
              title="3 year access"
              price="€80"
              period="one-time"
              priceSub="(~€2.20/month)"
              features={[
                "Everything in yearly",
                "All future content drops",
                "Locked-in price for 3 years",
                "Carry through F1 / F2 years",
              ]}
              cta={plan === "three_year" ? "Active" : "Get 3-year access"}
              ctaDisabled={plan === "three_year"}
              onClick={() => go(() => upgrade("three_year"))}
            />
          </div>

          <div className="mt-10 mx-auto max-w-2xl rounded-xl bg-white p-5 border border-line text-[13.5px] text-ink-body">
            <strong className="text-ink-headline">Demo mode:</strong> the
            "purchase" buttons unlock access in your browser only — no real
            payment is processed. The production build will route through
            Stripe Checkout.
          </div>

          <p className="mt-8 text-center">
            <Link
              href="/qbank"
              className="text-[14px] font-semibold text-primary hover:underline"
            >
              ← Back to Question Bank
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  tone,
  eyebrow,
  title,
  price,
  period,
  priceSub,
  features,
  cta,
  ctaDisabled,
  onClick,
}: {
  tone: "muted" | "featured";
  eyebrow: string;
  title: string;
  price: string;
  period: string;
  priceSub?: string;
  features: string[];
  cta: string;
  ctaDisabled?: boolean;
  onClick: () => void;
}) {
  const featured = tone === "featured";
  return (
    <div
      className={`relative rounded-2xl bg-white p-7 flex flex-col transition-all ${
        featured
          ? "border-2 border-secondary shadow-[0_20px_60px_-20px_rgba(0,51,102,0.18)] ring-2 ring-secondary/20"
          : "border border-line shadow-sm"
      }`}
    >
      {featured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-white"
          style={{ backgroundColor: "#5E35B1" }}
        >
          <Crown className="h-3 w-3" />
          {eyebrow}
        </div>
      )}
      {!featured && (
        <div className="text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
          {eyebrow}
        </div>
      )}
      <h3 className="mt-3 text-[22px] font-bold text-primary">{title}</h3>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[44px] font-extrabold text-ink-headline leading-none">
          {price}
        </span>
        <span className="text-[14px] text-ink-muted">{period}</span>
      </div>
      {priceSub && (
        <div className="mt-1 text-[12.5px] text-ink-muted">{priceSub}</div>
      )}

      <ul className="mt-6 space-y-3 text-[14px] text-ink-body flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClick}
        disabled={ctaDisabled}
        className={`mt-6 inline-flex items-center justify-center h-12 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          featured
            ? "bg-cta text-white hover:bg-cta-600"
            : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
        }`}
        style={featured ? { backgroundColor: "#5E35B1" } : {}}
      >
        {cta}
      </button>
    </div>
  );
}
