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
      "employmentType": job.employmentType ? job.employmentType.toUpperCase().replace('-', '_') : "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.recruitingOrganization || job.department,
        "sameAs": "https://govtjobsnow.com",
        "logo": "https://govtjobsnow.com/logo.png"
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
      "baseSalary": job.salary ? {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary.replace(/[^\d]/g, '') || "25000",
          "minValue": job.salary.split('-')[0]?.replace(/[^\d]/g, '') || "25000",
          "maxValue": job.salary.split('-')[1]?.replace(/[^\d]/g, '') || "81100",
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
      "url": `https://govtjobsnow.com/job/${job.id}`,
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