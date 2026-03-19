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
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && job.id) {
      setLoadingPositions(true);
      fetch(`/api/jobs/${job.id}/positions`)
        .then(res => res.json())
        .then(data => {
          setPositions(data);
          setLoadingPositions(false);
        })
        .catch(() => setLoadingPositions(false));
    }
  }, [isOpen, job.id]);

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
                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 shadow-sm shadow-blue-50/50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Salary</p>
                        <p className="text-sm font-black text-blue-900 flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" /> {job.salary || "Best in Industry"}
                        </p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Positions</p>
                        <p className="text-sm font-black text-blue-900 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {job.positions}
                        </p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Type</p>
                        <p className="text-sm font-black text-blue-900">{job.employmentType || "Full-time"}</p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Experience</p>
                        <p className="text-sm font-black text-blue-900">{job.experienceRequired || "Not Specified"}</p>
                      </div>
                      <div className="space-y-1 border-l border-blue-100 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Deadline</p>
                        <p className="text-sm font-black text-orange-600 flex items-center gap-1 shrink-0 whitespace-nowrap">
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

                    {/* Positions Section */}
                    {positions.length > 0 && (
                      <section className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                           <Users className="h-4 w-4" /> Available Positions ({positions.length})
                        </h4>
                        <div className="border rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                              <tr>
                                <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest text-gray-400">Position & Salary</th>
                                <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest text-gray-400">Eligibility</th>
                                <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                              {positions.map((pos: any) => (
                                <tr key={pos.id} className="hover:bg-blue-50/30 transition-colors align-top">
                                  <td className="px-4 py-4 min-w-[200px]">
                                    <p className="font-black text-gray-900 mb-1">{pos.positionName}</p>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight"> {pos.salaryRange || "As per rules"}</p>
                                  </td>
                                  <td className="px-4 py-4 min-w-[200px] space-y-1">
                                    <p className="text-gray-900 font-bold">{pos.qualification}</p>
                                    <p className="text-[10px] text-gray-400">Exp: {pos.experienceRequired || "N/A"}</p>
                                    {pos.specificRequirements && (
                                      <p className="text-[10px] text-gray-500 italic mt-2 border-l border-gray-100 pl-2">
                                        Note: {pos.specificRequirements}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[10px]">
                                      {pos.numberOfVacancies || 1}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {/* Vacancy Breakdown */}
                    {job.vacancyBreakdown && (
                      <section className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                           <Users className="h-4 w-4 text-blue-400" /> Vacancy Breakdown
                        </h4>
                        <p className="text-sm text-gray-600 font-medium whitespace-pre-line leading-relaxed italic">
                          {job.vacancyBreakdown}
                        </p>
                      </section>
                    )}

                    {/* Selection Process */}
                    {job.selectionProcess && (
                      <section className="p-6 bg-blue-50/20 rounded-3xl border border-blue-100/30">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2">
                           <Target className="h-4 w-4" /> Selection Process
                        </h4>
                        <p className="text-sm text-blue-900/80 font-medium leading-relaxed">
                          {job.selectionProcess}
                        </p>
                      </section>
                    )}

                    {/* Description */}
                    <section>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                         <FileText className="h-4 w-4" /> About Recruitment
                      </h4>
                      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-medium">
                        {job.description}
                      </div>
                    </section>

                    {/* Winning Sections */}
                    {job.prepGuide && (
                      <section className="p-6 bg-yellow-50/30 rounded-3xl border border-yellow-100/50">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-600 mb-4 flex items-center gap-2">
                           <Sparkles className="h-4 w-4" /> Preparation Strategy
                        </h4>
                        <div className="text-sm text-yellow-900/80 font-medium whitespace-pre-line leading-relaxed">
                          {job.prepGuide}
                        </div>
                      </section>
                    )}

                    {job.syllabus && (
                      <section id="syllabus-section" className="p-6 bg-purple-50/30 rounded-3xl border border-purple-100/50">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 mb-4 flex items-center gap-2">
                           <BookOpen className="h-4 w-4" /> Comprehensive Syllabus
                        </h4>
                        <div className="text-sm text-purple-900/80 font-medium whitespace-pre-line leading-relaxed">
                          {job.syllabus}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-8">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actions & Quick Links</h4>
                      
                      <div className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl h-12 shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={() => window.open(job.sourceUrl, '_blank')}>
                          Apply Online <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>

                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-extrabold rounded-2xl h-12 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={handleViewFullDetails}>
                          View Full Details <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>

                        {job.notificationFileUrl && (
                          <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-white font-black rounded-2xl h-12" onClick={() => window.open(job.notificationFileUrl as string, '_blank')}>
                             Download Notification <Download className="ml-2 h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        
                        {onTrack && (
                          <Button variant="outline" className="w-full border-blue-100 text-blue-600 hover:bg-white font-black rounded-2xl h-12" onClick={onTrack}>
                            <Target className="mr-2 h-4 w-4" /> Track Application
                          </Button>
                        )}

                        {job.syllabus && (
                          <Button variant="outline" className="w-full border-purple-100 text-purple-600 hover:bg-white font-black rounded-2xl h-12" onClick={handleQuickSyllabus}>
                            <BookOpen className="mr-2 h-4 w-4" /> View Syllabus
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
