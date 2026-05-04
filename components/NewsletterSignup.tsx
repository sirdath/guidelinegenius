export function NewsletterSignup() {
  return (
    <section className="bg-primary py-16 lg:py-20 text-white">
      <div className="mx-auto w-full px-5 lg:px-8 text-center">
        <h2 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight leading-tight">
          Be first to access our QBank
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80 text-[16px] leading-relaxed">
          Get early access and stay updated when our practice question bank launches.
        </p>
        <form className="mt-8 mx-auto flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 h-12 px-5 rounded-ui-sm bg-white text-ink-headline placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            type="button"
            className="h-12 px-7 rounded-ui-sm bg-secondary text-white font-bold hover:bg-secondary-600 transition-colors"
          >
            Get Access
          </button>
        </form>
      </div>
    </section>
  );
}
