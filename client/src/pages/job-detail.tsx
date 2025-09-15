import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Users, Calendar, IndianRupee, Bookmark, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ExamCalendar from "@/components/exam-calendar";
import { apiRequest } from "@/lib/api";
import type { Job } from "@/types/job";

export default function JobDetail() {
  const { id } = useParams();
  const [showExamCalendar, setShowExamCalendar] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/jobs/${id}`);
      return response.json() as Promise<Job>;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this government job opportunity: ${job.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onOpenExamCalendar={() => setShowExamCalendar(true)}
        onScrollToDepartments={() => window.location.href = '/#departments'}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                <div className="flex flex-wrap gap-3 mb-4">
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
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      <span className="font-medium">Positions:</span> {job.positions || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      <span className="font-medium">Age Limit:</span> {job.ageLimit || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      <span className="font-medium">Salary:</span> {job.salary || 'As per norms'}
                    </span>
                  </div>
                </div>
              </div>

              {job.description && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700">{job.description}</p>
                  </div>
                </div>
              )}

              {job.selectionProcess && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Selection Process</h3>
                  <div className="space-y-2">
                    {job.selectionProcess.split(',').map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Important Dates</h4>
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

                  <Separator />

                  {job.applicationFee && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Application Fee</h4>
                      <p className="text-sm text-gray-700">{job.applicationFee}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(job.applyLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p><span className="font-medium">Source:</span> {job.sourceUrl}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <ExamCalendar
        isOpen={showExamCalendar}
        onClose={() => setShowExamCalendar(false)}
      />
    </div>
  );
}
