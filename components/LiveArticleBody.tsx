"use client";
import { useEffect, useRef, useState } from "react";

// Renders the scraped Elementor accordion HTML from guidelinegenius.com
// and wires up the interactivity (accordion toggle, hover popups, open-all)
// so it behaves identically to the live site.
export function LiveArticleBody({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // ---- Click handlers for accordion sections ----
    function handleClick(e: Event) {
      const target = e.target as HTMLElement;

      // Accordion section header (h2.accordion-header)
      const sectionHeader = target.closest(".accordion-header");
      if (sectionHeader) {
        const section = sectionHeader.closest(".accordion-section");
        const content = section?.querySelector<HTMLElement>(":scope > .accordion-content");
        if (content) {
          const open = content.style.display !== "none";
          content.style.display = open ? "none" : "block";
          sectionHeader.setAttribute("aria-expanded", open ? "false" : "true");
          const closeBtn = content.querySelector<HTMLButtonElement>(":scope > .panel-close");
          if (closeBtn) closeBtn.style.display = open ? "none" : "block";
        }
        return;
      }

      // h3-level subheader
      const subHeader = target.closest(".accordion-subheader");
      if (subHeader) {
        const item = subHeader.closest(".accordion-item");
        const sub = item?.querySelector<HTMLElement>(":scope > .accordion-subcontent");
        if (sub) {
          const open = sub.style.display !== "none";
          sub.style.display = open ? "none" : "block";
          subHeader.setAttribute("aria-expanded", open ? "false" : "true");
        }
        return;
      }

      // Panel close button (Collapse)
      const panelClose = target.closest(".panel-close");
      if (panelClose) {
        const content = panelClose.closest<HTMLElement>(".accordion-content");
        if (content) {
          content.style.display = "none";
          (panelClose as HTMLElement).style.display = "none";
          const header = content.parentElement?.querySelector(".accordion-header");
          if (header) header.setAttribute("aria-expanded", "false");
        }
        return;
      }

      // Dotted-popup toggle (used for inline tooltips)
      const popupBtn = target.closest(".dotted-popup-button");
      if (popupBtn) {
        const popup = popupBtn.parentElement?.querySelector<HTMLElement>(":scope > .dotted-popup-content");
        if (popup) {
          const open = popup.dataset.open === "1";
          popup.style.setProperty("display", open ? "none" : "inline", "important");
          popup.dataset.open = open ? "0" : "1";
        }
      }
    }

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, []);

  function toggleAll() {
    const root = containerRef.current;
    if (!root) return;
    const next = !allOpen;
    setAllOpen(next);
    root
      .querySelectorAll<HTMLElement>(".accordion-content, .accordion-subcontent")
      .forEach((el) => {
        el.style.display = next ? "block" : "none";
      });
    root
      .querySelectorAll<HTMLElement>(".panel-close")
      .forEach((el) => {
        el.style.display = next ? "block" : "none";
      });
    root
      .querySelectorAll<HTMLElement>(".accordion-header, .accordion-subheader")
      .forEach((el) => el.setAttribute("aria-expanded", next ? "true" : "false"));
  }

  return (
    <div className="live-article-wrapper post-template-default">
      <link rel="stylesheet" href="/css/aaa-acc.css" />

      <div className="accordion-controls flex flex-col items-end mb-5">
        <button
          type="button"
          onClick={toggleAll}
          className="ctrl-link inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-colors hover:bg-accent-light"
          style={{
            border: "1px solid #cfd8e3",
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          <span className="ctrl-text">{allOpen ? "Close all" : "Open all"}</span>
        </button>
        <p className="text-[12px] mt-1.5" style={{ color: "#666" }}>
          Tip: Click <strong>Open all</strong> before using{" "}
          <kbd className="px-1.5 py-0.5 rounded border bg-white text-[11px]" style={{ borderColor: "#ccc" }}>
            Ctrl
          </kbd>
          +
          <kbd className="px-1.5 py-0.5 rounded border bg-white text-[11px]" style={{ borderColor: "#ccc" }}>
            F
          </kbd>{" "}
          to search this guideline.
        </p>
      </div>

      <div
        ref={containerRef}
        className="gg-main-article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
