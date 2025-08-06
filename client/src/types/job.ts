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
  positions?: number | null;
  salary?: string | null;
  ageLimit?: string | null;
  applicationFee?: string | null;
  description?: string | null;
  selectionProcess?: string | null;
  createdAt: Date | null;
}

export interface SearchJobsParams {
  search?: string;
  department?: string;
  location?: string;
  qualification?: string;
  postedDate?: "today" | "week" | "month";
  sortBy?: "latest" | "deadline" | "title" | "department";
  page?: number;
  limit?: number;
}
