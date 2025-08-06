import { useState } from "react";
import { X, MapPin, Users, Calendar, IndianRupee, Bookmark, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/types/job";

interface JobDetailModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
  };

  const handleShareJob = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this government job: ${job.title}`,
          url: `${window.location.origin}/job/${job.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/job/${job.id}`);
    }
  };

  const handleApplyNow = () => {
    // Always redirect to the source website where users can find the real application link
    window.open(job.sourceUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="job-description">
        <DialogTitle className="sr-only">Job Details for {job.title}</DialogTitle>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {job.department}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        <span className="font-medium">Qualification:</span> {job.qualification}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-gray-400 w-5 h-5 mr-3" />
                      <span className="text-gray-700">
                        <span className="font-medium">Positions:</span> {job.positions || 'Not specified'}
                      </span>
                    </div>
                    {job.ageLimit && (
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 w-5 h-5 mr-3" />
                        <span className="text-gray-700">
                          <span className="font-medium">Age Limit:</span> {job.ageLimit}
                        </span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center">
                        <IndianRupee className="text-gray-400 w-5 h-5 mr-3" />
                        <span className="text-gray-700">
                          <span className="font-medium">Salary:</span> {job.salary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {job.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                    <div id="job-description" className="text-gray-700 space-y-2">
                      <p>{job.description}</p>
                    </div>
                  </div>
                )}
                
                {job.selectionProcess && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Selection Process</h3>
                    <div className="space-y-2">
                      {job.selectionProcess.split(',').map((step, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Important Dates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted On:</span>
                      <span className="font-medium">{job.postedOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Date:</span>
                      <span className="font-medium text-red-600">{job.deadline}</span>
                    </div>
                  </div>
                </div>
                
                {job.applicationFee && (
                  <div>
                    <h4 className="font-semibold mb-2">Application Fee</h4>
                    <p className="text-sm text-gray-700">{job.applicationFee}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleApplyNow}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply on Official Website
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Redirects to {new URL(job.sourceUrl).hostname}
                  </p>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleSaveJob}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                      Save Job
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleShareJob}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
