import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, MapPin, Users, Calendar, IndianRupee, Bookmark,
  Share2, ExternalLink, FileText, MessageCircle, Send, Facebook,
  Building2, Sparkles, BookOpen, ShieldCheck, Target, Download, ChevronRight,
  GraduationCap, Briefcase, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import OrganizationLogo from "@/components/organization-logo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import JobPostingSchema from "@/components/job-posting-schema";
import { AdUnit } from "@/components/ad-unit";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedJobs } from "@/components/related-jobs";
import { JobSidebar } from "@/components/job-sidebar";
import { TrendingJobs } from "@/components/trending-jobs";
import { JobFAQ } from "@/components/job-faq";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Job } from "@/types/job";
import { type SiteSettings } from "@shared/schema";
import SocialShare from "@/components/social-share";
import ReactMarkdown from "react-markdown";

interface JobPosition {
  id: string;
  positionName: string;
  qualification: string;
  experienceRequired?: string;
  salaryRange?: string;
  numberOfVacancies: number;
  specificRequirements?: string;
}

export default function JobDetail() {
  const { slug } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs/slug", slug],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/jobs/slug/${slug}`);
      return response.json() as Promise<Job>;
    },
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["/api/jobs", job?.id, "positions"],
    enabled: !!job,
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/jobs/${job?.id}/positions`);
      return response.json() as Promise<JobPosition[]>;
    },
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  if (isLoading) return <div className="min-h-screen bg-gray-50"><Header /><div className="p-20 text-center text-gray-400 font-bold animate-pulse">Scanning official database...</div></div>;
  if (!job) return <div className="min-h-screen bg-gray-50"><Header /><div className="p-20 text-center">Job Not Found</div></div>;



  const handleTrackJob = () => {
    const saved = localStorage.getItem('gj_tracker_apps');
    const apps = saved ? JSON.parse(saved) : [];
    if (!apps.some((a: any) => a.jobId === job.id?.toString())) {
      const newApp = {
        id: Date.now().toString(),
        jobId: job.id?.toString(),
        jobTitle: job.title,
        department: job.department,
        appliedDate: new Date().toISOString().split('T')[0],
        deadline: job.deadline,
        status: 'applied',
        notes: '',
        documents: []
      };
      localStorage.setItem('gj_tracker_apps', JSON.stringify([newApp, ...apps]));
      toast({ title: "Job Tracked", description: "Monitoring milestones for " + job.title });
    } else {
      toast({ title: "Already Tracking", description: "This job is already in your monitor." });
    }
  };

  const isVerified = job.sourceUrl.includes('.gov.in') || job.sourceUrl.includes('.nic.in');

  // Robust Markdown Parser to split sections
  const rawDescription = job?.description || "";
  // Split by markdown h3 headers `### `
  const descriptionChunks = rawDescription.split(/(?=###\s+)/);

  let quickSummary = "";
  let keyTakeaways = "";
  let importantDocuments = "";
  let selectionProcessMd = "";
  let commonMistakes = "";
  let whoCanApply = "";
  let howToApply = "";
  let otherChunks: string[] = [];

  descriptionChunks.forEach(chunk => {
    const lowerChunk = chunk.toLowerCase();
    if (lowerChunk.includes("quick summary") || (!chunk.trim().startsWith("###") && chunk.trim().length > 0)) {
      // It's the quick summary, or the first intro chunk for older jobs
      quickSummary = chunk;
    } else if (lowerChunk.includes("key takeaways")) {
      keyTakeaways = chunk;
    } else if (lowerChunk.includes("important document")) {
      importantDocuments = chunk;
    } else if (lowerChunk.includes("selection process")) {
      selectionProcessMd = chunk;
    } else if (lowerChunk.includes("common mistake") || lowerChunk.includes("what to check")) {
      commonMistakes = chunk;
    } else if (lowerChunk.includes("who can apply")) {
      whoCanApply = chunk;
    } else if (lowerChunk.includes("how to apply")) {
      howToApply = chunk;
    } else {
      if (chunk.trim().length > 0) {
        otherChunks.push(chunk);
      }
    }
  });

  const customMarkdownComponents = {
    h3: ({ node, ...props }: any) => (
      <h3 className="text-xl md:text-2xl font-syne font-bold mb-4 pb-4 border-b border-[var(--gjn-border)] flex items-center gap-2" style={{ color: 'var(--gjn-blue)' }} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="space-y-4 my-6 list-none pl-0" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="flex items-start gap-3">
        <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0 text-lg leading-none">✦</span>
        <span className="text-gray-700 leading-relaxed text-[15px]">{props.children}</span>
      </li>
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-gray-700 leading-relaxed my-5 text-[15px]" {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="p-5 bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-600 rounded-r-xl italic text-blue-900 my-8 shadow-sm font-medium" {...props} />
    )
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gjn-bg)' }}>
      <SEOHead
        title={`${job.title} - ${job.department} | GovtJobNow Official`}
        description={`Official notification for ${job.title} in ${job.department}. Apply before ${job.deadline}.`}
        url={`https://govtjobnow.com/job/${job.slug || job.id}`}
      />
      <JobPostingSchema job={job} />
      <Header onScrollToDepartments={() => window.location.href = '/#departments'} />

      {/* Sticky Professional Sub-Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm transition-all duration-300 transform ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`} style={{ background: 'rgba(26, 63, 168, 0.95)', borderBottom: '1px solid var(--gjn-blue2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden text-sm">
            <div className="hidden sm:block p-1 bg-white rounded-full">
              <OrganizationLogo department={job?.recruitingOrganization || job?.department || ""} className="h-7 w-7" />
            </div>
            <p className="font-syne font-black text-white truncate max-w-[200px] md:max-w-md">{job?.title}</p>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#overview" className="text-xs font-black uppercase tracking-widest text-blue-200 hover:text-white transition-colors">Overview</a>
            <a href="#vacancies" className="text-xs font-black uppercase tracking-widest text-blue-200 hover:text-white transition-colors">Vacancies</a>
            <a href="#timeline" className="text-xs font-black uppercase tracking-widest text-blue-200 hover:text-white transition-colors">Timeline</a>
            <a href="#documents" className="text-xs font-black uppercase tracking-widest text-blue-200 hover:text-white transition-colors">Documents</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex gjn-btn-primary" onClick={() => window.open(job?.notificationFileUrl || job?.sourceUrl || '#', '_blank')}>
              Apply Now
            </button>
            <SocialShare
              url={window.location.href}
              title={job?.title || ""}
              trigger={
                <button className="flex items-center justify-center h-9 w-9 rounded-xl" style={{ border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent' }}>
                  <Share2 className="h-4 w-4 text-white" />
                </button>
              }
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BACK + BREADCRUMB */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Link href="/">
            <button className="flex items-center font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--gjn-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
          </Link>

          <Breadcrumbs
            items={[
              { label: job.jobCategory || "Jobs", href: "/#departments" },
              { label: job.title }
            ]}
          />
        </div>

        <div id="overview" className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          {/* FEATURED IMAGE BANNER */}
          {(job as any).featuredImageUrl && (
            <div className="w-full bg-gray-50 flex justify-center border-b border-gray-100">
              <img 
                src={(job as any).featuredImageUrl} 
                alt={`${job.title} Notification Banner`} 
                className="w-full h-auto aspect-video object-contain"
              />
            </div>
          )}
          
          {/* 🔹 HEADER */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-8 md:p-10 m-4 md:m-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              
              {/* Left Side: Logo, Title, Meta */}
              <div className="flex flex-col max-w-full lg:max-w-[75%]">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shadow-sm mb-6">
                  <OrganizationLogo
                    department={job.department || ""}
                    className="h-12 w-12"
                  />
                </div>

                <div>
                  <h1 className="text-3xl md:text-[40px] lg:text-[48px] font-sans font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-left text-gray-900" style={{ color: 'var(--gjn-blue)' }}>
                    {job.title}
                  </h1>

                  <p className="text-lg md:text-xl font-medium text-gray-500 mt-3 md:mt-4 mb-4 md:mb-5">
                    {job.department || "Department"} • {job.location || "India"}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4 md:mt-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <p className="text-base md:text-lg text-gray-600 font-medium">
                        Posted On: {job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-400" />
                      <p className="text-base md:text-lg text-red-600 font-medium">
                        Last Date: {job.deadline || "Check notification"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex flex-col sm:flex-row items-center lg:justify-end gap-3 md:gap-4 shrink-0 mt-4 lg:mt-0">
                <button
                  className="w-full sm:w-[200px] h-14 md:h-16 rounded-2xl text-lg font-bold bg-[var(--gjn-blue)] text-white hover:bg-blue-900 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 whitespace-nowrap px-6"
                  onClick={() => window.open(job.sourceUrl || '#', '_blank')}
                >
                  <Send className="h-5 w-5" /> Apply Now
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  title={isSaved ? "Saved" : "Save Job"}
                  className="w-full sm:w-14 md:w-16 h-14 md:h-16 rounded-2xl text-lg font-bold bg-white border-2 border-gray-100 text-gray-600 hover:border-[var(--gjn-amber)] hover:text-[var(--gjn-amber)] transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <Bookmark className={`h-6 w-6 md:h-7 md:w-7 ${isSaved ? "fill-[var(--gjn-amber)] text-[var(--gjn-amber)]" : ""}`} />
                  <span className="sm:hidden">{isSaved ? "Saved" : "Save Job"}</span>
                </button>
              </div>

            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-0">
            {/* Main Content Area */}
            <div className="lg:col-span-3 pb-8 md:pb-12 space-y-10 lg:pr-8 lg:border-r border-gray-100">
              {/* 🔹 INFO GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InfoItem label="Salary" value={job.salary ? `₹${job.salary}` : "N/A"} icon={<IndianRupee className="h-4 w-4" />} />
                <InfoItem label="Qualification" value={job.qualification || "N/A"} icon={<GraduationCap className="h-4 w-4" />} />
                <InfoItem label="Experience" value={job.experienceRequired || "N/A"} icon={<Briefcase className="h-4 w-4" />} />
                <InfoItem label="Age Limit" value={job.ageLimit || "N/A"} icon={<User className="h-4 w-4" />} />
              </div>

              {/* 3. Notification Summary */}
              {quickSummary && (
                <section className="page-section p-8 space-y-6">
                  {!quickSummary.trim().startsWith('###') && (
                    <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                      <FileText className="h-6 w-6" /> Notification Summary
                    </h3>
                  )}
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{quickSummary}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 4. Key Takeaways */}
              {keyTakeaways && (
                <section className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{keyTakeaways}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 5. VACANCIES (Clean Structured Layout) */}
              <div className="page-section p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--gjn-border)] pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-syne font-bold flex items-center gap-2" style={{ color: 'var(--gjn-blue)' }}>
                      <Users className="h-6 w-6" /> Positions Available
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Detailed breakdown of specific posts
                    </p>
                  </div>
                  {positions.length > 0 && (
                    <Badge className="self-start sm:self-auto bg-blue-50 text-[var(--gjn-blue)] border-none font-black px-4 py-2 text-xs uppercase tracking-widest rounded-xl">
                      Total Positions Available: {positions.reduce((acc, pos) => acc + (parseInt(pos.numberOfVacancies as any) || 0), 0)}
                    </Badge>
                  )}
                </div>

                {positions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {positions.map((pos) => (
                      <div
                        key={pos.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--gjn-border)] hover:border-[var(--gjn-amber)] transition-colors bg-white"
                      >
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 leading-tight">
                            {pos.positionName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mt-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span>{pos.qualification}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 md:justify-end border-t md:border-t-0 md:border-l border-[var(--gjn-border)] pt-4 md:pt-0 md:pl-6 min-w-max">
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Vacancies</p>
                            <Badge className="bg-amber-50 text-[var(--gjn-amber)] border-none font-black px-3 py-1">
                              {pos.numberOfVacancies}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Salary</p>
                            <p className="text-sm font-bold text-green-600">
                              {pos.salaryRange || "As per rules"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic py-2">Vacancy details not officially specified.</p>
                )}
              </div>




              {/* Eligibility & Fees */}
              <section className="page-section grid grid-cols-1 md:grid-cols-2 gap-8 p-8 mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-syne font-bold flex items-center gap-3 border-b border-[var(--gjn-border)] pb-4" style={{ color: 'var(--gjn-blue)' }}>
                    <Target className="h-6 w-6" /> Eligibility Details
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Age Limit</p>
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">{job.ageLimit || "As per official rules"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Educational Qualification</p>
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">{job.qualification}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:border-l md:border-[var(--gjn-border)] md:pl-8">
                  <h3 className="text-xl font-syne font-bold flex items-center gap-3 border-b border-[var(--gjn-border)] pb-4" style={{ color: 'var(--gjn-blue)' }}>
                    <IndianRupee className="h-6 w-6" /> Fees & Dates
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Application Fee</p>
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">{job.applicationFee || "Refer to Official Notification"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Application Start Date</p>
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">{job.applicationStartDate || "Refer to link"}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Official Vacancy Matrix */}
              {job.vacancyBreakdown && (
                <section id="vacancies" className="page-section p-8 space-y-6">
                  <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                    <Users className="h-6 w-6" />
                    Official Vacancy Matrix
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-sm prose max-w-none">
                    {job.vacancyBreakdown}
                  </div>
                </section>
              )}

              {/* Prep Guide */}
              {job.prepGuide && (
                <section className="page-section p-8 space-y-6">
                  <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                    <Sparkles className="h-6 w-6 text-[var(--gjn-amber)]" />
                    AI-Powered Preparation Guide
                  </h3>
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{job.prepGuide}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* Syllabus Section */}
              {job.syllabus && (
                <section className="page-section p-8 space-y-6">
                  <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                    <BookOpen className="h-6 w-6" />
                    Detailed Syllabus Breakdown
                  </h3>
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{job.syllabus}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* Middle Ad Placement */}
              <AdUnit slot="job-middle-content" />

              {/* 10. Important Documents */}
              {importantDocuments && (
                <section className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{importantDocuments}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 11. Selection Process */}
              {(selectionProcessMd || job.selectionProcess) && (
                <section className="page-section p-8 space-y-6">
                  {!selectionProcessMd && (
                    <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                      <Target className="h-6 w-6" /> Selection Process
                    </h3>
                  )}
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>
                      {selectionProcessMd || job.selectionProcess}
                    </ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 12. Common Mistakes */}
              {commonMistakes && (
                <section className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{commonMistakes}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 13. Who Can Apply */}
              {whoCanApply && (
                <section className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{whoCanApply}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* 14. How to Apply */}
              {howToApply && (
                <section className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{howToApply}</ReactMarkdown>
                  </div>
                </section>
              )}

              {/* Other unknown markdown chunks to prevent data loss */}
              {otherChunks.map((chunk, idx) => (
                <section key={`other-${idx}`} className="page-section p-8 space-y-6">
                  <div className="text-gray-700 leading-relaxed text-sm font-medium prose prose-blue max-w-none">
                    <ReactMarkdown components={customMarkdownComponents}>{chunk}</ReactMarkdown>
                  </div>
                </section>
              ))}

              {/* Official Notifications (Multiple) */}
              {((job.notifications as any[]) || []).length > 0 && (
                <section id="documents" className="space-y-6">
                  <h3 className="text-xl font-syne font-bold flex items-center justify-center md:justify-start gap-3" style={{ color: 'var(--gjn-blue)' }}>
                    <Download className="h-6 w-6" /> Notifications & Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((job.notifications as any[]) || []).map((notif, idx) => (
                      <a
                        key={idx}
                        href={notif.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${notif.type === 'file' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {notif.type === 'file' ? <FileText className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px]">{notif.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{notif.type === 'file' ? 'Official PDF' : 'Direct Link'}</p>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-gray-300 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Important Links (New Section) */}
              <section className="space-y-6">
                <h3 className="text-xl font-syne font-bold flex items-center justify-center md:justify-start gap-3" style={{ color: 'var(--gjn-blue)' }}>
                  <ExternalLink className="h-6 w-6" /> Important Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dynamic Notification Links mirrored here if short */}
                  {((job.notifications as any[]) || []).map((notif, idx) => (
                    <a
                      key={`imp-${idx}`}
                      href={notif.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl hover:bg-indigo-50 transition-all group"
                    >
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                        <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{notif.label}</span>
                    </a>
                  ))}

                  {/* Per-job Custom Links */}
                  {(Array.isArray(job.customLinks) ? job.customLinks : []).map((link, idx) => (
                    <a
                      key={`custom-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-all group shadow-sm"
                    >
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{link.label}</span>
                    </a>
                  ))}

                  {/* Global Social Links */}
                  {settings?.joinFacebookUrl && (
                    <a href={settings.joinFacebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl hover:bg-blue-50 transition-all group">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Facebook className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Join Facebook Page</span>
                    </a>
                  )}
                  {settings?.joinWhatsAppUrl && (
                    <a href={settings.joinWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-green-50/50 border border-green-100/50 rounded-2xl hover:bg-green-50 transition-all group">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Join WhatsApp Channel</span>
                    </a>
                  )}
                  {settings?.joinTelegramUrl && (
                    <a href={settings.joinTelegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl hover:bg-blue-50 transition-all group">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Send className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Join Telegram Channel</span>
                    </a>
                  )}
                  {settings?.joinArattaiUrl && (
                    <a href={settings.joinArattaiUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-purple-50/50 border border-purple-100/50 rounded-2xl hover:bg-purple-50 transition-all group">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Join Arattai Channel</span>
                    </a>
                  )}
                </div>
              </section>
              {/* Mobile Sidebar Placement (Appears AFTER article, BEFORE FAQ) */}
              <div className="block lg:hidden w-full my-8">
                <JobSidebar />
              </div>

              {/* FAQ Section (Rich Snippets) */}
              <JobFAQ job={job} />

              {/* 17. About Author */}
              <section className="page-section p-8 bg-blue-50/30 border border-blue-100 rounded-3xl space-y-4 mt-8">
                <h3 className="text-xl font-syne font-bold flex items-center gap-3" style={{ color: 'var(--gjn-blue)' }}>
                  <User className="h-6 w-6 text-blue-500" />
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                    <span className="font-bold text-xl text-blue-700">G</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">GovtJobNow Editorial Team</h4>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed max-w-xl">
                      Our expert editorial team diligently tracks, curates, and verifies government job notifications across India. We are committed to bringing you accurate, timely, and highly readable career opportunities.
                    </p>
                  </div>
                </div>
              </section>

              {/* Bottom Ad Placement */}
              <AdUnit slot="job-bottom-post" />

              {/* Related Content (Internal Linking) */}
              <RelatedJobs jobId={job.id} />
            </div>

            {/* Desktop Sidebar Area */}
            <div className="hidden lg:block lg:col-span-1 relative mt-12">
              <JobSidebar />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 pl-2">
            <OrganizationLogo department={job?.recruitingOrganization || job?.department || ""} className="h-6 w-6" />
            <div className="flex flex-col">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-[10px] font-black text-green-600 uppercase leading-none">Hiring Now</p>
            </div>
          </div>
          <button className="flex-1 gjn-btn-primary flex items-center justify-center gap-1" style={{ borderRadius: '16px', height: '48px' }} onClick={() => window.open(job?.sourceUrl || '#', '_blank')}>
            Apply Online <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-[var(--gjn-bg)] border border-[var(--gjn-border)] rounded-[16px] p-4 flex flex-col hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-[var(--gjn-blue)] bg-white p-1.5 rounded-lg shadow-sm border border-[var(--gjn-border)]">{icon}</div>}
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {label}
        </p>
      </div>
      <p className="text-sm font-black text-gray-900 mt-auto leading-tight">
        {value}
      </p>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
