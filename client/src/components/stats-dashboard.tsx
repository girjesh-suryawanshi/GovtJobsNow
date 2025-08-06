import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Building2, Clock } from "lucide-react";

interface JobStats {
  totalJobs: number;
  newToday: number;
  departments: number;
  applications: number;
}

export default function StatsDashboard() {
  const { data: stats, isLoading } = useQuery<JobStats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds for live stats
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const statCards = [
    {
      title: "Total Active Jobs",
      value: formatNumber(stats.totalJobs),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtext: "Live government positions"
    },
    {
      title: "New Jobs Today",
      value: formatNumber(stats.newToday),
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtext: "Added in last 24 hours"
    },
    {
      title: "Total Departments",
      value: formatNumber(stats.departments),
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      subtext: "Government organizations"
    },
    {
      title: "Application Estimates",
      value: formatNumber(stats.applications),
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subtext: "Expected total applications"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-3 w-3 ${stat.color}`} />
              </div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-xs font-medium text-gray-600">
              {stat.title}
            </div>
          </Card>
        );
      })}
    </div>
  );
}