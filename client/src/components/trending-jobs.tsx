import React from "react";
import { useQuery } from "@tanstack/react-query";
import { type Job } from "@shared/schema";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Trending Jobs component for the sidebar.
 * Increases engagement and surface high-traffic content.
 */
export const TrendingJobs: React.FC = () => {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs/trending"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-primary/20">
        <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
        <h3 className="font-extrabold text-sm tracking-tight text-foreground uppercase">
          Trending Now
        </h3>
      </div>

      <div className="space-y-3">
        {jobs.map((job, index) => (
          <Link key={job.id} href={`/job/${job.id}`}>
            <div className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-primary/5 transition-all cursor-pointer border border-transparent hover:border-primary/10">
              <span className="text-xl font-black text-primary/10 group-hover:text-primary/20 transition-colors pt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h4>
                <div className="flex items-center mt-1.5 space-x-3">
                  <div className="flex items-center text-[9px] text-muted-foreground font-bold">
                    <Eye className="mr-1 h-3 w-3 text-primary/40" />
                    {job.viewCount || 0} views
                  </div>
                  <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-extrabold bg-primary/5 border-none text-primary/70 uppercase">
                    {job.jobCategory ? job.jobCategory.split(" ")[0] : "New"}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
