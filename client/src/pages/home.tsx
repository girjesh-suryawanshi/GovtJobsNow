import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import FiltersSidebar from "@/components/filters-sidebar";
import JobCard from "@/components/job-card";
import JobDetailModal from "@/components/job-detail-modal";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Job, SearchJobsParams } from "@/types/job";

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchJobsParams>({
    search: "",
    department: "all-departments",
    location: "",
    qualification: "all-qualifications",
    postedDate: undefined,
    sortBy: "latest",
    page: 1,
    limit: 10,
  });
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          // Convert "all-*" values to empty strings for API
          if (typeof value === "string" && value.startsWith("all-")) {
            return; // Skip "all-*" values
          }
          params.set(key, value.toString());
        }
      });
      const response = await apiRequest("GET", `/api/jobs?${params}`);
      return response.json() as Promise<{ jobs: Job[]; total: number }>;
    },
  });

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (filters: Partial<SearchJobsParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const totalPages = Math.ceil((jobsData?.total || 0) / searchParams.limit!);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection onSearch={handleSearch} onLocationChange={(location) => handleFilterChange({ location })} />
      <StatsSection />
      
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <FiltersSidebar 
              filters={searchParams} 
              onFilterChange={handleFilterChange}
            />
            
            <main className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Latest Government Jobs</h2>
                  <p className="text-gray-600">
                    Showing {jobsData?.jobs?.length || 0} of {jobsData?.total || 0} jobs
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select 
                    value={searchParams.sortBy} 
                    onValueChange={(value) => handleFilterChange({ sortBy: value as any })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-gray-100" : ""}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-gray-100" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobsData?.jobs?.length ? (
                <>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                    {jobsData.jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(searchParams.page! - 1)}
                        disabled={searchParams.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={searchParams.page === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(searchParams.page! + 1)}
                        disabled={searchParams.page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
                  <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
