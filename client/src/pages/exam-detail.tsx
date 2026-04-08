import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowLeft, Calendar, Bell, ExternalLink, FileText, 
  MessageCircle, Send, Facebook, Building2, Sparkles, 
  BookOpen, Target, Download, Share2, Info, Timer, ShieldCheck
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import OrganizationLogo from "@/components/organization-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { AdUnit } from "@/components/ad-unit";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TrendingJobs } from "@/components/trending-jobs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { Exam } from "@/types/exam";
import { type SiteSettings } from "@shared/schema";
import SocialShare from "@/components/social-share";

export default function ExamDetail() {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: exam, isLoading } = useQuery({
    queryKey: ["/api/exams/slug", slug],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/exams/slug/${slug}`);
      return response.json() as Promise<Exam>;
    },
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse">Loading Official Exam Schedule...</p>
        </div>
      </div>
    </div>
  );

  if (!exam) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Exam Not Found</h2>
        <p className="text-gray-500">The exam calendar entry you're looking for doesn't exist or has been removed.</p>
        <Link href="/exams">
          <Button>View All Exams</Button>
        </Link>
      </div>
    </div>
  );



  const formatDate = (date: string) => {
    if (!date) return "To be announced";
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper to check if a date is in the future
  const isFutureDate = (date: string) => {
    if (!date) return false;
    return new Date(date) > new Date();
  };

  const notifications = (exam.notifications as any[]) || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEOHead
        title={`${exam.title} - ${exam.conductingOrganization} | GovtJobNow Calendar`}
        description={`Important dates, syllabus, and official notifications for ${exam.title}. Registration ends on ${formatDate(exam.registrationEndDate)}.`}
        url={`https://govtjobnow.com/exam/${exam.slug}`}
      />
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/exams">
            <Button variant="ghost" className="hover:bg-transparent hover:text-blue-600 p-0 text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Calendar
            </Button>
          </Link>
          
          <Breadcrumbs 
            items={[
              { label: "Exams", href: "/exams" },
              { label: exam.title }
            ]} 
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="p-8 md:p-12 border-b border-gray-50 bg-gradient-to-br from-blue-50/30 to-white">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-lg">
                    {exam.examMode || "General Exam"}
                  </Badge>
                  {isFutureDate(exam.examDate) && (
                    <Badge className="bg-green-50 text-green-700 border-green-100 font-black text-[10px] uppercase px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Timer className="h-3 w-3" /> Upcoming Exam
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight text-center md:text-left drop-shadow-sm">
                  {exam.title}
                </h1>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-500 font-bold uppercase tracking-[0.15em] text-[10px]">
                  <span className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    <Building2 className="h-3.5 w-3.5" /> {exam.conductingOrganization}
                  </span>
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" /> Posted on {formatDate(exam.createdAt as string)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0 self-start md:self-center lg:self-start">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                   <p className="text-[10px] font-black text-gray-400 px-2 uppercase tracking-tighter">Share</p>
                   <SocialShare 
                     url={window.location.href}
                     title={exam.title}
                     trigger={
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-600">
                         <Share2 className="h-5 w-5" />
                       </Button>
                     }
                   />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 p-8 md:p-12 space-y-12 border-r border-gray-50">
              
              {/* Important Timeline */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                  <Calendar className="h-7 w-7 text-blue-600" /> Exam Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="rounded-2xl border-none bg-blue-50/50 shadow-none p-5">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Registration</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {formatDate(exam.registrationStartDate)} -<br/> {formatDate(exam.registrationEndDate)}
                    </p>
                  </Card>
                  <Card className="rounded-2xl border-none bg-purple-50/50 shadow-none p-5">
                    <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Admit Card</p>
                    <p className="font-bold text-gray-900 text-sm">{formatDate(exam.admitCardDate || "")}</p>
                  </Card>
                  <Card className="rounded-2xl border-none bg-red-50/50 shadow-none p-5">
                    <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">Exam Date</p>
                    <p className="font-bold text-red-700 text-sm">{formatDate(exam.examDate)}</p>
                  </Card>
                </div>
              </section>

              {/* Exam Brief */}
              {exam.examBrief && (
                <section className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 -z-10 rounded-[2.5rem]" />
                  <div className="bg-white/40 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] border border-blue-100/50 shadow-sm relative group transition-all hover:shadow-md hover:bg-white/60">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Sparkles className="h-24 w-24 text-blue-600" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                          <Info className="h-8 w-8 text-blue-600" /> Exam Overview & Guide
                        </h3>
                        <p className="text-sm font-bold text-blue-400 uppercase tracking-widest pl-11">Key Information & Highlights</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                        <ShieldCheck className="h-4 w-4" /> Verified Brief
                      </div>
                    </div>

                    <div className="bg-white/80 p-6 rounded-3xl border border-blue-50 shadow-inner relative z-10">
                      <div className="prose prose-blue max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-base first-letter:text-3xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-1">
                          {exam.examBrief}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Badge className="bg-blue-100/50 text-blue-700 hover:bg-blue-100 border-blue-200/50 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider">
                        Official Overview
                      </Badge>
                      <Badge className="bg-indigo-100/50 text-indigo-700 hover:bg-indigo-100 border-indigo-200/50 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider">
                        Exam Highlights
                      </Badge>
                    </div>
                  </div>
                </section>
              )}

              {/* Eligibility & Quick Facts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6 p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
                  <h3 className="text-lg font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
                    <Target className="h-5 w-5 text-blue-600" /> Eligibility
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Education</p>
                      <p className="text-sm font-bold text-gray-900">{exam.eligibility || "Refer to notification"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Age Limit</p>
                      <p className="text-sm font-bold text-gray-900">{exam.ageLimit || "As per rules"}</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6 p-8 bg-orange-50/30 rounded-[2rem] border border-orange-100/50">
                  <h3 className="text-lg font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" /> Key Features
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Vacancies</p>
                      <p className="text-sm font-bold text-gray-900">{exam.vacancies || "Consult notification"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Exam Mode</p>
                      <p className="text-sm font-bold text-gray-900">{exam.examMode}</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Syllabus Breakdown */}
              {exam.syllabus && (
                <section className="bg-purple-600 p-8 md:p-12 rounded-[2.5rem] text-white relative shadow-2xl shadow-purple-200 overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <BookOpen className="h-32 w-32" />
                  </div>
                  <h3 className="text-2xl font-black mb-8 flex items-center justify-center md:justify-start gap-3">
                    <Sparkles className="h-8 w-8 text-yellow-300" /> Official Syllabus & Pattern
                  </h3>
                  <div className="prose prose-invert max-w-none text-purple-50 leading-relaxed font-bold italic whitespace-pre-wrap">
                    {exam.syllabus}
                  </div>
                </section>
              )}

              {/* Notifications Table-style links */}
              {notifications.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                    <Download className="h-7 w-7 text-blue-600" /> Notifications & Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notifications.map((notif, idx) => (
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

              {/* Important Links Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                  <ExternalLink className="h-7 w-7 text-indigo-600" /> Important Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dynamic Notification Links mirrored here */}
                  {notifications.map((notif, idx) => (
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

                  {/* Per-exam Custom Links */}
                  {(Array.isArray(exam.customLinks) ? exam.customLinks : []).map((link, idx) => (
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
                </div>
              </section>

              {/* Ad Unit Middle */}
              <AdUnit slot="exam-detail-middle" />
            </div>

            {/* Sidebar Sticky Area */}
            <div className="p-8 md:p-12 bg-gray-50/50 space-y-8">
              <div className="sticky top-12 space-y-8">
                {/* Apply Button Card */}
                <Card className="rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden bg-white">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Portal</p>
                      <a href={exam.officialWebsite || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button
            size="sm"
            className="flex-1 bg-slate-900 hover:bg-blue-700 text-white font-bold h-10 shadow-lg shadow-slate-200 transition-all"
            onClick={() => window.location.href = `/exam/${exam.slug || exam.id}`}
            data-testid="visit-website"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
                      </a>
                    </div>

                    <Separator className="bg-gray-100" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-orange-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Status</h4>
                      </div>
                      <div className={`p-6 rounded-2xl text-center shadow-lg transition-all ${isFutureDate(exam.registrationEndDate) ? 'bg-green-600 text-white shadow-green-100' : 'bg-gray-200 text-gray-500 shadow-none grayscale'}`}>
                        <p className="text-[10px] font-black uppercase mb-1">{isFutureDate(exam.registrationEndDate) ? 'Open Now' : 'Expired/Closed'}</p>
                        <p className="font-black text-lg underline decoration-2 underline-offset-4">{formatDate(exam.registrationEndDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Jobs Widget */}
                <TrendingJobs variant="card" title="Top Upcoming Jobs" />

                {/* Ad Unit Sidebar */}
                <AdUnit slot="exam-sidebar-square" className="my-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
