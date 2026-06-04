import { Lightbulb, ChevronRight } from "lucide-react";

interface KeyTakeawaysCardProps {
  excerpt: string;
  title?: string;
}

export function KeyTakeawaysCard({ excerpt, title = "Key Takeaways & Executive Summary" }: KeyTakeawaysCardProps) {
  // Try to parse excerpt into bullet points (split on ". " or "\n")
  const sentences = excerpt
    .split(/\.\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 5);

  return (
    <aside
      className="relative my-8 rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30"
      aria-label="Key Takeaways"
    >
      {/* Decorative left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-l-2xl" />

      <div className="pl-6 pr-5 py-5">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {/* Takeaways list */}
        {sentences.length > 1 ? (
          <ul className="space-y-2.5" itemScope itemType="https://schema.org/ItemList">
            {sentences.map((sentence, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                itemProp="itemListElement"
              >
                <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{sentence}{sentence.endsWith(".") ? "" : "."}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{excerpt}</p>
        )}
      </div>
    </aside>
  );
}
