export interface Exam {
  id: string;
  title: string;
  conductingOrganization: string | null;
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: string | null;
  eligibility: string | null;
  ageLimit: string | null;
  vacancies: string | null;
  officialWebsite: string | null;
  resultsDate: string | null;
  admitCardDate: string | null;
  syllabus: string | null;
  examMode: string | null;
  examBrief: string | null;
  slug: string | null;
  notifications: Array<{ label: string; url: string; type: 'file' | 'link' }> | null | any;
  createdAt: Date | string | null;
}
