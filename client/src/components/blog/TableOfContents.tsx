import { useEffect, useRef, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentHtml: string;
}

export function TableOfContents({ contentHtml }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Parse headings from HTML string
  useEffect(() => {
    const container = document.createElement("div");
    container.innerHTML = contentHtml;
    const headings = container.querySelectorAll("h2, h3");
    const parsed: TocItem[] = [];
    headings.forEach((el, idx) => {
      const id = el.id || `heading-${idx}`;
      el.id = id;
      parsed.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName.replace("H", ""), 10),
      });
    });
    setItems(parsed);
  }, [contentHtml]);

  // IntersectionObserver scrollspy
  useEffect(() => {
    if (!items.length) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <List className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contents</span>
      </div>
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
            <button
              onClick={() => handleClick(id)}
              className={`w-full text-left text-xs leading-snug py-1 px-2 rounded-lg transition-all duration-150 ${
                activeId === id
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
