import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy",
  description: "How Guideline Genius handles your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-4">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
          />
        </div>
      </div>

      <header className="bg-gradient-to-b from-accent-light/60 to-white border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-12 lg:py-14">
          <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-600">
            Legal
          </div>
          <h1 className="mt-2 text-[36px] sm:text-[44px] font-extrabold tracking-tight text-primary">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[14px] text-ink-muted">Last updated: 4 May 2026</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-12 lg:py-16">
        <div className="prose-article max-w-none">
          <p>
            This Privacy Policy describes how Guideline Genius LTD ("we", "us") collects, uses, and
            shares personal information in connection with our website and services. We are
            committed to protecting your privacy in compliance with the UK GDPR and the Data
            Protection Act 2018.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account information:</strong> email address and password (hashed) when you
              create an account.
            </li>
            <li>
              <strong>Usage data:</strong> pages viewed, articles read, questions attempted, time
              spent — used to improve the service and provide your personal progress.
            </li>
            <li>
              <strong>Payment information:</strong> handled by Stripe; we do not store card
              details.
            </li>
            <li>
              <strong>Cookies and analytics:</strong> first-party analytics cookies for product
              improvement (anonymised).
            </li>
          </ul>

          <h2>How we use your data</h2>
          <ul>
            <li>To provide the service (account, content, progress tracking)</li>
            <li>To process payments through our payment provider (Stripe)</li>
            <li>To send transactional email (account verification, receipts)</li>
            <li>To send marketing email <em>only</em> with your explicit opt-in consent</li>
            <li>To improve the service through anonymised usage analytics</li>
          </ul>

          <h2>Your rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw marketing consent at any time</li>
            <li>Lodge a complaint with the Information Commissioner's Office (ICO)</li>
          </ul>

          <h2>Data sharing</h2>
          <p>
            We share data only with the third-party processors required to operate the service:
            Stripe (payments), Supabase (database hosting in EU/UK), Vercel (web hosting in EU/UK),
            Resend (transactional email), and PostHog or Plausible (analytics). Each has a data
            processing agreement in place.
          </p>

          <h2>Contact</h2>
          <p>
            For any privacy-related enquiry contact us at{" "}
            <a href="mailto:hello@guidelinegenius.com">hello@guidelinegenius.com</a>.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The "Last updated" date at the top
            reflects the current version.
          </p>
        </div>
      </div>
    </article>
  );
}
