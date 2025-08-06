import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Users, MapPin, Calendar, IndianRupee, GraduationCap, Building2 } from "lucide-react";
import type { Job } from "@/types/job";

interface JobComparisonProps {
  jobs: Job[];
  onRemove: (jobId: string) => void;
  onClose: () => void;
}

export default function JobComparison({ jobs, onRemove, onClose }: JobComparisonProps) {
  if (jobs.length === 0) return null;

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { text: 'Expired', color: 'text-red-600 bg-red-100' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-red-700 bg-red-100' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-orange-700 bg-orange-100' };
    if (diffDays <= 15) return { text: `${diffDays} days left`, color: 'text-yellow-700 bg-yellow-100' };
    return { text: `${diffDays} days left`, color: 'text-green-700 bg-green-100' };
  };

  const extractSalaryNumber = (salary: string | null | undefined) => {
    if (!salary) return 0;
    const matches = salary.match(/₹?([\d,]+)/);
    return matches ? parseInt(matches[1].replace(/,/g, '')) : 0;
  };

  const compareSalary = (salary: string | null | undefined) => {
    const amount = extractSalaryNumber(salary);
    if (amount === 0) return { score: 0, color: 'text-gray-500' };
    if (amount < 20000) return { score: 1, color: 'text-red-500' };
    if (amount < 35000) return { score: 2, color: 'text-orange-500' };
    if (amount < 50000) return { score: 3, color: 'text-yellow-600' };
    if (amount < 75000) return { score: 4, color: 'text-blue-600' };
    return { score: 5, color: 'text-green-600' };
  };

  const compareQualification = (qual: string) => {
    const qualLower = qual.toLowerCase();
    if (qualLower.includes('10th')) return { score: 1, level: 'Basic' };
    if (qualLower.includes('12th')) return { score: 2, level: 'Intermediate' };
    if (qualLower.includes('graduate') || qualLower.includes('b.')) return { score: 3, level: 'Graduate' };
    if (qualLower.includes('post') || qualLower.includes('m.')) return { score: 4, level: 'Post Graduate' };
    if (qualLower.includes('engineering') || qualLower.includes('b.tech')) return { score: 4, level: 'Technical' };
    return { score: 2, level: 'Standard' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Job Comparison ({jobs.length}/3)</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className={`grid gap-4 ${jobs.length === 1 ? 'grid-cols-1' : jobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {jobs.map((job, index) => {
              const deadlineInfo = formatDeadline(job.deadline);
              const salaryInfo = compareSalary(job.salary);
              const qualInfo = compareQualification(job.qualification);
              
              return (
                <Card key={job.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => onRemove(job.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 pr-8">
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Department */}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{job.department}</span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    
                    {/* Salary Comparison */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Salary</span>
                        <div className="flex ml-auto">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full mr-1 ${
                                i < salaryInfo.score ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${salaryInfo.color}`}>
                        {job.salary || 'Not specified'}
                      </p>
                    </div>
                    
                    {/* Qualification */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Qualification</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {qualInfo.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{job.qualification}</p>
                    </div>
                    
                    {/* Positions */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Positions:</span>
                      <span className="text-sm font-bold text-orange-600">{job.positions || 1}</span>
                    </div>
                    
                    {/* Deadline */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Deadline</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{job.deadline}</p>
                        <Badge className={`text-xs ${deadlineInfo.color}`}>
                          {deadlineInfo.text}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Age Limit */}
                    {job.ageLimit && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Age Limit:</span>
                        <p className="text-sm text-gray-600">{job.ageLimit}</p>
                      </div>
                    )}
                    
                    {/* Application Fee */}
                    {job.applicationFee && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Application Fee:</span>
                        <p className="text-sm text-gray-600">{job.applicationFee}</p>
                      </div>
                    )}
                    
                    {/* Apply Button */}
                    <Button 
                      className="w-full mt-4"
                      onClick={() => window.open(job.applyLink, '_blank')}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {jobs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Comparison Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-blue-800">Highest Salary:</strong>
                  <p className="text-blue-700">
                    {jobs.reduce((best, job) => 
                      extractSalaryNumber(job.salary) > extractSalaryNumber(best.salary) ? job : best
                    ).title} - {jobs.reduce((best, job) => 
                      extractSalaryNumber(job.salary) > extractSalaryNumber(best.salary) ? job : best
                    ).salary}
                  </p>
                </div>
                <div>
                  <strong className="text-blue-800">Most Positions:</strong>
                  <p className="text-blue-700">
                    {jobs.reduce((best, job) => 
                      (job.positions || 1) > (best.positions || 1) ? job : best
                    ).title} - {jobs.reduce((best, job) => 
                      (job.positions || 1) > (best.positions || 1) ? job : best
                    ).positions} positions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}