import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  X, MapPin, Users, Calendar, IndianRupee, Bookmark, Share2, 
  ExternalLink, Building2, FileText, MessageCircle, Send, Facebook, 
  Sparkles, BookOpen, ShieldCheck, Target, Download, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrganizationLogo from "@/components/organization-logo";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";
import { apiRequest } from "@/lib/api";

interface JobPosition {
  id: number;
  name: string;
  vacancies: string;
  qualification: string;
  experience: string;
  salary: string;
  requirements: string[];
}

interface JobDetailModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onTrack?: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose, onTrack }: JobDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Watchlist" : "Added to Watchlist",
      description: job.title
    });
  };

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

  const handleQuickSyllabus = () => {
    toast({
      title: "Syllabus Extracted",
      description: "You can find the detailed syllabus in the section below.",
    });
    const element = document.getElementById('syllabus-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewFullDetails = () => {
    onClose();
    setLocation(`/job/${job.id}`);
  };

  const isVerified = job.sourceUrl.includes('.gov.in') || job.sourceUrl.includes('.nic.in');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden border-none rounded-3xl shadow-2xl flex flex-col bg-white">
            {/* Header - Fixed with shrink-0 */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex justify-between items-start shrink-0">
              <div className="flex gap-4 sm:gap-6 items-start flex-1">
                <OrganizationLogo department={job.department} recruitingOrganization={job.recruitingOrganization} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shadow-md bg-white p-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg">
                      {job.jobCategory || "Government Job"}
                    </Badge>
                    {isVerified && (
                      <Badge className="bg-green-50 text-green-700 border-green-100 flex items-center gap-1.5 px-3 py-1 rounded-lg">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified Source
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight mb-2 tracking-tight line-clamp-2">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <Building2 className="h-4 w-4" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-gray-300 hover:text-gray-900 transition-colors">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Content Container - Triple-layer flex for absolute scroll reliability */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-10">
                    {/* Mobile Quick Actions - Visible only on mobile */}
                    <div className="lg:hidden grid grid-cols-2 gap-3 p-4 bg-blue-600 rounded-3xl shadow-lg shadow-blue-200">
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl h-12 text-xs uppercase" onClick={handleViewFullDetails}>
                        Full Details <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                      {onTrack && (
                        <Button variant="outline" className="border-blue-400 text-white hover:bg-blue-700 font-black rounded-2xl h-12 text-xs uppercase" onClick={onTrack}>
                          <Target className="mr-1 h-3.5 w-3.5" /> Track App
                        </Button>
                      )}
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 shadow-sm shadow-blue-50/50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Salary</p>
                        <p className="text-sm font-black text-blue-900 flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" /> {job.salary || "Best in Industry"}
                        </p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Job Type</p>
                        <p className="text-sm font-black text-blue-900">{job.employmentType || "Full-time"}</p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Experience</p>
                        <p className="text-sm font-black text-blue-900">{job.experienceRequired || "N/A"}</p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Deadline</p>
                        <p className="text-sm font-black text-red-600 flex items-center gap-1 shrink-0 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5" /> {job.deadline}
                        </p>
                      </div>
                    </div>

                    {/* Eligibility & Fees */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                           <Target className="h-4 w-4 text-blue-500" /> Eligibility Criteria
                         </h5>
                         <div className="space-y-3">
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Age Limit</p>
                             <p className="text-sm font-black text-gray-900">{job.ageLimit || "As per rules"}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Qualification</p>
                             <p className="text-sm font-black text-gray-900">{job.qualification}</p>
                           </div>
                         </div>
                      </div>
                      <div className="space-y-4 sm:border-l sm:border-gray-200 sm:pl-6">
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                           <IndianRupee className="h-4 w-4 text-green-500" /> Application Details
                         </h5>
                         <div className="space-y-3">
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Application Fee</p>
                              <p className="text-sm font-extrabold text-gray-900">{job.applicationFee || "Check Notification"}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Start Date</p>
                              <p className="text-sm font-extrabold text-gray-900">{job.applicationStartDate || "Refer to link"}</p>
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* Highlights for Applicants */}
                    <section className="bg-blue-600/5 p-6 rounded-3xl border border-blue-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Sparkles className="h-16 w-16" />
                      </div>
                      <h4 className="text-sm font-black text-blue-900 mb-3 flex items-center gap-2">
                         <Sparkles className="h-4 w-4 text-blue-600" /> Unlock Full Preparation Guide
                      </h4>
                      <p className="text-xs text-blue-800/70 font-medium leading-relaxed mb-4">
                        Get access to our AI-powered preparation strategy, detailed exam syllabus, and position-wise vacancy breakdown on the full job detail page.
                      </p>
                      <Button onClick={handleViewFullDetails} variant="link" className="p-0 h-auto text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        Explore Everything <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </section>

                    {/* Short Description */}
                    <section>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                         <FileText className="h-4 w-4" /> Brief Overview
                      </h4>
                      <div className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-4">
                        {job.description}
                      </div>
                    </section>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-8">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actions & Quick Links</h4>
                      
                      <div className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl min-h-[3.5rem] h-auto py-3 shadow-2xl shadow-blue-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] text-[12px] px-4 flex flex-col items-center justify-center leading-tight" onClick={handleViewFullDetails}>
                          <span>View Full Details</span>
                          <span className="flex items-center gap-1 opacity-90">& Syllabus <ArrowUpRight className="h-4 w-4 shrink-0" /></span>
                        </Button>

                        <Button variant="outline" className="w-full border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-extrabold rounded-2xl h-12" onClick={() => window.open(job.sourceUrl, '_blank')}>
                          Quick Apply Online <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>

                        {job.notificationFileUrl && (
                          <Button variant="outline" className="w-full border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 font-black rounded-2xl h-12" onClick={() => window.open(job.notificationFileUrl as string, '_blank')}>
                             Download Notification <Download className="ml-2 h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        
                        {onTrack && (
                          <Button variant="outline" className="w-full border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 bg-transparent dark:bg-blue-900/10 hover:bg-white dark:hover:bg-gray-700 font-black rounded-2xl h-12" onClick={onTrack}>
                            <Target className="mr-2 h-4 w-4" /> Track Application
                          </Button>
                        )}

                      </div>

                      <Separator className="bg-gray-200/50" />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={handleSaveJob} className={`rounded-xl h-10 w-10 ${isSaved ? 'text-orange-500' : 'text-gray-300'}`}>
                            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleShare('whatsapp')} className="rounded-xl h-10 w-10 text-gray-300 hover:text-green-500">
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="border-gray-200 text-gray-400 font-bold text-[10px]">
                          ID: GJ-{job.id}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 bg-orange-50/20 rounded-3xl border border-orange-100/30">
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Pro Tip</p>
                      <p className="text-xs text-orange-900/70 font-medium leading-relaxed italic">
                        "Track this application to receive milestone alerts like Admit Card releases and Result declarations directly on your dashboard."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
