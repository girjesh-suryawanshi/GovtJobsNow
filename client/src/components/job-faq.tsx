import React, { useEffect } from "react";
import { type Job } from "@shared/schema";
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
    <div className="py-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions
        </h3>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-muted/50 rounded-xl px-4 bg-card/30 transition-all hover:bg-card/50"
          >
            <AccordionTrigger className="text-sm font-extrabold hover:no-underline py-4 text-left leading-relaxed">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 font-medium">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
