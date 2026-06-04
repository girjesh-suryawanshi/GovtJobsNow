import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, Clock, MapPin, Globe, Users, Filter, Search, 
  ChevronDown, BookOpen, Building2, PlusCircle, FileText, 
  ExternalLink, Share2, Info, Timer
} from "lucide-react";
import SocialShare from "@/components/social-share";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Exam } from "@shared/schema";

interface ExamCardProps {
  exam: Exam;
}

function ExamCard({ exam }: ExamCardProps) {
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return as is if not a valid date string
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getDaysUntil = (dateString: string | undefined | null) => {
    if (!dateString) return 0;
    try {
      const targetDate = new Date(dateString);
      if (isNaN(targetDate.getTime())) return 0;
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 0;
    }
  };

  const getRegistrationStatus = (startDate: string | undefined | null, endDate: string | undefined | null) => {
    if (!startDate || !endDate) return { status: 'unknown', text: 'Check Dates', color: 'bg-slate-50 text-slate-500 border-slate-100' };
    
    try {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) {
        return { status: 'upcoming', text: 'Opening Soon', color: 'bg-amber-50 text-amber-700 border-amber-100' };
      } else if (now >= start && now <= end) {
        return { status: 'open', text: 'Register Now', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      } else {
        return { status: 'closed', text: 'Closed', color: 'bg-slate-50 text-slate-500 border-slate-100' };
      }
    } catch (e) {
      return { status: 'unknown', text: 'Check Dates', color: 'bg-slate-50 text-slate-500 border-slate-100' };
    }
  };

  const examDaysLeft = getDaysUntil(exam.examDate);
  const regStatus = getRegistrationStatus(exam.registrationStartDate, exam.registrationEndDate);
  const regEndDays = getDaysUntil(exam.registrationEndDate);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden hover:border-blue-300 transform hover:-translate-y-1" data-testid={`exam-card-${exam.id}`}>
      {/* Top Banner Status */}
      <div className={`h-1 w-full ${regStatus.status === 'open' ? 'bg-emerald-500' : regStatus.status === 'upcoming' ? 'bg-amber-500' : 'bg-slate-300'}`} />
      
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${regStatus.color} font-bold text-[10px] uppercase tracking-wider h-5 py-0 px-2`} data-testid="registration-status">
                {regStatus.text}
              </Badge>
            </div>
            <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-700 transition-colors">
              {exam.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <Building2 className="h-4 w-4 text-slate-400" />
              {exam.conductingOrganization}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-4">
        {/* Main Info List in User Requested Order */}
        <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          {/* 1. Registration Start Date */}
          {exam.registrationStartDate && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Registration Start</span>
              <span className="text-sm font-bold text-slate-800">{formatDate(exam.registrationStartDate)}</span>
            </div>
          )}
          
          {/* 2. Registration End Date */}
          {exam.registrationEndDate && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">2. Registration End</span>
                {regEndDays > 0 && regStatus.status === 'open' && (
                  <span className="text-[9px] font-bold text-rose-500 uppercase">Closing in {regEndDays} Days</span>
                )}
              </div>
              <span className="text-sm font-bold text-slate-800">{formatDate(exam.registrationEndDate)}</span>
            </div>
          )}

          {/* 3. Exam Date */}
          {exam.examDate && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3. Exam Date</span>
                {examDaysLeft > 0 && (
                  <span className="text-[9px] font-bold text-amber-600 uppercase">{examDaysLeft} Days Left</span>
                )}
              </div>
              <span className="text-sm font-black text-blue-700 underline decoration-blue-100 underline-offset-4">{formatDate(exam.examDate)}</span>
            </div>
          )}

          {/* 4. Admit Card Release Date */}
          {exam.admitCardDate && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4. Admit Card Release</span>
              <span className="text-sm font-bold text-slate-700">{formatDate(exam.admitCardDate)}</span>
            </div>
          )}

          {/* 5. Results Date (Expected) */}
          {exam.resultsDate && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5. Results (Exp.)</span>
              <span className="text-sm font-bold text-slate-700">{formatDate(exam.resultsDate)}</span>
            </div>
          )}

          {/* 6. Number of Vacancies */}
          {exam.vacancies && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100/50 last:border-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">6. Vacancies</span>
              <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">{exam.vacancies}</span>
            </div>
          )}
        </div>

        {/* Official Notifications & Custom Links - Added as requested */}
        {(((exam.notifications as any[])?.length || 0) > 0 || ((exam.customLinks as any[])?.length || 0) > 0) && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {((exam.notifications as any[])?.length || 0) > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Official Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {(exam.notifications as any[]).map((notif, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(notif.url, '_blank')}
                      className="h-8 text-[10px] font-bold border-blue-100 text-blue-600 bg-blue-50/30 hover:bg-blue-600 hover:text-white rounded-lg px-3 transition-all"
                    >
                      {notif.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {((exam.customLinks as any[])?.length || 0) > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Helpful Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {(exam.customLinks as any[]).map((link, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(link.url, '_blank')}
                      className="h-8 text-[10px] font-bold border-amber-200 text-amber-700 bg-amber-50/30 hover:bg-amber-600 hover:text-white rounded-lg px-3 transition-all"
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. Official Website & Actions */}
        <div className="flex items-center gap-2 pt-2">
          {exam.officialWebsite ? (
            <Button
              className="flex-1 bg-slate-900 hover:bg-blue-700 text-white font-black h-12 shadow-xl shadow-slate-200 transition-all rounded-xl gap-3"
              onClick={() => window.open(exam.officialWebsite || undefined, '_blank')}
            >
              <Globe className="h-5 w-5" />
              7. VISIT OFFICIAL WEBSITE
              <ExternalLink className="h-4 w-4 opacity-50" />
            </Button>
          ) : (
            <div className="flex-1 h-12 flex items-center justify-center bg-slate-100 text-slate-400 font-bold rounded-xl text-xs uppercase tracking-widest whitespace-nowrap">
              No Official URL Provided
            </div>
          )}

          <SocialShare 
            url={`${window.location.origin}/exam/${exam.slug || exam.id}`}
            title={`Official Exam Update: ${exam.title} (${exam.conductingOrganization})`}
            trigger={
              <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl">
                <Share2 className="h-5 w-5" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>


  );
}

function ExamCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-gray-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamCalendarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [sortBy, setSortBy] = useState("examDate");

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ["/api/exams"],
    select: (data: Exam[]) => {
      // Filter exams based on search and organization
      let filtered = data.filter((exam) => {
        const matchesSearch = !searchTerm ||
          exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (exam.conductingOrganization?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesOrg = selectedOrganization === "all" ||
          (exam.conductingOrganization?.toLowerCase() || "").includes(selectedOrganization.toLowerCase());

        return matchesSearch && matchesOrg;
      });

        filtered.sort((a, b) => {
          switch (sortBy) {
            case "examDate":
              return new Date(a.examDate || 0).getTime() - new Date(b.examDate || 0).getTime();
            case "registrationEnd":
              return new Date(a.registrationEndDate || 0).getTime() - new Date(b.registrationEndDate || 0).getTime();
            case "title":
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });

      return filtered;
    }
  });

  const organizations = exams ? Array.from(new Set(exams.map(exam => exam.conductingOrganization).filter((org): org is string => !!org))) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-blue-600 text-white font-black px-4 py-1 uppercase tracking-widest text-[10px] rounded-full">
            Live Updates
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Government <span className="text-blue-600">Exam Calendar</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            The most reliable source for Indian government exam dates, registration deadlines, and official notifications.
          </p>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium mb-2">
                  Search Exams
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by exam name or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium mb-2">
                  Organization
                </label>
                <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                  <SelectTrigger data-testid="organization-filter">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org} value={org.toLowerCase()}>
                        {org}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="sort" className="block text-sm font-medium mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="sort-filter">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="examDate">Exam Date</SelectItem>
                    <SelectItem value="registrationEnd">Registration Deadline</SelectItem>
                    <SelectItem value="title">Exam Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          {exams && (
            <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="results-count">
              {exams.length} exam{exams.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <ExamCardSkeleton key={index} />
            ))
          ) : error ? (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400">
                  Failed to load exams. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : exams && exams.length > 0 ? (
            exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No exams found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}