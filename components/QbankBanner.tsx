export function QbankBanner() {
  return (
    <section className="mt-12 rounded-ui-sm overflow-hidden bg-gradient-to-br from-primary to-primary-700 text-white">
      <div className="px-6 sm:px-10 py-10 sm:py-12 text-center">
        <h2 className="text-[28px] sm:text-[36px] font-extrabold leading-tight">
          Be first to access <span className="text-secondary-300">our QBank</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/85 text-[15px] leading-relaxed">
          Sign up to receive major guideline updates and early access when we launch.
        </p>
        <form className="mt-6 mx-auto flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="Your Email"
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
