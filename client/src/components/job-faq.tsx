import React, { useEffect } from "react";
import { type Job } from "@/types/job";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface JobFAQProps {
  job: Job;
}

/**
 * JobFAQ component that displays frequently asked questions about the job.
 * Crucially, it injects JSON-LD FAQ Schema into the document head for SEO (Google Rich Snippets).
 */
export const JobFAQ: React.FC<JobFAQProps> = ({ job }) => {
  const faqs = [
    {
      q: `What is the last date to apply for ${job.title}?`,
      a: `The final deadline for submitting your online application for ${job.title} is ${job.deadline}. We recommend applying at least 2-3 days before the closing date to avoid technical issues.`
    },
    {
      q: `What are the qualification requirements for this position at ${job.recruitingOrganization || job.department}?`,
      a: `To be eligible for this recruitment, candidates must possess ${job.qualification}. Please ensure you meet all specific educational and experience criteria before applying.`
    },
    {
      q: `What is the salary scale for ${job.title}?`,
      a: job.salary 
        ? `The offered salary for this position is ${job.salary}. Additionally, selected candidates may be eligible for allowances and benefits as per the organization's rules.`
        : `The salary details for this specific role follow the official pay scale of ${job.recruitingOrganization || job.department}. Refer to the official notification for the complete pay structure.`
    },
    {
      q: `Is there any application fee for this job?`,
      a: job.applicationFee && job.applicationFee !== "0" && job.applicationFee.toLowerCase() !== "nil"
        ? `Yes, the application fee is ${job.applicationFee}. Candidates should pay the fee through the prescribed online payment gateway before the deadline.`
        : `There is no application fee for this recruitment, or it is exempt for most categories. Please verify your specific category in the official notification.`
    }
  ];

  // Inject JSON-LD Schema on mount
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `faq-schema-${job.id}`;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`faq-schema-${job.id}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [job, faqs]);

  return (
    <section className="page-section p-6 md:p-8 space-y-6">
      <div className="flex items-center space-x-3 mb-2 border-b border-[var(--gjn-border)] pb-4">
        <HelpCircle className="h-6 w-6 text-[var(--gjn-blue)]" />
        <h3 className="text-xl md:text-2xl font-sans font-extrabold tracking-tight" style={{ color: 'var(--gjn-blue)' }}>
          Frequently Asked Questions
        </h3>
      </div>

      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-gray-100 rounded-2xl px-5 bg-white transition-all shadow-sm data-[state=open]:border-blue-100 data-[state=open]:shadow-md"
          >
            <AccordionTrigger className="text-[15px] font-bold hover:no-underline py-5 text-left leading-relaxed text-gray-900">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] text-gray-600 leading-relaxed pb-5 font-medium border-t border-gray-50 pt-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
