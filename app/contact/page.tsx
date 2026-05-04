import { PageTopBand } from "@/components/PageTopBand";
import { SplitTitle } from "@/components/SplitTitle";

export const metadata = {
  title: { absolute: "Contact Us | UKMLA Guide" },
  description: "Get in touch with the Guideline Genius team — hello@guidelinegenius.com.",
};

export default function ContactPage() {
  return (
    <article>
      <PageTopBand />

      <div className="w-full px-6 lg:px-10 py-12">
        <SplitTitle
          primary="Contact"
          accent="Us"
          as="h1"
          className="text-[40px] sm:text-[48px]"
        />

        <form className="mx-auto mt-12 max-w-2xl space-y-5">
          <div>
            <label className="block text-[15px] font-semibold text-ink-headline">Name</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              className="mt-2 w-full h-11 rounded-md border border-line bg-white px-4 text-[15px] placeholder:text-ink-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[15px] font-semibold text-ink-headline">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="mt-2 w-full h-11 rounded-md border border-line bg-white px-4 text-[15px] placeholder:text-ink-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="block text-[15px] font-semibold text-ink-headline">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="phone number"
                className="mt-2 w-full h-11 rounded-md border border-line bg-white px-4 text-[15px] placeholder:text-ink-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-[15px] font-semibold text-ink-headline">Message</label>
            <textarea
              name="message"
              rows={6}
              placeholder="message..."
              className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-[15px] placeholder:text-ink-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center px-10 rounded-md font-bold text-[15px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1", color: "#ffffff" }}
          >
            Send
          </button>
        </form>
      </div>
    </article>
  );
}
