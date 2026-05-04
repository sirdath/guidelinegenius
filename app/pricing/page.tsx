import Link from "next/link";
import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Pricing",
  description: "Simple, student-friendly pricing for Guideline Genius.",
};

const plans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    blurb: "All articles, all categories, no paywall.",
    features: [
      "All 383 article summaries",
      "Source-linked references",
      "Mobile-friendly reading",
      "Updated as guidelines change",
    ],
    cta: "Start reading",
    href: "/articles",
    highlight: false,
  },
  {
    name: "Practice",
    price: "£9",
    period: "/month",
    blurb: "Everything in Free, plus the practice question bank.",
    features: [
      "Unlimited practice questions",
      "Timed mock exams (UKMLA-style)",
      "Topic drills + difficulty levels",
      "Full performance analytics",
      "Spaced repetition for weak topics",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Annual",
    price: "£79",
    period: "/year",
    blurb: "Two months free vs. monthly.",
    features: [
      "Everything in Practice",
      "Two months free",
      "Priority support",
      "Cancel anytime",
    ],
    cta: "Save 27%",
    href: "/signup",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div>
      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
        </div>
      </div>

      <header className="bg-gradient-to-b from-accent-light/60 to-white border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-14 lg:py-20 text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-600">
            Pricing
          </div>
          <h1 className="mt-3 text-[40px] sm:text-[52px] font-extrabold tracking-tight text-primary">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-ink-body">
            The reference library is free, forever. Pay only if you want to drill questions.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-ui-sm border p-8 bg-white ${
                p.highlight
                  ? "border-secondary shadow-[0_20px_60px_-20px_rgba(0,51,102,0.18)] ring-2 ring-secondary"
                  : "border-line"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-white">
                  Most popular
                </div>
              )}
              <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-600">
                {p.name}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[48px] font-extrabold text-primary">{p.price}</span>
                <span className="text-ink-muted">{p.period}</span>
              </div>
              <p className="mt-2 text-[14px] text-ink-body">{p.blurb}</p>
              <Link
                href={p.href}
                className={`mt-6 block h-12 rounded-ui-sm text-center leading-[3rem] font-bold transition-colors ${
                  p.highlight
                    ? "bg-primary text-white hover:bg-primary-700"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {p.cta}
              </Link>
              <ul className="mt-6 space-y-3 text-[14.5px] text-ink-body">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
