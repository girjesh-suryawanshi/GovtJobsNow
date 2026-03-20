export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  qualification: string;
  deadline: string;
  applyLink: string;
  postedOn: string;
  sourceUrl: string;
  positions: number | null;
  salary: string | null;
  ageLimit: string | null;
  applicationFee: string | null;
  description: string | null;
  selectionProcess: string | null;
  experienceRequired: string | null;
  jobCategory: string | null;
  employmentType: string | null;
  recruitingOrganization: string | null;
  prepGuide: string | null;
  syllabus: string | null;
  notificationFileUrl: string | null;
  applicationStartDate: string | null;
  vacancyBreakdown: string | null;
  viewCount: number | null;
  createdAt: Date | string | null;
}

export interface SearchJobsParams {
  search?: string;
  department?: string;
  jobCategory?: string;
  location?: string;
  qualification?: string;
  salaryRange?: string;
  postedDate?: "today" | "week" | "month";
  sortBy?: "latest" | "deadline" | "title" | "department";
  page?: number;
  limit?: number;
}
