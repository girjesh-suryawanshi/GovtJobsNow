import { useEffect } from 'react';
import type { Job } from '@/types/job';

interface JobPostingSchemaProps {
  job: Job;
}

const parseSalary = (salary?: string) => {
  if (!salary) return null;
  const matches = salary.match(/\d+(?:,\d+)*(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const numbers = matches.map(m => parseInt(m.replace(/,/g, ''), 10));
  if (numbers.length === 1) return { min: numbers[0].toString(), max: numbers[0].toString() };
  return { min: numbers[0].toString(), max: numbers[1].toString() };
};

export default function JobPostingSchema({ job }: JobPostingSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `job-schema-${job.id}`;
    
    // Clean up any existing schema
    const existing = document.getElementById(`job-schema-${job.id}`);
    if (existing) existing.remove();

    const salaryData = parseSalary(job.salary || undefined);

    
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
      "employmentType": job.employmentType ? job.employmentType.toUpperCase().replace('-', '_') : "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.recruitingOrganization || job.department,
        "sameAs": job.sourceUrl || "https://govtjobnow.com",
        "logo": "https://govtjobnow.com/logo.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location,
          "addressRegion": job.location,
          "addressCountry": "IN"
        }
      },
      "baseSalary": salaryData ? {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": salaryData.min === salaryData.max ? salaryData.min : undefined,
          "minValue": salaryData.min !== salaryData.max ? salaryData.min : undefined,
          "maxValue": salaryData.min !== salaryData.max ? salaryData.max : undefined,
          "unitText": "MONTH"
        }
      } : undefined,
      "qualifications": job.qualification,
      "experienceRequirements": {
        "@type": "OccupationalExperienceRequirements",
        "monthsOfExperience": job.experienceRequired?.toLowerCase().includes('fresh') ? 0 : 12
      },
      "responsibilities": job.description || `Responsibilities include duties as ${job.title} in ${job.department}`,
      "skills": job.qualification,
      "educationRequirements": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": job.qualification
      },
      "applicationContact": {
        "@type": "ContactPoint",
        "contactType": "HR",
        "url": job.applyLink || job.sourceUrl
      },
      "url": `https://govtjobnow.com/job/${job.id}`,
      "salaryCurrency": "INR",
      "jobBenefits": "Government job benefits, pension, medical allowance, job security",
      "industry": job.jobCategory || "Government",
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