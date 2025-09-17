import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import SEOHead from "@/components/seo-head";
import HeroSection from "@/components/hero-section";
import StatsDashboard from "@/components/stats-dashboard";
import FeatureShowcase from "@/components/feature-showcase";
import AdvancedSearchTags from "@/components/advanced-search-tags";
import FiltersSidebar from "@/components/filters-sidebar";
import JobCard from "@/components/job-card";
import JobDetailModal from "@/components/job-detail-modal";
import JobComparison from "@/components/job-comparison";
import JobAlerts from "@/components/job-alerts";
import JobTracker from "@/components/job-tracker";
import ExamCalendar from "@/components/exam-calendar";
import FloatingActionMenu from "@/components/floating-action-menu";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, ChevronLeft, ChevronRight, Bell, Target, Calendar, Filter } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Job, SearchJobsParams } from "@/types/job";

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchJobsParams>({
    search: "",
    department: "all-departments",
    location: "all-locations",
    qualification: "all-qualifications",
    salaryRange: "all-salaries",
    postedDate: undefined,
    sortBy: "latest",
    page: 1,
    limit: 10,
  });
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [compareJobs, setCompareJobs] = useState<Job[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showJobAlerts, setShowJobAlerts] = useState(false);
  const [showJobTracker, setShowJobTracker] = useState(false);
  const [showExamCalendar, setShowExamCalendar] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: jobsData, isLoading, error } = useQuery({
    queryKey: ["/api/jobs", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          // Convert "all-*" values to empty strings for API
          if (typeof value === "string" && value.startsWith("all-")) {
            return; // Skip "all-*" values - don't send them to backend
          }
          params.set(key, value.toString());
        }
      });
      const response = await apiRequest("GET", `/api/jobs?${params}`);
      const data = await response.json() as { jobs: Job[]; total: number };
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for fresh jobs
  });

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleAdvancedSearch = (searchTerms: string[]) => {
    const combinedSearch = searchTerms.join(' OR ');
    setSearchParams(prev => ({ ...prev, search: combinedSearch, page: 1 }));
  };

  const handleCompareJob = (job: Job) => {
    if (compareJobs.find(j => j.id === job.id)) {
      const newCompareJobs = compareJobs.filter(j => j.id !== job.id);
      setCompareJobs(newCompareJobs);
      if (newCompareJobs.length === 0) {
        setShowComparison(false);
      }
    } else if (compareJobs.length < 3) {
      setCompareJobs([...compareJobs, job]);
    }
  };

  const handleFilterChange = (filters: Partial<SearchJobsParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleScrollToDepartments = () => {
    // Scroll to filters section and highlight department filter
    const filtersSection = document.querySelector('[data-testid="filters-sidebar"]');
    if (filtersSection) {
      filtersSection.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the department filter after scrolling
      setTimeout(() => {
        const departmentFilter = filtersSection.querySelector('[data-testid="department-filter"]');
        if (departmentFilter) {
          departmentFilter.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          setTimeout(() => {
            departmentFilter.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }, 3000);
        }
      }, 500);
    }
  };

  // Handle hash-based navigation (e.g., /#departments from job detail page)
  useEffect(() => {
    if (window.location.hash === '#departments') {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        handleScrollToDepartments();
      }, 100);
    }
  }, []);

  const totalPages = Math.ceil((jobsData?.total || 0) / searchParams.limit!);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="GovtJobsNow - Latest Government Jobs, Sarkari Naukri 2025 | 3900+ Govt Jobs"
        description="Find latest government jobs, sarkari naukri notifications 2025. Browse 3900+ verified govt jobs from SSC, Railway, Banking, UPSC, Defence, PSU. Apply for central & state government jobs online."
        keywords="government jobs, sarkari naukri, govt jobs 2025, SSC jobs, railway jobs, banking jobs, UPSC jobs, latest govt jobs, central government jobs, state government jobs, sarkari result, govt job portal, indian government jobs, sarkari naukri 2025"
        url="https://govtjobsnow.com"
      />
      <Header 
        onOpenExamCalendar={() => setShowExamCalendar(true)}
        onScrollToDepartments={handleScrollToDepartments}
      />
      <HeroSection onSearch={handleSearch} onLocationChange={(location) => handleFilterChange({ location })} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <StatsDashboard />
      </div>
      
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <FiltersSidebar 
              filters={searchParams} 
              onFilterChange={handleFilterChange}
              isOpen={isMobileFiltersOpen}
              onToggle={() => setIsMobileFiltersOpen(false)}
            />
            
            <main className="lg:w-3/4">
              <AdvancedSearchTags 
                onAdvancedSearch={handleAdvancedSearch}
                currentSearch={searchParams.search || ""}
              />
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Show Filters
                </Button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Latest Government Jobs</h2>
                  <p className="text-gray-600">
                    Showing {jobsData?.jobs?.length || 0} of {jobsData?.total || 0} jobs
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {compareJobs.length > 0 && (
                      <Button 
                        variant="default" 
                        onClick={() => setShowComparison(true)}
                      >
                        View Comparison ({compareJobs.length}/3)
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => setShowJobAlerts(true)}
                      className="flex items-center gap-2"
                    >
                      <Bell className="h-4 w-4" />
                      Job Alerts
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowJobTracker(true)}
                      className="flex items-center gap-2"
                    >
                      <Target className="h-4 w-4" />
                      Track Applications
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowExamCalendar(true)}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Exam Calendar
                    </Button>
                  </div>
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
                        onCompare={() => handleCompareJob(job)}
                        isComparing={compareJobs.some(j => j.id === job.id)}
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

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
      
      {showComparison && compareJobs.length > 0 && (
        <JobComparison
          jobs={compareJobs}
          onRemove={(jobId) => {
            const newCompareJobs = compareJobs.filter(j => j.id !== jobId);
            setCompareJobs(newCompareJobs);
            if (newCompareJobs.length === 0) {
              setShowComparison(false);
            }
          }}
          onClose={() => {
            setShowComparison(false);
            setCompareJobs([]);
          }}
        />
      )}
      
      <JobAlerts
        isOpen={showJobAlerts}
        onClose={() => setShowJobAlerts(false)}
      />
      
      <JobTracker
        isOpen={showJobTracker}
        onClose={() => setShowJobTracker(false)}
        jobToAdd={selectedJob || undefined}
      />
      
      <ExamCalendar
        isOpen={showExamCalendar}
        onClose={() => setShowExamCalendar(false)}
      />
      
      <FloatingActionMenu
        onOpenJobAlerts={() => setShowJobAlerts(true)}
        onOpenJobTracker={() => setShowJobTracker(true)}
        onOpenExamCalendar={() => setShowExamCalendar(true)}
      />

      <FeatureShowcase />
      
      <Footer />
    </div>
  );
}
