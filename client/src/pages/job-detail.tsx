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
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="p-8 md:p-12 border-b border-gray-50 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              <div className="flex gap-6 items-start flex-1">
                <OrganizationLogo department={job.department} recruitingOrganization={job.recruitingOrganization} className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl shadow-2xl bg-white p-1.5" />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-lg">
                      {job.jobCategory || "Central Govt"}
                    </Badge>
                    {isVerified && (
                      <Badge className="bg-green-50 text-green-700 border-green-100 font-black text-[10px] uppercase flex items-center gap-1.5 px-3 py-1 rounded-lg">
                        <ShieldCheck className="h-4 w-4" /> Verified Official
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight text-center md:text-left drop-shadow-sm">{job.title}</h1>

                  {/* Top Ad Placement */}
                  <AdUnit slot="job-top-fluid" className="my-2" />

                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-500 font-bold uppercase tracking-[0.15em] text-[10px]">
                    <span className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      <Building2 className="h-3.5 w-3.5" /> {job.department}
                    </span>
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" /> {job.recruitingOrganization || job.department}
                    </span>
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0 self-start md:self-center lg:self-start">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 px-2 uppercase tracking-tighter">Share</p>
                  <SocialShare
                    url={window.location.href}
                    title={job.title}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-600">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    }
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-gray-100 shadow-sm" onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 p-8 md:p-12 space-y-12 border-r border-gray-50">
              {/* Modern Bento Info Grid */}
              <div id="overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2 bg-gray-50/30 rounded-[2.5rem] border border-gray-100 shadow-inner">
                <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimated Salary</p>
                      <p className="text-sm font-black text-gray-900 leading-tight">₹{job.salary || "Best in Field"}</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Education Req.</p>
                      <p className="text-sm font-black text-gray-900 leading-tight">{job.qualification}</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Experience Req.</p>
                      <p className="text-sm font-black text-gray-900 leading-tight">{job.experienceRequired || "Not Specified"}</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Application Deadline</p>
                      <p className="text-sm font-black text-red-600 leading-tight">{job.deadline}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Winning Innovation: Prep Guide */}
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

              {/* Syllabus Section */}
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

              {/* Middle Ad Placement */}
              <AdUnit slot="job-middle-content" />

              {/* Experience & Requirements */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <FileText className="h-7 w-7 text-blue-600" /> Notification Summary
                </h3>
                <div className="prose prose-blue max-w-none text-gray-600 font-medium leading-relaxed">
                  {job.description}
                </div>
              </section>

              {/* Specific Positions Table */}
              {positions.length > 0 && (
                <section id="vacancies" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <Users className="h-7 w-7 text-blue-600" /> Positions Available
                    </h3>
                    <Badge variant="outline" className="font-bold text-blue-600 border-blue-100">
                      {positions.length} Total Posts
                    </Badge>
                  </div>

                  <div className="border rounded-[2rem] overflow-hidden bg-white shadow-sm">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b-gray-100">                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-6 pl-8">Position & Salary</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-6">Eligibility & Exp</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-6 text-center">Posts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {positions.map((pos) => (
                          <TableRow key={pos.id} className="group hover:bg-blue-50/30 transition-colors border-b-gray-50 last:border-0 align-top">
                            <TableCell className="py-6 pl-8">
                              <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{pos.positionName}</div>
                              <div className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">
                                {pos.salaryRange || "As per notification"}
                              </div>
                            </TableCell>
                            <TableCell className="py-6">
                              <div className="font-bold text-gray-700 text-sm mb-1">{pos.qualification}</div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase">Exp: {pos.experienceRequired || "None"}</div>
                              {pos.specificRequirements && (
                                <div className="text-[11px] text-gray-500 italic mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                  <span className="text-blue-500 font-black mr-2">Note:</span> {pos.specificRequirements}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-6 text-center">
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-black px-3 py-1">
                                {pos.numberOfVacancies}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              )}

              {/* Eligibility & Fees */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-[2rem] p-8 bg-gray-50/30">
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-gray-900 border-b pb-2 flex items-center justify-center md:justify-start gap-2">
                    <Target className="h-5 w-5 text-blue-600" /> Eligibility Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Age Limit</p>
                      <p className="text-sm font-black text-gray-900">{job.ageLimit || "As per official rules"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Educational Qualification</p>
                      <p className="text-sm font-black text-gray-900">{job.qualification}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:border-l md:pl-8">
                  <h3 className="text-lg font-black text-gray-900 border-b pb-2 flex items-center justify-center md:justify-start gap-2">
                    <IndianRupee className="h-5 w-5 text-green-600" /> Fees & Dates
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Fee</p>
                      <p className="text-sm font-black text-gray-900">{job.applicationFee || "Refer to Official Notification"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Start Date</p>
                      <p className="text-sm font-black text-gray-900">{job.applicationStartDate || "Refer to link"}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Selection Process */}
              {job.selectionProcess && (
                <section className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50">
                  <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center justify-center md:justify-start gap-3">
                    <Target className="h-7 w-7 text-blue-600" /> Selection Process
                  </h3>
                  <div className="text-blue-900/80 leading-relaxed font-bold text-sm">
                    {job.selectionProcess}
                  </div>
                </section>
              )}

              {/* Vacancy Breakdown */}
              {job.vacancyBreakdown && (
                <section className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 -z-10 rounded-[2.5rem]" />
                  <div className="bg-white/40 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] border border-indigo-100/50 shadow-sm relative group transition-all hover:shadow-md hover:bg-white/60">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Sparkles className="h-24 w-24 text-indigo-600" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                          <Users className="h-8 w-8 text-indigo-600" /> Detailed Vacancy Breakdown
                        </h3>
                        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest pl-11">Official Statistics & Categories</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                        <ShieldCheck className="h-4 w-4" /> Verified Data
                      </div>
                    </div>

                    <div className="bg-white/80 p-6 rounded-3xl border border-indigo-50 shadow-inner relative z-10">
                      <div className="prose prose-indigo max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-base first-letter:text-3xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-1">
                          {job.vacancyBreakdown}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Badge className="bg-indigo-100/50 text-indigo-700 hover:bg-indigo-100 border-indigo-200/50 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider">
                        Categorized Data
                      </Badge>
                      <Badge className="bg-blue-100/50 text-blue-700 hover:bg-blue-100 border-blue-200/50 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider">
                        Official Notification Source
                      </Badge>
                    </div>
                  </div>
                </section>
              )}

              {/* Official Notifications (Multiple) */}
              {((job.notifications as any[]) || []).length > 0 && (
                <section id="documents" className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                    <Download className="h-7 w-7 text-blue-600" /> Notifications & Documents
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
                <h3 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                  <ExternalLink className="h-7 w-7 text-indigo-600" /> Important Links
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

              {/* FAQ Section (Rich Snippets) */}
              <JobFAQ job={job} />

              {/* Bottom Ad Placement */}
              <AdUnit slot="job-bottom-post" />

              {/* Related Content (Internal Linking) */}
              <RelatedJobs jobId={job.id} />
            </div>

            {/* Sidebar Sticky */}
            <div className="p-8 md:p-12 bg-gray-50/50 space-y-8">
              <div className="sticky top-12 space-y-8">
                {/* Trending Jobs Widget */}
                <Card className="rounded-[2rem] border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <TrendingJobs />
                  </CardContent>
                </Card>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Application Status</h4>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-12 sm:h-14 shadow-2xl shadow-blue-100 flex items-center justify-center gap-2" onClick={() => window.open(job.sourceUrl, '_blank')}>
                      Apply Online <ExternalLink className="h-5 w-5" />
                    </Button>

                    {/* Modern Multi-Notification Priority */}
                    {((job.notifications as any[]) || []).length > 0 ? (
                      ((job.notifications as any[]) || []).map((notif, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-black rounded-2xl h-14 flex items-center justify-center gap-2 transition-all"
                          onClick={() => window.open(notif.url, '_blank')}
                        >
                          {notif.label} {notif.type === 'file' ? <Download className="h-5 w-5 text-blue-500" /> : <ExternalLink className="h-5 w-5 text-blue-500" />}
                        </Button>
                      ))
                    ) : job.notificationFileUrl && (
                      <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-white font-black rounded-2xl h-14 flex items-center justify-center gap-2" onClick={() => window.open(job.notificationFileUrl as string, '_blank')}>
                        Official Notification <Download className="h-5 w-5 text-blue-500" />
                      </Button>
                    )}

                    <SocialShare
                      url={window.location.href}
                      title={job.title}
                      trigger={
                        <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-black rounded-2xl h-12 sm:h-14">
                          <Share2 className="mr-2 h-5 w-5" /> Share Openings
                        </Button>
                      }
                    />
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 italic">
                      <span>Registration Deadline</span>
                    </div>
                    <div id="timeline" className="p-5 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-100 animate-pulse">
                      <p className="text-center font-black text-xl">{job.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2 underline">Note</p>
                  <p className="text-xs text-orange-900/70 font-bold leading-relaxed">
                    Always verify details on the official government portal before making any payment.
                  </p>
                </div>
              </div>
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
