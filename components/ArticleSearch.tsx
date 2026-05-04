"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useState, useTransition } from "react";

export function ArticleSearch({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (value) next.set("q", value);
    else next.delete("q");
    start(() => router.push(`/articles?${next.toString()}`));
  }

  return (
    <form onSubmit={submit} className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search articles…"
        className="w-full h-11 rounded-ui-sm border border-line bg-white pl-11 pr-4 text-[14px] text-ink-headline placeholder:text-ink-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-ink-muted">
          …
        </div>
      )}
    </form>
  );
}
