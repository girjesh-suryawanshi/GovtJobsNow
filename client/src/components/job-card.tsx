import { useState } from "react";
import { MapPin, Users, Calendar, Globe, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: Implement save to localStorage or backend
  };

  const handleShareJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this government job: ${job.title}`,
        url: `${window.location.origin}/job/${job.id}`,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(`${window.location.origin}/job/${job.id}`);
    }
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
    if (daysLeft <= 0) return 'text-gray-500 bg-gray-100'; // Expired
    if (daysLeft <= 3) return 'text-red-700 bg-red-100'; // Critical - 3 days or less
    if (daysLeft <= 7) return 'text-orange-700 bg-orange-100'; // Urgent - 7 days or less
    if (daysLeft <= 15) return 'text-yellow-700 bg-yellow-100'; // Soon - 15 days or less
    return 'text-green-700 bg-green-100'; // Normal - More than 15 days
  };

  const getUrgencyText = (deadline: string) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft <= 0) return 'Expired';
    if (daysLeft <= 3) return `${daysLeft} days left - Apply NOW!`;
    if (daysLeft <= 7) return `${daysLeft} days left - Urgent`;
    return `${daysLeft} days left`;
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {job.department}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </Badge>
              <Badge className="bg-green-50 text-green-700 hover:bg-green-100">
                {job.qualification}
              </Badge>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-sm text-gray-500 mb-2">Posted: {job.postedOn}</div>
            <div className="text-sm font-medium text-gray-700 mb-1">Deadline: {job.deadline}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${getUrgencyColor(job.deadline)}`}>
              {getUrgencyText(job.deadline)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getUrgencyText(job.deadline)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {job.positions} positions
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {new URL(job.sourceUrl).hostname}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveJob}
              className={`${isSaved ? 'text-orange-500' : 'text-gray-400'} hover:text-gray-600`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareJob}
              className="text-gray-400 hover:text-gray-600"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
