import { useEffect } from 'react';
import type { Job } from '@/types/job';

interface JobPostingSchemaProps {
  job: Job;
}

export default function JobPostingSchema({ job }: JobPostingSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description || `Join ${job.department} as ${job.title}. Qualification required: ${job.qualification}. ${job.selectionProcess || 'Apply through the official website.'}`,
      "identifier": {
        "@type": "PropertyValue",
        "name": job.department,
        "value": job.id
      },
      "datePosted": job.postedOn,
      "validThrough": job.deadline,
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.department,
        "sameAs": "https://govtjobsnow.com"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location,
          "addressCountry": "IN"
        }
      },
      "baseSalary": job.salary ? {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary.replace(/[^\d]/g, ''),
          "unitText": "YEAR"
        }
      } : undefined,
      "qualifications": job.qualification,
      "responsibilities": job.description || `Responsibilities include duties as ${job.title} in ${job.department}`,
      "skills": job.qualification,
      "educationRequirements": job.qualification,
      "experienceRequirements": job.ageLimit || "As per official notification",
      "applicationContact": {
        "@type": "ContactPoint",
        "contactType": "HR",
        "url": job.applyLink || job.sourceUrl
      },
      "url": job.applyLink || job.sourceUrl,
      "salaryCurrency": "INR",
      "jobBenefits": "Government job benefits, pension, medical allowance, job security",
      "industry": "Government",
      "occupationalCategory": "Government Service",
      "workHours": "Full-time government position"
    };

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));
    script.innerHTML = JSON.stringify(cleanSchema);
    
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [job]);

  return null;
}