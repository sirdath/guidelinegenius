import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Practice questions",
  description: "Timed practice and topic drills built on the article library — coming soon.",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
        <Sparkles className="h-3.5 w-3.5" />
        Coming next
      </div>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Practice questions, on top of every article.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
        Timed mocks, topic drills, and high-yield revision built from the same article library —
        with answer explanations linked to the underlying NICE/CKS guidelines.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Get notified at launch
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
