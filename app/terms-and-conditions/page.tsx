import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for Guideline Genius.",
};

export default function TermsPage() {
  return (
    <article>
      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-4">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
          />
        </div>
      </div>

      <header className="bg-gradient-to-b from-accent-light/60 to-white border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-12 lg:py-14">
          <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-600">
            Legal
          </div>
          <h1 className="mt-2 text-[36px] sm:text-[44px] font-extrabold tracking-tight text-primary">
            Terms &amp; Conditions and Medical Disclaimer
          </h1>
          <p className="mt-3 text-[14px] text-ink-muted">Last updated: 4 May 2026</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-12 lg:py-16">
        <div className="prose-article max-w-none">
          <h2>1. Acceptance of these Terms</h2>
          <p>
            By accessing or using Guideline Genius ("the Service"), provided by Guideline Genius
            LTD, a company registered in England and Wales with its registered office at 128 City
            Road, London EC1V 2NX, you agree to be bound by these Terms &amp; Conditions.
          </p>

          <h2>2. Educational use only</h2>
          <p>
            <strong>The Service is for educational use only.</strong> Content is provided for
            general medical education and is <em>not</em> intended to provide medical advice,
            diagnosis, or treatment. The information is not a substitute for professional medical
            judgement, and must not be used as the sole basis for clinical decision-making. Always
            consult the original guideline and current local policies before taking any clinical
            action.
          </p>

          <h2>3. Accuracy and limitation of liability</h2>
          <p>
            We make every effort to ensure content is accurate, up-to-date, and aligned with
            current UK guidance. However, medical knowledge evolves rapidly and we make no
            warranty, express or implied, regarding the completeness, accuracy, or currency of any
            content. To the fullest extent permitted by law, Guideline Genius LTD shall not be
            liable for any loss or harm arising from reliance on the content.
          </p>

          <h2>4. Account responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity that occurs under your account. You must notify us immediately of any
            unauthorised use.
          </p>

          <h2>5. Subscriptions, billing and cancellation</h2>
          <p>
            Paid subscriptions auto-renew at the end of each billing period unless cancelled. You
            may cancel at any time via your account billing portal — cancellation takes effect at
            the end of the current paid period. Under UK Consumer Contracts Regulations, digital
            content purchases are exempt from the 14-day cooling-off period once you begin using
            the Service.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            All content on the Service — including text, summaries, structure, and presentation —
            is owned by Guideline Genius LTD or its content contributors. You may not reproduce,
            redistribute, or commercially exploit the content without prior written permission.
          </p>

          <h2>7. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the Service</li>
            <li>Scrape or systematically copy content</li>
            <li>Share account credentials with others</li>
            <li>Misrepresent your identity or affiliation</li>
          </ul>

          <h2>8. Termination</h2>
          <p>
            We may suspend or terminate accounts that breach these Terms. You may terminate your
            account at any time via your account settings.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any dispute will be subject
            to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2>10. Contact</h2>
          <p>
            For any question about these Terms, contact us at{" "}
            <a href="mailto:hello@guidelinegenius.com">hello@guidelinegenius.com</a>.
          </p>
        </div>
      </div>
    </article>
  );
}
