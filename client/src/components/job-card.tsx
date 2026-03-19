import { useState } from "react";
import { MapPin, Users, Calendar, Globe, Bookmark, Share2, IndianRupee, CheckCircle2, XCircle, Info, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OrganizationLogo from "@/components/organization-logo";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";
import { useUserProfile } from "@/hooks/use-user-profile";
import { checkEligibility } from "@/lib/eligibility-utils";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onCompare?: () => void;
  onTrack?: () => void;
  isComparing?: boolean;
}

export default function JobCard({ job, onClick, onCompare, onTrack, isComparing = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { profile } = useUserProfile();
  const { toast } = useToast();

  const eligibility = checkEligibility(job, profile);
  const showEligibility = profile !== null;

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Watchlist" : "Added to Watchlist",
      description: job.title
    });
  };

  const handleShareJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/job/${job.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: job.title, url: shareUrl });
      } catch (e) { copyToClipboard(shareUrl); }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: "URL copied to clipboard" });
  };

  const getDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getUrgencyColor = (deadline: string) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft <= 0) return 'text-gray-500 bg-gray-100';
    if (daysLeft <= 3) return 'text-red-700 bg-red-100';
    if (daysLeft <= 7) return 'text-orange-700 bg-orange-100';
    return 'text-green-700 bg-green-100';
  };

  const daysLeft = getDaysLeft(job.deadline);
  const isExpired = daysLeft <= 0;

  return (
    <Card 
      className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${
        isExpired ? 'border-l-gray-400 opacity-80' : 
        daysLeft <= 3 ? 'border-l-red-500 bg-red-50/10' :
        daysLeft <= 7 ? 'border-l-orange-500' : 'border-l-blue-500'
      } hover:-translate-y-1 rounded-2xl overflow-hidden`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <OrganizationLogo department={job.department} recruitingOrganization={job.recruitingOrganization} className="h-12 w-12 rounded-xl shadow-sm bg-white p-1" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{job.title}</h3>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider">{job.department}</p>
          </div>
          <Badge className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${getUrgencyColor(job.deadline)}`}>
            {isExpired ? 'Expired' : `${daysLeft}d left`}
          </Badge>
        </div>

        {showEligibility && (
          <div className={`mb-4 flex items-center gap-2 p-2.5 rounded-xl border ${
            eligibility.isEligible ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            {eligibility.isEligible ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {eligibility.isEligible ? 'Target: Eligible' : 'Target: Not Eligible'}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-100 px-2 py-0.5">
            <MapPin className="h-3 w-3 mr-1" /> {job.location}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-100 px-2 py-0.5">
            {job.qualification}
          </Badge>
          {job.positions && (
            <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-100 px-2 py-0.5">
              <Users className="h-3 w-3 mr-1" /> {job.positions}
            </Badge>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between mb-4 border border-gray-100/50">
          <div className="flex items-center gap-1 text-green-700 font-bold text-sm">
            <IndianRupee className="h-3 w-3" />
            {job.salary || "Best in Industry"}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleSaveJob} className="h-8 w-8 rounded-full text-gray-400 hover:text-orange-500">
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShareJob} className="h-8 w-8 rounded-full text-gray-400 hover:text-blue-500">
              <Share2 className="h-4 w-4" />
            </Button>
            {onTrack && (
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onTrack(); }} className="h-8 rounded-full text-[10px] font-black uppercase tracking-tighter border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                <Target className="h-3.5 w-3.5 mr-1" /> Track
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{job.postedOn}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-8 font-bold text-xs shadow-lg shadow-blue-100" onClick={onClick} disabled={isExpired}>
            {isExpired ? 'Closed' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
