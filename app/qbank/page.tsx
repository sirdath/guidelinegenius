import Link from "next/link";
import { Sparkles, ArrowRight, Bell, Brain, Target, Repeat } from "lucide-react";
import { PageTopBand } from "@/components/PageTopBand";
import { DEMO_QUESTIONS } from "@/lib/qbankData";

export const metadata = {
  title: "Question Bank — UKMLA Practice",
  description:
    "Practice UKMLA-style questions with explanations linked to the relevant Guideline Genius article. Demo session — 8 sample questions.",
};

export default function QbankPage() {
  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <PageTopBand />

      <section className="bg-gradient-to-b from-accent-light to-slate-50">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase bg-cta text-white shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-4 w-4" />
            Demo · 8 sample questions
          </div>

          <h1 className="text-[42px] sm:text-[56px] font-extrabold leading-[1.05] tracking-tight text-primary">
            Welcome to the <span className="text-secondary">Question Bank</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] sm:text-[18px] leading-relaxed text-ink-body">
            UKMLA-style multiple-choice questions with explanations linked
            directly to the relevant Guideline Genius article — answer the
            question, then read the source guideline alongside the explanation.
            The same loop you'd get from Amboss or Quesmed.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/qbank/session"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-xl text-white font-bold text-[16px] bg-cta hover:bg-cta-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Start the demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/articles"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-xl font-bold text-[16px] text-primary bg-white border-2 border-primary hover:bg-primary-50 transition-all shadow-sm"
            >
              Browse articles
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <Feature
              icon={<Target className="h-5 w-5" />}
              title="UKMLA-aligned"
              body="Each question maps to a specialty in the UKMLA content map and links back to a real article."
            />
            <Feature
              icon={<Brain className="h-5 w-5" />}
              title="Article side-by-side"
              body="Submit your answer and the source guideline opens in the right pane — read both together."
            />
            <Feature
              icon={<Repeat className="h-5 w-5" />}
              title="Coming soon"
              body="Spaced-repetition, full UKMLA bank, performance analytics and timed mocks."
            />
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl p-5 text-[14px] text-left bg-amber-50 border border-amber-200 text-amber-900 shadow-sm flex gap-4">
            <div className="shrink-0 mt-0.5">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <strong className="font-bold text-amber-900">Beta preview.</strong>{" "}
              {DEMO_QUESTIONS.length} sample questions are loaded right now. The full bank, account-tied
              progress and the spaced-repetition engine arrive in the next
              phase. To get notified at full launch, subscribe below.
            </div>
          </div>

          <form className="mx-auto mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 h-12 px-5 rounded-xl border border-line bg-white text-[15px] text-ink-body focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
            />
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center px-6 rounded-xl text-white font-bold bg-primary hover:bg-primary-700 transition-all shadow-sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify me
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl p-6 bg-white border border-line shadow-sm hover:shadow-md transition-shadow">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-[16px] font-bold text-ink-headline mb-2">
        {title}
      </h3>
      <p className="text-[14px] leading-relaxed text-ink-body">
        {body}
      </p>
    </div>
  );
}
