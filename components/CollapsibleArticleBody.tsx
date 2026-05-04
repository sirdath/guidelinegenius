"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

type AccordionItem = { id: string; title: string; html: string };
type Group = {
  id: string;
  title: string;
  intro: string;
  items: AccordionItem[];
};

// Parse the article HTML into groups (h1) and accordion items (h2 within each group).
// Content before the first <h1>, or content within an <h1> before its first <h2>,
// is treated as "intro" content for that group.
function parseArticle(html: string): Group[] {
  if (typeof window === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const root = doc.body;

  const groups: Group[] = [];
  let currentGroup: Group | null = null;
  let currentItem: AccordionItem | null = null;
  let prefaceNodes: Node[] = [];

  function commitItem() {
    if (currentItem && currentGroup) {
      currentGroup.items.push(currentItem);
      currentItem = null;
    }
  }

  function commitGroup() {
    commitItem();
    if (currentGroup) {
      groups.push(currentGroup);
      currentGroup = null;
    }
  }

  function addNode(node: Node) {
    if (currentItem) {
      currentItem.html += nodeToHtml(node);
    } else if (currentGroup) {
      currentGroup.intro += nodeToHtml(node);
    } else {
      prefaceNodes.push(node);
    }
  }

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType !== 1) {
      addNode(node);
      continue;
    }
    const el = node as Element;
    const tag = el.tagName;

    if (tag === "H1") {
      commitGroup();
      currentGroup = {
        id: makeId(el.textContent ?? "group"),
        title: (el.textContent ?? "").trim(),
        intro: "",
        items: [],
      };
    } else if (tag === "H2" && currentGroup) {
      commitItem();
      currentItem = {
        id: makeId(`${currentGroup.title}-${el.textContent ?? "item"}`),
        title: (el.textContent ?? "").trim(),
        html: "",
      };
    } else {
      addNode(node);
    }
  }
  commitGroup();

  // Preface (rare): wrap as an unnamed group
  if (prefaceNodes.length > 0) {
    const introHtml = prefaceNodes.map(nodeToHtml).join("");
    if (stripTags(introHtml).trim().length > 0) {
      groups.unshift({
        id: "intro",
        title: "",
        intro: introHtml,
        items: [],
      });
    }
  }
  return groups;
}

function nodeToHtml(node: Node): string {
  if (node.nodeType === 1) return (node as Element).outerHTML;
  return node.textContent ?? "";
}

function makeId(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `s-${Math.random().toString(36).slice(2, 8)}`
  );
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

export function CollapsibleArticleBody({ html }: { html: string }) {
  const groups = useMemo(() => parseArticle(html), [html]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // Reset on content change — start fully collapsed (matches live site)
  useEffect(() => {
    setOpenIds(new Set());
  }, [groups]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Total accordion items across all groups
  const allItemIds = useMemo(
    () => groups.flatMap((g) => g.items.map((i) => i.id)),
    [groups],
  );
  const allOpen = allItemIds.length > 0 && allItemIds.every((id) => openIds.has(id));

  function toggleAll() {
    if (allOpen) setOpenIds(new Set());
    else setOpenIds(new Set(allItemIds));
  }

  if (groups.length === 0) {
    return <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div>
      {/* Open all bar */}
      {allItemIds.length > 0 && (
        <div className="flex flex-col items-end gap-1 mb-6">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-colors hover:bg-accent-light"
            style={{
              border: "1px solid #cfd8e3",
              backgroundColor: "#ffffff",
              color: "#1a1a1a",
              fontSize: "13.5px",
              fontWeight: 600,
            }}
          >
            {allOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {allOpen ? "Close all" : "Open all"}
          </button>
          <p className="text-[12px]" style={{ color: "#666" }}>
            Tip: Click <strong>Open all</strong> before using{" "}
            <kbd className="px-1.5 py-0.5 rounded border bg-white text-[11px]" style={{ borderColor: "#ccc" }}>
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 rounded border bg-white text-[11px]" style={{ borderColor: "#ccc" }}>
              F
            </kbd>{" "}
            to search this guideline.
          </p>
        </div>
      )}

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.id}>
            {g.title && (
              <h2
                className="text-[24px] font-bold leading-tight"
                style={{ color: "#1a1a1a" }}
              >
                {g.title}
              </h2>
            )}
            {/* Intro (e.g. References list, or content before first H2 in a group) */}
            {g.intro && stripTags(g.intro).trim().length > 0 && (
              <div
                className="prose-article max-w-none mt-4"
                style={{ color: "#1a1a1a" }}
                dangerouslySetInnerHTML={{ __html: g.intro }}
              />
            )}
            {/* Collapsible accordion items */}
            {g.items.length > 0 && (
              <div className="mt-4 space-y-3">
                {g.items.map((item) => {
                  const isOpen = openIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      className="rounded-md transition-shadow"
                      style={{
                        backgroundColor: "#E3F2FD",
                        boxShadow: isOpen
                          ? "0 6px 18px -8px rgba(0, 51, 102, 0.20)"
                          : "0 1px 2px rgba(0, 51, 102, 0.06)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span
                          className="text-[16px] font-semibold leading-tight"
                          style={{ color: "#003366" }}
                        >
                          {item.title}
                        </span>
                        <ChevronDown
                          className="h-5 w-5 shrink-0 transition-transform duration-200"
                          style={{
                            color: "#3BADFF",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div
                            className="prose-article max-w-none"
                            style={{ color: "#1a1a1a" }}
                            dangerouslySetInnerHTML={{ __html: item.html }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
