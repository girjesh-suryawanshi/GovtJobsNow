import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, MapPin, Users, Calendar, IndianRupee, Bookmark,
  Share2, ExternalLink, FileText, MessageCircle, Send, Facebook,
  Building2, Sparkles, BookOpen, ShieldCheck, Target, Download, ChevronRight
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
import { TrendingJobs } from "@/components/trending-jobs";
import { JobFAQ } from "@/components/job-faq";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Job } from "@/types/job";
import { type SiteSettings } from "@shared/schema";
import SocialShare from "@/components/social-share";

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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEOHead
        title={`${job.title} - ${job.department} | GovtJobsNow Official`}
        description={`Official notification for ${job.title} in ${job.department}. Apply before ${job.deadline}.`}
        url={`https://govtjobsnow.com/job/${job.slug || job.id}`}
      />
      <Header onScrollToDepartments={() => window.location.href = '/#departments'} />

      {/* Sticky Professional Sub-Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 transform ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden text-sm">
             <div className="hidden sm:block">
               <OrganizationLogo department={job?.recruitingOrganization || job?.department || ""} className="h-8 w-8" />
             </div>
             <p className="font-black text-gray-900 truncate max-w-[200px] md:max-w-md">{job?.title}</p>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#overview" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Overview</a>
            <a href="#vacancies" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Vacancies</a>
            <a href="#timeline" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Timeline</a>
            <a href="#documents" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Documents</a>
          </div>

          <div className="flex items-center gap-3">
             <Button size="sm" className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl px-4 py-2" onClick={() => window.open(job?.notificationFileUrl || job?.sourceUrl || '#', '_blank')}>
               Apply Now
             </Button>
             <SocialShare 
               url={window.location.href}
               title={job?.title || ""}
               trigger={
                 <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100">
                   <Share2 className="h-4 w-4 text-gray-400" />
                 </Button>
               }
             />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BACK + BREADCRUMB */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-transparent hover:text-blue-600 p-0 text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>

          <Breadcrumbs
            items={[
              { label: job.jobCategory || "Jobs", href: "/#departments" },
              { label: job.title }
            ]}
          />
        </div>

        {/* CLEAN HEADER SECTION */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex gap-5 items-start flex-1 min-w-0">
              <OrganizationLogo department={job.department} recruitingOrganization={job.recruitingOrganization} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shadow-sm border border-gray-50 flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-lg">
                    {job.jobCategory || "Central Govt"}
                  </Badge>
                  {isVerified && (
                    <Badge className="bg-green-50 text-green-700 border-green-100 font-black text-[10px] uppercase flex items-center gap-1.5 px-2 py-0.5 rounded-lg">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight break-words mb-1">{job.title}</h1>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-blue-500" /> {job.department} • {job.location}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-12 px-8 flex items-center gap-2" onClick={() => window.open(job.sourceUrl, '_blank')}>
                Apply Now <ExternalLink className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <SocialShare
                  url={window.location.href}
                  title={job.title}
                  trigger={
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl text-gray-400 hover:text-blue-600 border-gray-100">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  }
                />
                <Button variant="outline" size="icon" className={`h-12 w-12 rounded-xl border-gray-100 ${isSaved ? 'text-orange-500 bg-orange-50' : 'text-gray-300'}`} onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-orange-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* SIMPLIFIED INFO GRID */}
        <div id="overview" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Info label="Salary" value={job.salary || "N/A"} icon={<IndianRupee className="h-4 w-4" />} color="blue" />
          <Info label="Education" value={job.qualification} icon={<BookOpen className="h-4 w-4" />} color="purple" />
          <Info label="Experience" value={job.experienceRequired || "N/A"} icon={<ShieldCheck className="h-4 w-4" />} color="orange" />
          <Info label="Deadline" value={job.deadline} icon={<Calendar className="h-4 w-4" />} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Winning Innovation: Prep Guide (Premium Style) */}
            {job.prepGuide && (
              <section className="bg-blue-600 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-200">
                <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                  <Sparkles className="h-48 w-48" />
                </div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <Sparkles className="h-7 w-7 text-yellow-300" />
                  AI-Powered Preparation Guide
                </h3>
                <div className="text-blue-50 leading-relaxed whitespace-pre-wrap font-bold text-sm">
                  {job.prepGuide}
                </div>
              </section>
            )}

            {/* Syllabus Section (Premium Style) */}
            {job.syllabus && (
              <section className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100">
                <h3 className="text-xl font-black text-purple-900 mb-6 flex items-center gap-3">
                  <BookOpen className="h-7 w-7 text-purple-600" />
                  Detailed Syllabus Breakdown
                </h3>
                <div className="text-purple-900/80 leading-relaxed whitespace-pre-wrap font-medium text-sm italic">
                  {job.syllabus}
                </div>
              </section>
            )}

            <Section title="Description">
              <div className="prose prose-blue max-w-none text-gray-700 font-medium leading-relaxed">
                {job.description}
              </div>
            </Section>

            {positions.length > 0 && (
              <Section title="Vacancies">
                <div className="grid grid-cols-1 gap-4">
                  {positions.map((p) => (
                    <div key={p.id} className="border-2 border-gray-50 p-4 rounded-xl hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-black text-gray-900 uppercase tracking-tight">{p.positionName}</p>
                        <Badge className="bg-blue-50 text-blue-700 border-none font-black">
                          {p.numberOfVacancies} Posts
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{p.qualification}</p>
                      {p.salaryRange && <p className="text-xs font-black text-blue-600">₹ {p.salaryRange}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Selection Process */}
            {job.selectionProcess && (
              <Section title="Selection Process">
                <div className="text-gray-700 leading-relaxed font-bold text-sm">
                  {job.selectionProcess}
                </div>
              </Section>
            )}

            {/* Important Documents */}
            {((job.notifications as any[]) || []).length > 0 && (
              <Section title="Documents">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((job.notifications as any[]) || []).map((n, i) => (
                    <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-blue-600 transition-all group">
                      <div className="p-2 bg-white rounded-lg group-hover:bg-blue-50 transition-colors">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{n.label}</span>
                    </a>
                  ))}
                </div>
              </Section>
            )}

            <JobFAQ job={job} />
            <RelatedJobs jobId={job.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm sticky top-24">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Action Center</h4>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-12 shadow-md flex items-center justify-center gap-2" onClick={() => window.open(job.sourceUrl, '_blank')}>
                  Apply Now <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full border-gray-100 text-gray-700 hover:bg-gray-50 font-black rounded-xl h-12 flex items-center justify-center gap-2" onClick={handleTrackJob}>
                   Track Application <Target className="h-4 w-4 text-blue-500" />
                </Button>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-lg font-black text-red-600">{job.deadline}</p>
                </div>
              </div>

              <Separator className="my-6 bg-gray-50" />
              
              <TrendingJobs variant="card" />
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
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-12 shadow-lg shadow-blue-200" onClick={() => window.open(job?.sourceUrl || '#', '_blank')}>
            Apply Online <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

function Info({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${colors[color] || 'bg-gray-50 text-gray-600'} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-sm font-black text-gray-900 leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
        {title}
      </h2>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
