import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

interface Stats {
  totalJobs: number;
  newToday: number;
  departments: number;
  applications: number;
}

export default function StatsSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/stats");
      return response.json() as Promise<Stats>;
    },
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-blue-600">
              {stats?.totalJobs?.toLocaleString() || "0"}
            </div>
            <p className="text-gray-600 mt-2">Active Jobs</p>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-green-600">
              {stats?.newToday?.toLocaleString() || "0"}
            </div>
            <p className="text-gray-600 mt-2">New Today</p>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-orange-600">
              {stats?.departments?.toLocaleString() || "0"}
            </div>
            <p className="text-gray-600 mt-2">Departments</p>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-red-600">
              {stats?.applications?.toLocaleString() || "0"}
            </div>
            <p className="text-gray-600 mt-2">Applications</p>
          </div>
        </div>
      </div>
    </section>
  );
}
