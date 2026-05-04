"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { allArticles, allCategories } from "@/lib/articles";
import { listOverrides, type ArticleOverride } from "@/lib/overrides";
import { FileText, Search, ChevronRight } from "lucide-react";

export default function AdminDashboardPage() {
  const [overrides, setOverrides] = useState<ArticleOverride[]>([]);

  useEffect(() => {
    setOverrides(listOverrides());
  }, []);

  return (
    <div>
      <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "#003366" }}>
        Dashboard
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "#1a1a1a" }}>
        Manage articles, edit SEO, and review your recent changes.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Articles" value={allArticles.length} />
        <Stat label="Specialties" value={allCategories.length} />
        <Stat label="Pending edits" value={overrides.length} />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <ActionCard
          href="/admin/articles"
          icon={<FileText className="h-5 w-5" />}
          title="Manage articles"
          body="Search the library, edit titles, content, sources, and the per-article SEO."
        />
        <ActionCard
          href="/admin/seo"
          icon={<Search className="h-5 w-5" />}
          title="Bulk SEO editor"
          body="Review every article's meta title and description in one searchable table."
        />
      </div>

      {overrides.length > 0 && (
        <div className="mt-10">
          <h2
            className="text-[18px] font-bold"
            style={{ color: "#003366" }}
          >
            Recent edits
          </h2>
          <ul
            className="mt-4 divide-y rounded-md bg-white overflow-hidden"
            style={{ borderColor: "#cfd8e3", border: "1px solid #cfd8e3" }}
          >
            {overrides.slice(0, 8).map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/admin/articles/edit?slug=${encodeURIComponent(o.slug)}`}
                  className="flex items-center justify-between px-4 py-3 text-[14px] transition-colors hover:bg-[#f4f6fa]"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate" style={{ color: "#003366" }}>
                      {o.title || o.slug}
                    </div>
                    <div className="text-[12px]" style={{ color: "#6B6A6A" }}>
                      Updated {new Date(o.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" style={{ color: "#9ab" }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="mt-10 rounded-md p-5 text-[13.5px]"
        style={{
          backgroundColor: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#7c2d12",
        }}
      >
        <strong>Demo mode:</strong> edits save to your browser's local storage so you
        can preview them. To persist publicly, the next phase wires this up to Supabase.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-md bg-white p-5"
      style={{ border: "1px solid #cfd8e3" }}
    >
      <div className="text-[13px] font-semibold" style={{ color: "#6B6A6A" }}>
        {label}
      </div>
      <div className="mt-1 text-[28px] font-extrabold" style={{ color: "#003366" }}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-md bg-white p-6 transition-shadow hover:shadow-md"
      style={{ border: "1px solid #cfd8e3" }}
    >
      <div
        className="inline-flex h-10 w-10 items-center justify-center rounded-md"
        style={{ backgroundColor: "#E3F2FD", color: "#003366" }}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-[18px] font-bold" style={{ color: "#003366" }}>
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#1a1a1a" }}>
        {body}
      </p>
      <div
        className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold transition-transform group-hover:translate-x-0.5"
        style={{ color: "#5E35B1" }}
      >
        Open <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
