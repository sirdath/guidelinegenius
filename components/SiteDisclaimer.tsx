import { AlertCircle } from "lucide-react";

export function SiteDisclaimer() {
  return (
    <aside className="mt-10 rounded-ui-sm border border-line bg-accent-light/50 p-5 text-[13.5px] leading-relaxed text-ink-body">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-secondary-600 mt-0.5" />
        <div>
          <p>
            <strong className="text-ink-headline">Educational use only.</strong> Guideline Genius is
            a learning resource for medical students and clinicians. It is{" "}
            <em>not a substitute for clinical judgement</em> and must not be used as the sole basis
            for clinical decisions. Always consult the original guideline and current local
            policies. We are actively expanding to cover the full UKMLA content map — some
            conditions may not yet be available.
          </p>
        </div>
      </div>
    </aside>
  );
}
