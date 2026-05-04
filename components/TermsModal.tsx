"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "gg_tnc_accepted_v1";

export function TermsModal() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
        document.body.style.overflow = "hidden";
      }
    } catch {
      // ignore (SSR or sandboxed)
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function accept() {
    if (!agreed) return;
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    document.body.style.overflow = "";
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-2xl rounded-md bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="border-b border-line px-6 py-4 shrink-0">
          <h2 className="text-[18px] font-bold" style={{ color: "#101010" }}>
            Terms &amp; Conditions and Medical Disclaimer
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-5 overflow-y-auto text-[13.5px] leading-[1.55] text-ink-body space-y-3">
          <p>
            <strong>1.</strong> By accessing or using this website, you agree to comply with and be
            bound by these terms and conditions. If you do not agree with any part of these terms
            and conditions, you must not use this website.
          </p>
          <p>
            <strong>2.</strong> Use of the website: This website is for informational and
            educational purposes only and is intended for medical professionals. You agree to use
            the website in a lawful manner and to refrain from activities that may disrupt its
            functionality or compromise its security.
          </p>
          <p>
            <strong>3.</strong> Intellectual property: All content on this website, including but
            not limited to text, graphics, logos, images, and code, is the property of Guideline
            Genius LTD unless otherwise stated. Unauthorised reproduction, distribution, or use of
            the website's content is strictly prohibited without prior written consent.
          </p>
          <p>
            <strong>4.</strong> Subscriptions and payments: Certain sections of the website may
            require a subscription for access. By subscribing, you agree to pay any fees specified
            during the subscription process. All fees are non-refundable unless otherwise specified.
          </p>
          <p>
            <strong>5.</strong> Accuracy and updates: While we strive to ensure the accuracy of the
            information on this website, we do not guarantee that the content is error-free or
            up-to-date. Guideline Genius LTD reserves the right to modify or update the content of
            this website at any time without prior notice.
          </p>
          <p>
            <strong>6.</strong> Third-party links: This website may contain links to third-party
            websites for your convenience. Guideline Genius LTD is not responsible for the content,
            accuracy, or availability of these external sites.
          </p>
        </div>

        {/* Footer (always visible, pinned) */}
        <div className="border-t border-line px-6 py-4 shrink-0 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 text-[13px] text-ink-body cursor-pointer select-none flex-1 min-w-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 shrink-0 rounded border border-line cursor-pointer"
              style={{ accentColor: "#5E35B1" }}
            />
            <span className="truncate">
              I have read and agree to all the terms &amp; conditions and medical disclaimer.
            </span>
          </label>
          <button
            type="button"
            onClick={accept}
            disabled={!agreed}
            className="shrink-0 inline-flex h-10 items-center px-6 rounded-md font-bold text-white text-[14px] transition-all"
            style={{
              backgroundColor: agreed ? "#5E35B1" : "#9C8DC4",
              cursor: agreed ? "pointer" : "not-allowed",
            }}
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
