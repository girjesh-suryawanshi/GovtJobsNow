import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section
      className="my-10"
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-xl">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 id="faq-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              openIndex === idx
                ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            }`}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span
                className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-snug"
                itemProp="name"
              >
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p
                className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                itemProp="text"
              >
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
