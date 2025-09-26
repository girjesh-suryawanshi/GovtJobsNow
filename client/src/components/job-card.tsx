import { useState, useEffect } from "react";
import { MapPin, Users, Calendar, Globe, Bookmark, Share2, IndianRupee, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OrganizationLogo from "@/components/organization-logo";
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

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onCompare?: () => void;
  isComparing?: boolean;
}

export default function JobCard({ job, onClick, onCompare, isComparing = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);

  // Fetch job positions when component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoadingPositions(true);
        const response = await fetch(`/api/jobs/${job.id}/positions`);
        if (response.ok) {
          const text = await response.text();
          if (text.trim() === '') {
            setPositions([]);
            return;
          }
          const positionsData = JSON.parse(text);
          setPositions(positionsData);
        }
      } catch (error) {
        console.error('Failed to fetch positions:', error);
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [job.id]);

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
    if (daysLeft <= 0) return 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'; // Expired
    if (daysLeft <= 3) return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950'; // Critical - 3 days or less
    if (daysLeft <= 7) return 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-950'; // Urgent - 7 days or less
    if (daysLeft <= 15) return 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950'; // Soon - 15 days or less
    return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950'; // Normal - More than 15 days
  };

  const getUrgencyText = (deadline: string) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft <= 0) return 'Expired';
    if (daysLeft <= 3) return `${daysLeft} days left - Apply NOW!`;
    if (daysLeft <= 7) return `${daysLeft} days left - Urgent`;
    return `${daysLeft} days left`;
  };

  const daysLeft = getDaysLeft(job.deadline);
  const isExpired = daysLeft <= 0;

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
        isExpired ? 'border-l-gray-400 opacity-75' : 
        daysLeft <= 3 ? 'border-l-red-500' :
        daysLeft <= 7 ? 'border-l-orange-500' :
        daysLeft <= 15 ? 'border-l-yellow-500' : 'border-l-green-500'
      } ${isExpired ? 'hover:shadow-md' : 'hover:shadow-lg hover:-translate-y-1'}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header Section - Mobile Responsive */}
        <div className="mb-4">
          {/* Top Row: Logo, Title, and Urgency */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0">
              <OrganizationLogo department={job.department} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                {job.title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-2 truncate">
                {job.department}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(job.deadline)} whitespace-nowrap`}>
                {getUrgencyText(job.deadline)}
              </div>
            </div>
          </div>
          
          {/* Key Info Tags - Mobile Optimized */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-24 sm:max-w-none">{job.location}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 truncate max-w-32 sm:max-w-none">
              {job.qualification}
            </Badge>
            {job.positions && (
              <Badge variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1 whitespace-nowrap">
                <Users className="h-3 w-3" />
                {job.positions} positions
              </Badge>
            )}
          </div>
          
          {/* Multiple Positions Display */}
          {positions.length > 0 && (
            <div className="mt-3 mb-2">
              <div className="flex items-center gap-1 mb-2">
                <Building2 className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Available Positions:</span>
              </div>
              <div className="space-y-2">
                {positions.map((position, index) => (
                  <div key={position.id} className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {position.positionName}
                      </span>
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                        {position.numberOfVacancies} vacancies
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-blue-700 dark:text-blue-300">
                      <span>• {position.qualification}</span>
                      {position.experienceRequired && (
                        <span>• Exp: {position.experienceRequired}</span>
                      )}
                      {position.salaryRange && (
                        <span>• ₹{position.salaryRange}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Date Info - Mobile Layout */}
          <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden flex justify-between">
            <span>Posted: {job.postedOn}</span>
            <span>Deadline: {job.deadline}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            <div>Posted: {job.postedOn} • Deadline: {job.deadline}</div>
          </div>
        </div>

        {/* Salary & Details Section - Mobile Responsive */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
          {/* Mobile: Stack vertically */}
          <div className="sm:hidden space-y-3">
            <div className="flex items-center justify-between">
              {job.salary && (
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-sm">{job.salary}</span>
                </div>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-32">
                <Globe className="h-3 w-3 inline mr-1" />
                {(() => {
                  try {
                    return new URL(job.sourceUrl).hostname;
                  } catch {
                    return 'Source site';
                  }
                })()}
              </div>
            </div>
            
            {/* Mobile Action Buttons - Larger Touch Targets */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveJob}
                className={`h-9 w-9 p-0 rounded-full ${isSaved ? 'text-orange-500 bg-orange-50' : 'text-gray-400'} hover:text-orange-600 hover:bg-orange-50`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareJob}
                className="h-9 w-9 p-0 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {onCompare && (
                <Button
                  variant={isComparing ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare();
                  }}
                  className={`text-xs px-4 h-9 rounded-full flex-1 max-w-24 ${
                    isComparing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isComparing ? '✓' : 'Compare'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              {job.salary && (
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <Globe className="h-3 w-3 inline mr-1" />
                {(() => {
                  try {
                    return new URL(job.sourceUrl).hostname;
                  } catch {
                    return 'Source site';
                  }
                })()}
              </div>
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveJob}
                className={`h-8 w-8 p-0 ${isSaved ? 'text-orange-500' : 'text-gray-400'} hover:text-orange-600`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareJob}
                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {onCompare && (
                <Button
                  variant={isComparing ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare();
                  }}
                  className={`text-xs px-3 h-8 ${
                    isComparing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isComparing ? '✓ Selected' : 'Compare'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {isExpired ? 'Application closed' : `${daysLeft} days to apply`}
          </div>
          
          <Button
            size="sm"
            className={`text-sm px-6 h-10 sm:h-8 sm:text-xs sm:px-4 w-full sm:w-auto ${
              isExpired 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
            onClick={isExpired ? undefined : onClick}
            disabled={isExpired}
          >
            {isExpired ? 'Expired' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
