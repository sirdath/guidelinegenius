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
    <div>
      <PageTopBand />

      <section
        style={{
          background: "linear-gradient(180deg, #E3F2FD 0%, #ffffff 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16 lg:py-20 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold tracking-wider uppercase"
            style={{ backgroundColor: "#5E35B1", color: "#ffffff" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Demo · 8 sample questions
          </div>

          <h1
            className="mt-6 text-[40px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight"
            style={{ color: "#003366" }}
          >
            Welcome to the{" "}
            <span style={{ color: "#3BADFF" }}>Question Bank</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed"
            style={{ color: "#1a1a1a" }}
          >
            UKMLA-style multiple-choice questions with explanations linked
            directly to the relevant Guideline Genius article — answer the
            question, then read the source guideline alongside the explanation.
            The same loop you'd get from Amboss or Quesmed.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/qbank/session"
              className="inline-flex h-12 items-center px-7 rounded-md text-white font-bold text-[16px] transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#5E35B1" }}
            >
              Start the demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/articles"
              className="inline-flex h-12 items-center px-6 rounded-md font-semibold text-[15px] hover:bg-white/40 transition-colors"
              style={{ color: "#003366", border: "1.5px solid #003366" }}
            >
              Browse articles instead
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Feature
              icon={<Target className="h-4 w-4" />}
              title="UKMLA-aligned"
              body="Each question maps to a specialty in the UKMLA content map and links back to a real article."
            />
            <Feature
              icon={<Brain className="h-4 w-4" />}
              title="Article side-by-side"
              body="Submit your answer and the source guideline opens in the right pane — read both together."
            />
            <Feature
              icon={<Repeat className="h-4 w-4" />}
              title="Coming soon"
              body="Spaced-repetition, full UKMLA bank, performance analytics and timed mocks."
            />
          </div>

          <div
            className="mx-auto mt-12 max-w-xl rounded-md p-4 text-[13.5px] text-left"
            style={{
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#7c2d12",
            }}
          >
            <strong>Beta preview.</strong> {DEMO_QUESTIONS.length} sample
            questions are loaded right now. The full bank, account-tied
            progress and the spaced-repetition engine arrive in the next
            phase. To get notified at full launch, subscribe below.
          </div>

          <form className="mx-auto mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 h-11 px-5 rounded-md border bg-white text-[15px] focus:outline-none focus:ring-2"
              style={{ borderColor: "#cfd8e3" }}
            />
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center px-5 rounded-md text-white font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#003366" }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify me at launch
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
    <div
      className="rounded-md p-5 bg-white"
      style={{ border: "1px solid #cfd8e3" }}
    >
      <div
        className="inline-flex h-8 w-8 items-center justify-center rounded-md"
        style={{ backgroundColor: "#E3F2FD", color: "#003366" }}
      >
        {icon}
      </div>
      <h3 className="mt-3 text-[15px] font-bold" style={{ color: "#003366" }}>
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#1a1a1a" }}>
        {body}
      </p>
    </div>
  );
}
