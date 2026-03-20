import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowLeft, MapPin, Users, Calendar, IndianRupee, Bookmark, 
  Share2, ExternalLink, FileText, MessageCircle, Send, Facebook, 
  Building2, Sparkles, BookOpen, ShieldCheck, Target, Download
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
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/jobs/${id}`);
      return response.json() as Promise<Job>;
    },
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["/api/jobs", id, "positions"],
    enabled: !!job,
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/jobs/${id}/positions`);
      return response.json() as Promise<JobPosition[]>;
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gray-50"><Header /><div className="p-20 text-center text-gray-400 font-bold animate-pulse">Scanning official database...</div></div>;
  if (!job) return <div className="min-h-screen bg-gray-50"><Header /><div className="p-20 text-center">Job Not Found</div></div>;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this job: ${job.title}`;
    let shareUrl = "";

    switch (platform) {
      case "whatsapp": shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`; break;
      case "telegram": shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
    }
    if (shareUrl) window.open(shareUrl, "_blank");
  };

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
        url={`https://govtjobsnow.com/jobs/${job.id}`}
      />
      <Header onScrollToDepartments={() => window.location.href = '/#departments'} />

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
                  <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">{job.title}</h1>
                  
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
              <div className="flex gap-3 shrink-0 self-end lg:self-start">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-gray-100 shadow-sm" onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-gray-100 shadow-sm" onClick={() => handleShare('whatsapp')}>
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 p-8 md:p-12 space-y-12 border-r border-gray-50">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 shadow-inner">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 underline decoration-blue-200 decoration-2 underline-offset-4">Salary Range</p>
                  <p className="text-sm font-extrabold text-gray-900">₹{job.salary || "Best in Field"}</p>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 underline decoration-purple-200 decoration-2 underline-offset-4">Education</p>
                  <p className="text-sm font-extrabold text-gray-900">{job.qualification}</p>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 underline decoration-blue-200 decoration-2 underline-offset-4">Experience</p>
                  <p className="text-sm font-extrabold text-gray-900">{job.experienceRequired || "N/A"}</p>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 underline decoration-green-200 decoration-2 underline-offset-4">Valid Until</p>
                  <p className="text-sm font-extrabold text-red-600">{job.deadline}</p>
                </div>
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
                <section className="space-y-6">
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
                  <h3 className="text-lg font-black text-gray-900 border-b pb-2 flex items-center gap-2">
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
                  <h3 className="text-lg font-black text-gray-900 border-b pb-2 flex items-center gap-2">
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
                  <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-3">
                    <Target className="h-7 w-7 text-blue-600" /> Selection Process
                  </h3>
                  <div className="text-blue-900/80 leading-relaxed font-bold text-sm">
                    {job.selectionProcess}
                  </div>
                </section>
              )}

              {/* Vacancy Breakdown */}
              {job.vacancyBreakdown && (
                <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                     <Users className="h-20 w-20" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3 relative z-10">
                     <Users className="h-7 w-7 text-gray-400" /> Detailed Vacancy Breakdown
                   </h3>
                   <div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium text-sm italic relative z-10">
                     {job.vacancyBreakdown}
                   </div>
                </section>
              )}

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
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14 shadow-2xl shadow-blue-100 flex items-center justify-center gap-2" onClick={() => window.open(job.sourceUrl, '_blank')}>
                      Apply Online <ExternalLink className="h-5 w-5" />
                    </Button>

                    {job.notificationFileUrl && (
                      <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-white font-black rounded-2xl h-14 flex items-center justify-center gap-2" onClick={() => window.open(job.notificationFileUrl as string, '_blank')}>
                        Official Notification <Download className="h-5 w-5 text-blue-500" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-black rounded-2xl h-14" onClick={() => handleShare('whatsapp')}>
                      <Share2 className="mr-2 h-5 w-5" /> Share Openings
                    </Button>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 italic">
                      <span>Registration Deadline</span>
                    </div>
                    <div className="p-5 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-100 animate-pulse">
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
    </div>
  );
}
