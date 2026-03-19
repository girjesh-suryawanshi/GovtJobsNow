import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  User,
  ChevronDown,
  Briefcase,
  Calendar,
  Users,
  LayoutDashboard
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import ManualJobEntry from "@/components/admin/manual-job-entry";
import ManualExamEntry from "@/components/admin/manual-exam-entry";
import AdminManagement from "@/components/admin/admin-management";
import SignUpUserManagement from "@/components/admin/signup-user-management";

interface DashboardStats {
  totalProcessed: number;
  successfulExtractions: number;
  failedExtractions: number;
  reviewRequired: number;
  avgProcessingTime: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "exams" | "signup-users" | "admins">("jobs");
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    try {
      const response = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const user = await response.json();
      setAdminUser(user);

      const statsResponse = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      localStorage.removeItem("admin_token");
      setLocation("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Intelligent Job Posting System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mr-4">
                <User className="h-4 w-4" />
                <span>Welcome, {adminUser?.username}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProcessed || 0}</div>
              <p className="text-xs text-gray-600">URLs processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.successfulExtractions || 0}
              </div>
              <p className="text-xs text-gray-600">Auto-published jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Review Required</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.reviewRequired || 0}
              </div>
              <p className="text-xs text-gray-600">Need admin review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.avgProcessingTime ? `${Math.round(stats.avgProcessingTime / 1000)}s` : '0s'}
              </div>
              <p className="text-xs text-gray-600">Per URL</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Content</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "jobs" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    Job Management
                  </button>
                  <button
                    onClick={() => setActiveTab("exams")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "exams" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Exam Calendar
                  </button>
                </nav>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Administration</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("signup-users")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "signup-users" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActiveTab("admins")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "admins" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Admin Settings
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[600px]">
              {activeTab === "jobs" && <ManualJobEntry onJobAdded={checkAuthAndFetchData} />}
              {activeTab === "exams" && <ManualExamEntry />}
              {activeTab === "signup-users" && <SignUpUserManagement />}
              {activeTab === "admins" && <AdminManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}