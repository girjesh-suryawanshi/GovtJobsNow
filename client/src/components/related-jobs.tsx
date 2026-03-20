import React from "react";
import { useQuery } from "@tanstack/react-query";
import { type Job } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import OrganizationLogo from "./organization-logo";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedJobsProps {
  jobId: string;
}

/**
 * Related Jobs section for the bottom of the job detail page.
 * Increases internal linking (SEO) and user session duration.
 */
export const RelatedJobs: React.FC<RelatedJobsProps> = ({ jobId }) => {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: [`/api/jobs/${jobId}/related`],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="py-8 border-t border-muted/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold tracking-tight text-foreground">
          You Might Also Be Interested In
        </h3>
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-2 py-0 border-primary/30 text-primary">
          Related Openings
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <Link key={job.id} href={`/job/${job.id}`}>
            <Card className="h-full border border-muted/50 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary/5 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <OrganizationLogo 
                      department={job.department}
                      recruitingOrganization={job.recruitingOrganization || job.department} 
                      className="w-8 h-8"
                    />
                  </div>
                  <Badge variant="secondary" className="text-[9px] h-5">
                    {job.jobCategory || "Jobs"}
                  </Badge>
                </div>

                <h4 className="font-extrabold text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug">
                  {job.title}
                </h4>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                    <MapPin className="mr-1 h-3 w-3 text-primary/60" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                    <Calendar className="mr-1 h-3 w-3 text-primary/60" />
                    Until {job.deadline}
                  </div>
                  
                  <div className="pt-2 flex items-center text-[10px] font-extrabold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
