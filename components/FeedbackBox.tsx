import Link from "next/link";

export function FeedbackBox({ slug }: { slug: string }) {
  return (
    <section className="mt-12 rounded-ui-sm border border-line bg-white p-6 sm:p-8">
      <h3 className="text-[22px] font-extrabold text-ink-headline">
        Share Your Feedback Below
      </h3>
      <p className="mt-3 text-[15px] text-ink-body">
        Spotted an error, want to suggest an improvement, or just want to say something nice?
        We read every message.
      </p>
      <div className="mt-5 rounded-ui-sm bg-accent-light p-5 text-[14px] text-ink-body">
        You must be{" "}
        <Link
          href={`/login?redirect_to=/articles/${slug}`}
          className="font-semibold text-secondary-600 hover:text-secondary-700 underline underline-offset-2"
        >
          logged in
        </Link>{" "}
        to post a comment.
      </div>
    </section>
  );
}
