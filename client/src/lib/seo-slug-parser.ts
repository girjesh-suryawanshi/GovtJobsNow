import { SearchJobsParams } from "@/types/job";

export interface ParsedSeoRoute {
  type: 'qualification' | 'state' | 'organization' | 'exam' | 'category';
  title: string;
  description: string;
  params: Partial<SearchJobsParams>;
  entityName: string;
}

const states = [
  "andhra-pradesh", "arunachal-pradesh", "assam", "bihar", "chhattisgarh", "goa", "gujarat", 
  "haryana", "himachal-pradesh", "jharkhand", "karnataka", "kerala", "madhya-pradesh", 
  "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", 
  "rajasthan", "sikkim", "tamil-nadu", "telangana", "tripura", "uttar-pradesh", "uttarakhand", "west-bengal",
  "delhi", "jammu-and-kashmir"
];

const qualifications: Record<string, string> = {
  "10th-pass": "10th",
  "12th-pass": "12th",
  "iti": "ITI",
  "diploma": "Diploma",
  "graduate": "Graduate",
  "btech": "B.Tech",
  "post-graduate": "Post Graduate",
};

const organizations: Record<string, string> = {
  "isro": "ISRO",
  "drdo": "DRDO",
  "sbi": "State Bank of India",
  "rbi": "Reserve Bank of India",
  "lic": "Life Insurance Corporation",
  "indian-post": "Indian Post",
  "railway": "Railway",
  "ssc": "Staff Selection Commission",
  "upsc": "Union Public Service Commission",
  "defence": "Defence",
  "army": "Indian Army",
  "navy": "Indian Navy",
  "air-force": "Indian Air Force",
  "bank": "Banking",
};

const exams: Record<string, string> = {
  "ssc-cgl": "SSC CGL",
  "ssc-chsl": "SSC CHSL",
  "ibps-po": "IBPS PO",
  "rrb-ntpc": "RRB NTPC",
  "upsc-cse": "UPSC CSE",
};

const formatTitleCase = (str: string) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const parseSeoSlug = (slug: string): ParsedSeoRoute | null => {
  const currentYear = new Date().getFullYear();

  // 1. Check Exam Routes (e.g., ssc-cgl)
  if (exams[slug]) {
    return {
      type: 'exam',
      entityName: exams[slug],
      title: `${exams[slug]} ${currentYear} - Notification, Eligibility & Latest Vacancies`,
      description: `Get the latest ${exams[slug]} notification ${currentYear}. Check eligibility, salary, exam pattern, selection process, and apply online.`,
      params: { search: exams[slug] }
    };
  }

  // 2. Check State Routes (e.g., government-jobs-in-maharashtra)
  if (slug.startsWith('government-jobs-in-')) {
    const stateSlug = slug.replace('government-jobs-in-', '');
    if (states.includes(stateSlug)) {
      const stateName = formatTitleCase(stateSlug);
      return {
        type: 'state',
        entityName: stateName,
        title: `Government Jobs in ${stateName} ${currentYear} - Latest Sarkari Naukri`,
        description: `Apply online for latest Government Jobs in ${stateName}. Find state govt vacancies, notifications, and recruitment updates for ${currentYear}.`,
        params: { location: stateName }
      };
    }
  }

  // 3. Check Qualification Routes (e.g., 10th-pass-govt-jobs)
  if (slug.endsWith('-govt-jobs')) {
    const qualSlug = slug.replace('-govt-jobs', '');
    if (qualifications[qualSlug]) {
      const qualName = qualifications[qualSlug];
      return {
        type: 'qualification',
        entityName: qualName,
        title: `${qualName} Govt Jobs ${currentYear} - Latest Sarkari Naukri Vacancies`,
        description: `Find latest Government Jobs for ${qualName} pass in ${currentYear}. Apply online for state and central govt vacancies requiring ${qualName} qualification.`,
        params: { qualification: qualName }
      };
    }
  }

  // 4. Check Organization/Category Routes (e.g., isro-jobs, railway-jobs, bank-jobs)
  if (slug.endsWith('-jobs')) {
    const orgSlug = slug.replace('-jobs', '');
    if (organizations[orgSlug]) {
      const orgName = organizations[orgSlug];
      const isBankOrRailway = orgSlug === 'bank' || orgSlug === 'railway' || orgSlug === 'defence';
      return {
        type: isBankOrRailway ? 'category' : 'organization',
        entityName: orgName,
        title: `${orgName} Jobs ${currentYear} - Latest Recruitment & Vacancies`,
        description: `Apply online for the latest ${orgName} Jobs in ${currentYear}. Check upcoming notifications, eligibility, selection process, and salary details.`,
        params: isBankOrRailway ? { jobCategory: orgName } : { department: orgName }
      };
    }
  }

  // If no patterns match, return null to trigger a 404 Not Found
  return null;
};
