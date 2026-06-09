import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import JobCard from "@/components/job-card";
import FiltersSidebar from "@/components/filters-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, ChevronLeft, ChevronRight, Building2, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { parseSeoSlug, type ParsedSeoRoute } from "@/lib/seo-slug-parser";
import NotFound from "@/pages/not-found";
import type { Job, SearchJobsParams } from "@/types/job";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DynamicSeoLandingPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [routeConfig, setRouteConfig] = useState<ParsedSeoRoute | null>(null);
  
  useEffect(() => {
    if (slug) {
      const parsed = parseSeoSlug(slug);
      setRouteConfig(parsed);
    }
  }, [slug]);

  // If slug is explicitly invalid after mounting
  if (slug && routeConfig === null && parseSeoSlug(slug) === null) {
    return <NotFound />;
  }

  const defaultParams: SearchJobsParams = {
    search: "",
    department: "all-departments",
    jobCategory: "all-categories",
    location: "all-locations", 
    qualification: "all-qualifications",
    salaryRange: "all-salaries",
    postedDate: undefined,
    sortBy: "latest",
    page: 1,
    limit: 20,
    ...routeConfig?.params
  };

  const [searchParams, setSearchParams] = useState<SearchJobsParams>(defaultParams);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Re-sync params if routeConfig changes
  useEffect(() => {
    if (routeConfig) {
      setSearchParams(prev => ({ ...prev, ...routeConfig.params, page: 1 }));
    }
  }, [routeConfig]);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== "all-departments" && value !== "all-locations" && value !== "all-qualifications" && value !== "all-salaries" && value !== "all-categories") {
          params.append(key, value.toString());
        }
      });
      
      const response = await apiRequest("GET", `/api/jobs?${params.toString()}`);
      return response.json() as Promise<{ jobs: Job[]; total: number }>;
    },
    enabled: !!routeConfig
  });

  const handleFilterChange = (filters: Partial<SearchJobsParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // Generate dynamic FAQs for Schema and UI based on entity
  const generateFaqs = (config: ParsedSeoRoute) => {
    const currentYear = new Date().getFullYear();
    const entity = config.entityName;
    return [
      {
        q: `Who can apply for ${entity} jobs?`,
        a: config.type === 'qualification' 
          ? `Candidates who have completed their ${entity} from a recognized board or university are fully eligible to apply for these vacancies. Specific age limits and physical requirements may vary depending on the exact post.`
          : `Eligibility for ${entity} recruitment varies by post. Generally, candidates must meet specific age limits (usually 18-30 years with category relaxations) and possess the required educational qualifications as mentioned in the official notification.`
      },
      {
        q: `What is the selection process for ${entity} recruitment ${currentYear}?`,
        a: `The standard selection process typically involves a Written Examination (CBT), followed by a Physical Efficiency Test (PET) or Skill Test if applicable, and concludes with Document Verification (DV) and a Medical Examination.`
      },
      {
        q: `How to apply online for ${entity} vacancies?`,
        a: `To apply, visit the official website mentioned in the job notification, register your profile, fill out the online application form with accurate details, upload the required scanned documents, pay the application fee, and submit before the final deadline.`
      }
    ];
  };

  useEffect(() => {
    if (routeConfig && jobsData?.jobs) {
      // Inject ItemList Schema
      const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": jobsData.jobs.map((job, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://govtjobnow.com/job/${job.slug || job.id}`
        }))
      };
      
      // Inject FAQ Schema
      const faqs = generateFaqs(routeConfig);
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };

      const script1 = document.createElement("script");
      script1.type = "application/ld+json";
      script1.id = "dynamic-seo-itemlist";
      script1.text = JSON.stringify(itemListSchema);
      
      const script2 = document.createElement("script");
      script2.type = "application/ld+json";
      script2.id = "dynamic-seo-faq";
      script2.text = JSON.stringify(faqSchema);
      
      document.head.appendChild(script1);
      document.head.appendChild(script2);

      return () => {
        const el1 = document.getElementById("dynamic-seo-itemlist");
        const el2 = document.getElementById("dynamic-seo-faq");
        if (el1) document.head.removeChild(el1);
        if (el2) document.head.removeChild(el2);
      };
    }
  }, [routeConfig, jobsData]);

  if (!routeConfig) return null;

  const totalPages = Math.ceil((jobsData?.total || 0) / searchParams.limit!);
  const currentYear = new Date().getFullYear();
  const faqs = generateFaqs(routeConfig);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={routeConfig.title}
        description={routeConfig.description}
        keywords={`${routeConfig.entityName}, government jobs, sarkari naukri, ${currentYear} recruitment, apply online`}
        url={`https://govtjobnow.com/${slug}`}
      />
      
      <Header />
      
      {/* Hero Section */}
      <div className="page-hero mb-8" style={{ borderRadius: '0 0 20px 20px', textAlign: 'left' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs 
            items={[
              { label: routeConfig.type.charAt(0).toUpperCase() + routeConfig.type.slice(1) }, 
              { label: routeConfig.entityName }
            ]} 
            className="mb-4 text-blue-100" 
          />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{routeConfig.entityName} Jobs {currentYear}</h1>
              <p className="text-xl text-blue-100 mb-6 max-w-3xl">
                {routeConfig.description}
              </p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* AEO / GEO Entity Semantic Content Block */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Overview: {routeConfig.entityName} Recruitment
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to the dedicated portal for <strong>{routeConfig.entityName}</strong> vacancies. The Government of India and respective state authorities release numerous notifications annually. This page automatically tracks and aggregates all official job postings matching the {routeConfig.entityName} criteria, providing a single source of truth for your exam preparation and application process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" /> Eligibility Criteria
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Age Limit:</strong> Typically 18 to 30 years (relaxations apply for SC/ST/OBC).</li>
                <li>• <strong>Nationality:</strong> Must be a citizen of India.</li>
                <li>• <strong>Verification:</strong> Must possess original documents during the final DV round.</li>
              </ul>
            </div>
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" /> Selection Process
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>1. Computer Based Test (CBT) / Written Exam</li>
                <li>2. Physical Efficiency Test (PET) / Skill Test</li>
                <li>3. Document Verification (DV)</li>
                <li>4. Medical Examination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dynamic Jobs Listing */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <FiltersSidebar 
            filters={searchParams} 
            onFilterChange={handleFilterChange}
          />
          
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Latest {routeConfig.entityName} Notifications
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="hidden sm:flex items-center border border-gray-300 rounded-lg">
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-r-none">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-l-none">
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsData?.jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs found</h3>
                <p className="text-gray-600">Please check back later or adjust your filters.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {jobsData?.jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    onClick={() => {}}
                    onCompare={() => {}}
                    isComparing={false}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" onClick={() => handlePageChange(searchParams.page! - 1)} disabled={searchParams.page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button key={page} variant={searchParams.page === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)}>
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button variant="outline" onClick={() => handlePageChange(searchParams.page! + 1)} disabled={searchParams.page === totalPages}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Semantic FAQ Section for AEO */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>
          
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-100 rounded-2xl px-5 bg-white transition-all shadow-sm data-[state=open]:border-blue-100 data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-[15px] font-bold hover:no-underline py-5 text-left leading-relaxed text-gray-900">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-600 leading-relaxed pb-5 font-medium border-t border-gray-50 pt-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </div>

      <Footer />
    </div>
  );
}
