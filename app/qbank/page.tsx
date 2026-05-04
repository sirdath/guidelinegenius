import Link from "next/link";
import { Sparkles, ArrowRight, Bell } from "lucide-react";
import { PageTopBand } from "@/components/PageTopBand";

export const metadata = {
  title: "Question Bank — Coming Soon",
  description:
    "Welcome to the Guideline Genius Question Bank. Practice questions launch soon — sign up to be notified.",
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
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16 lg:py-24 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold tracking-wider uppercase"
            style={{
              backgroundColor: "#5E35B1",
              color: "#ffffff",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Coming Soon
          </div>

          <h1
            className="mt-6 text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold leading-[1.05] tracking-tight"
            style={{ color: "#003366" }}
          >
            Welcome to the{" "}
            <span style={{ color: "#3BADFF" }}>Question Bank</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed"
            style={{ color: "#1a1a1a" }}
          >
            We're building a UKMLA-aligned practice question bank that plugs straight into the
            article library you already use. Timed mock exams, topic drills, spaced-repetition
            review, and answer explanations linked back to the relevant guideline.
          </p>

          <p
            className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed"
            style={{ color: "#1a1a1a" }}
          >
            <strong>It's not released yet.</strong> Sign up below and we'll email you the moment
            you can start practising.
          </p>

          <form className="mx-auto mt-10 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 h-12 px-5 rounded-md border bg-white text-[15px] focus:outline-none focus:ring-2"
              style={{ borderColor: "#cfd8e3" }}
            />
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center px-6 rounded-md text-white font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#5E35B1" }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify me
            </button>
          </form>

          <p className="mt-4 text-[13px]" style={{ color: "#6B6A6A" }}>
            We'll only email you about the launch. Unsubscribe anytime.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            <Feature
              title="Timed mock exams"
              body="UKMLA-style sittings with full performance breakdown by topic."
            />
            <Feature
              title="Topic drills"
              body="Pick a specialty or condition, get a focused set of questions."
            />
            <Feature
              title="Spaced repetition"
              body="The system surfaces your weak areas at the right intervals."
            />
          </div>

          <div className="mt-14">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[14px] font-semibold hover:underline"
              style={{ color: "#003366" }}
            >
              <ArrowRight className="h-4 w-4" />
              In the meantime, browse the article library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-md p-5"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cfd8e3",
      }}
    >
      <h3 className="text-[15px] font-bold" style={{ color: "#003366" }}>
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "#1a1a1a" }}>
        {body}
      </p>
    </div>
  );
}
