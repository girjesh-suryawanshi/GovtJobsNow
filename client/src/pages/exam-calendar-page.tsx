import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Globe, Users, Filter, Search, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Building2, PlusCircle, FileText, ExternalLink } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Exam } from "@shared/schema";

interface ExamCardProps {
  exam: Exam;
}

function ExamCard({ exam }: ExamCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRegistrationStatus = (startDate: string, endDate: string) => {
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
  };

  const examDaysLeft = getDaysUntil(exam.examDate);
  const regStatus = getRegistrationStatus(exam.registrationStartDate, exam.registrationEndDate);
  const regEndDays = getDaysUntil(exam.registrationEndDate);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden hover:border-blue-300 transform hover:-translate-y-1" data-testid={`exam-card-${exam.id}`}>
      {/* Top Banner Status */}
      <div className={`h-1 w-full ${regStatus.status === 'open' ? 'bg-emerald-500' : regStatus.status === 'upcoming' ? 'bg-amber-500' : 'bg-slate-300'}`} />
      
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 mb-1">
               <Badge variant="outline" className="font-semibold text-[10px] uppercase tracking-wider py-0 px-2 h-5 bg-blue-50 text-blue-700 border-blue-100">
                {exam.examMode || "Government Exam"}
              </Badge>
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

      <CardContent className="px-6 pb-6 space-y-5">
        {/* Date Timeline Style */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Exam Date
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800" data-testid="exam-date">
                {formatDate(exam.examDate)}
              </span>
              {examDaysLeft > 0 && (
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  {examDaysLeft} Days Remaining
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1 border-l pl-4 border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Deadline
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800" data-testid="registration-end">
                {formatDate(exam.registrationEndDate)}
              </span>
              {regEndDays > 0 && regStatus.status === 'open' && (
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  Last {regEndDays} Days
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="flex flex-wrap gap-2 pt-1">
          {exam.ageLimit && (
            <div className="flex items-center gap-1.5 bg-indigo-50/50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
              <Users className="h-3 w-3" />
              Age: {exam.ageLimit}
            </div>
          )}
          {exam.vacancies && (
            <div className="flex items-center gap-1.5 bg-sky-50/50 text-sky-700 px-3 py-1.5 rounded-full text-xs font-bold border border-sky-100">
              <PlusCircle className="h-3 w-3" />
              {exam.vacancies}
            </div>
          )}
          {exam.applicationFee && (
            <div className="flex items-center gap-1.5 bg-emerald-50/50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
              <FileText className="h-3 w-3" />
              Fee: {exam.applicationFee.includes("₹") ? exam.applicationFee : `₹${exam.applicationFee}`}
            </div>
          )}
        </div>

        {/* Summary Snippet */}
        {exam.examBrief && (
          <div className="relative group/brief">
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-blue-100 rounded-full group-hover/brief:bg-blue-400 transition-colors" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Exam Pattern & Summary</p>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 italic">
              "{exam.examBrief}"
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 pt-5">
          <Button
            size="sm"
            className="flex-1 bg-slate-900 hover:bg-blue-700 text-white font-bold h-10 shadow-lg shadow-slate-200 transition-all"
            onClick={() => exam.officialWebsite && window.open(exam.officialWebsite, '_blank')}
            data-testid="visit-website"
            disabled={!exam.officialWebsite}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Details & Apply
          </Button>
          {exam.syllabus && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 px-4" data-testid="view-syllabus">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Syllabus
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none">
                <div className="bg-slate-900 p-8 text-white relative">
                  <BookOpen className="h-16 w-16 text-white/10 absolute right-8 top-8" />
                  <DialogHeader className="relative z-10">
                    <DialogTitle className="text-3xl font-black mb-2">{exam.title}</DialogTitle>
                    <DialogDescription className="text-blue-300 font-bold uppercase tracking-widest text-xs">
                      {exam.conductingOrganization} • Official Syllabus Content
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="p-8 max-h-[60vh] overflow-y-auto bg-white">
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-base">
                    {exam.syllabus}
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t flex justify-end">
                   <Button 
                    onClick={() => exam.officialWebsite && window.open(exam.officialWebsite, '_blank')} 
                    className="bg-blue-600 font-bold"
                    disabled={!exam.officialWebsite}
                   >
                    Visit Official Site
                   </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
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

      // Sort exams
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "examDate":
            return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
          case "registrationEnd":
            return new Date(a.registrationEndDate).getTime() - new Date(b.registrationEndDate).getTime();
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
            The most reliable source for Indian government exam dates, registration deadlines, and syllabus information.
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