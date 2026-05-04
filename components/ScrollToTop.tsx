"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Floating circular scroll-to-top button with a progress ring showing how
// far down the page the user has scrolled. Mirrors the live-site design.
export function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
      setProgress(pct);
      setVisible(scrollTop > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const size = 48;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 h-12 w-12 z-40 transition-transform hover:scale-105"
    >
      <span
        className="absolute inset-0 rounded-full bg-white"
        style={{
          boxShadow:
            "0 4px 16px -4px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.05)",
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e6eaf0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#5E35B1"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <ArrowUp className="h-5 w-5" style={{ color: "#1a1a1a" }} />
      </span>
    </button>
  );
}
