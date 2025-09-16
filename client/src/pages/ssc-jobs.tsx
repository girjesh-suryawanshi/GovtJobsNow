import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import JobCard from "@/components/job-card";
import FiltersSidebar from "@/components/filters-sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, ChevronLeft, ChevronRight, Building2, Users, TrendingUp, Award } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Job, SearchJobsParams } from "@/types/job";

export default function SSCJobs() {
  const [searchParams, setSearchParams] = useState<SearchJobsParams>({
    search: "",
    department: "Staff Selection Commission",
    location: "all-locations", 
    qualification: "all-qualifications",
    salaryRange: "all-salaries",
    postedDate: undefined,
    sortBy: "latest",
    page: 1,
    limit: 20,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });
      
      const response = await apiRequest("GET", `/api/jobs?${params.toString()}`);
      return response.json() as Promise<{ jobs: Job[]; total: number }>;
    },
  });

  const handleFilterChange = (filters: Partial<SearchJobsParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const totalPages = Math.ceil((jobsData?.total || 0) / searchParams.limit!);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="SSC Jobs 2025 - Latest Staff Selection Commission Vacancies | GovtJobsNow"
        description="Apply for latest SSC jobs 2025. Find Staff Selection Commission vacancies including SSC CGL, CHSL, MTS, Stenographer, JE, GD Constable. Get SSC exam dates, eligibility, salary details."
        keywords="SSC jobs, staff selection commission, SSC CGL, SSC CHSL, SSC MTS, SSC JE, SSC GD, SSC stenographer, SSC exam 2025, SSC notification, SSC vacancy, government jobs SSC"
        url="https://govtjobsnow.com/jobs/ssc"
      />
      
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">SSC Jobs 2025</h1>
              <p className="text-xl text-blue-100 mb-6">
                Latest Staff Selection Commission Vacancies & Notifications
              </p>
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>Central Government</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>All India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Competitive Exams</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold">{jobsData?.total || 0}</div>
                <div className="text-blue-100">Active Vacancies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About SSC Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Staff Selection Commission (SSC)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Staff Selection Commission (SSC) is a government organization under the Department of Personnel and Training, 
                Government of India. It conducts various competitive examinations to recruit staff for different posts in 
                ministries and departments of the Government of India and in subordinate offices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                SSC conducts major examinations like Combined Graduate Level (CGL), Combined Higher Secondary Level (CHSL), 
                Multi-Tasking Staff (MTS), Junior Engineer (JE), and General Duty Constable (GD) exams throughout the year.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular SSC Exams</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SSC CGL</span>
                  <span className="text-blue-600 font-medium">Graduate Level</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SSC CHSL</span>
                  <span className="text-blue-600 font-medium">12th Pass</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SSC MTS</span>
                  <span className="text-blue-600 font-medium">10th Pass</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SSC JE</span>
                  <span className="text-blue-600 font-medium">Engineering</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SSC GD</span>
                  <span className="text-blue-600 font-medium">10th Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar 
            filters={searchParams} 
            onFilterChange={handleFilterChange}
          />
          
          <main className="lg:w-3/4">
            {/* Jobs Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  SSC Jobs ({jobsData?.total || 0})
                </h2>
                <p className="text-gray-600 mt-1">Latest Staff Selection Commission job notifications</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select value={searchParams.sortBy} onValueChange={(value) => handleFilterChange({ sortBy: value as "latest" | "deadline" | "department" | "title" })}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Cards */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsData?.jobs.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No SSC jobs found</h3>
                <p className="text-gray-600">Try adjusting your filters to find more opportunities.</p>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {jobsData?.jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    onCompare={() => {}}
                    isComparing={false}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(searchParams.page! - 1)}
                  disabled={searchParams.page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={searchParams.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-gray-500">...</span>}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(searchParams.page! + 1)}
                  disabled={searchParams.page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}