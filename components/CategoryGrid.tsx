"use client";
import { useState, useEffect, useMemo } from "react";
import { CategoryCard } from "./CategoryCard";
import type { Category } from "@/lib/articles";
import { LayoutGrid, Grid3x3, Grid2x2, ArrowUpDown } from "lucide-react";

const COLS_KEY = "gg_category_grid_cols";
const SORT_KEY = "gg_category_sort";

type Cols = 3 | 4 | 5;
type SortMode = "alpha-asc" | "alpha-desc" | "count-desc" | "count-asc";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "alpha-asc", label: "A → Z" },
  { value: "alpha-desc", label: "Z → A" },
  { value: "count-desc", label: "Most articles first" },
  { value: "count-asc", label: "Fewest articles first" },
];

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const [cols, setCols] = useState<Cols>(3);
  const [sort, setSort] = useState<SortMode>("alpha-asc");
  const [sortOpen, setSortOpen] = useState(false);

  // Restore preferences
  useEffect(() => {
    try {
      const savedCols = localStorage.getItem(COLS_KEY);
      if (savedCols === "4" || savedCols === "5" || savedCols === "3") {
        setCols(parseInt(savedCols, 10) as Cols);
      }
      const savedSort = localStorage.getItem(SORT_KEY);
      if (
        savedSort === "alpha-asc" ||
        savedSort === "alpha-desc" ||
        savedSort === "count-desc" ||
        savedSort === "count-asc"
      ) {
        setSort(savedSort);
      }
    } catch {}
  }, []);

  // Close the sort menu on outside click
  useEffect(() => {
    if (!sortOpen) return;
    function onDoc(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-sort-menu]")) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [sortOpen]);

  function updateCols(c: Cols) {
    setCols(c);
    try {
      localStorage.setItem(COLS_KEY, String(c));
    } catch {}
  }
  function updateSort(s: SortMode) {
    setSort(s);
    setSortOpen(false);
    try {
      localStorage.setItem(SORT_KEY, s);
    } catch {}
  }

  const sorted = useMemo(() => {
    const arr = [...categories];
    arr.sort((a, b) => {
      if (sort === "alpha-asc") return a.name.localeCompare(b.name);
      if (sort === "alpha-desc") return b.name.localeCompare(a.name);
      if (sort === "count-desc") return b.articleCount - a.articleCount;
      if (sort === "count-asc") return a.articleCount - b.articleCount;
      return 0;
    });
    return arr;
  }, [categories, sort]);

  const gridClass =
    cols === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
      : cols === 4
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-6xl"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-7xl";

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  return (
    <>
      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {/* Sort dropdown */}
        <div className="relative" data-sort-menu>
          <button
            type="button"
            onClick={() => setSortOpen((s) => !s)}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md transition-colors hover:bg-white"
            style={{
              border: "1.5px solid #cfd8e3",
              backgroundColor: "#ffffff",
              color: "#003366",
            }}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-[13.5px] font-semibold">Sort: {currentSortLabel}</span>
          </button>
          {sortOpen && (
            <ul
              role="listbox"
              className="absolute left-0 top-full mt-2 z-30 w-56 rounded-md border bg-white py-1.5 shadow-lg"
              style={{ borderColor: "#cfd8e3" }}
            >
              {SORT_OPTIONS.map((opt) => {
                const active = sort === opt.value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => updateSort(opt.value)}
                      className="w-full text-left px-4 py-2 text-[13.5px] transition-colors hover:bg-[#f4f6fa]"
                      style={{
                        color: active ? "#003366" : "#1a1a1a",
                        fontWeight: active ? 700 : 400,
                        backgroundColor: active ? "#eaf3fc" : "transparent",
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Column toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] mr-1" style={{ color: "#1a1a1a" }}>
            View:
          </span>
          <ToggleButton active={cols === 3} onClick={() => updateCols(3)} label="3 columns">
            <Grid2x2 className="h-4 w-4" />
            <span className="ml-1.5 text-[13px] font-semibold">3</span>
          </ToggleButton>
          <ToggleButton active={cols === 4} onClick={() => updateCols(4)} label="4 columns">
            <Grid3x3 className="h-4 w-4" />
            <span className="ml-1.5 text-[13px] font-semibold">4</span>
          </ToggleButton>
          <ToggleButton active={cols === 5} onClick={() => updateCols(5)} label="5 columns">
            <LayoutGrid className="h-4 w-4" />
            <span className="ml-1.5 text-[13px] font-semibold">5</span>
          </ToggleButton>
        </div>
      </div>

      <div className={`mt-6 mx-auto grid gap-5 ${gridClass}`}>
        {sorted.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="inline-flex items-center h-9 px-3 rounded-md transition-colors"
      style={{
        backgroundColor: active ? "#003366" : "#ffffff",
        color: active ? "#ffffff" : "#003366",
        border: `1.5px solid ${active ? "#003366" : "#cfd8e3"}`,
      }}
    >
      {children}
    </button>
  );
}
