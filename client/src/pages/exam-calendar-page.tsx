import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Globe, Users, Filter, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
      return { status: 'upcoming', text: 'Registration Not Started', color: 'bg-gray-100 text-gray-700' };
    } else if (now >= start && now <= end) {
      return { status: 'open', text: 'Registration Open', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'closed', text: 'Registration Closed', color: 'bg-red-100 text-red-700' };
    }
  };

  const examDaysLeft = getDaysUntil(exam.examDate);
  const regStatus = getRegistrationStatus(exam.registrationStartDate, exam.registrationEndDate);
  const regEndDays = getDaysUntil(exam.registrationEndDate);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500" data-testid={`exam-card-${exam.id}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {exam.title}
            </CardTitle>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {exam.conductingOrganization}
            </p>
          </div>
          <Badge className={regStatus.color} data-testid="registration-status">
            {regStatus.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Important Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Exam Date</p>
              <p className="text-sm font-medium" data-testid="exam-date">
                {formatDate(exam.examDate)}
                {examDaysLeft > 0 && (
                  <span className="ml-2 text-xs text-orange-600">
                    ({examDaysLeft} days left)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Registration Ends</p>
              <p className="text-sm font-medium" data-testid="registration-end">
                {formatDate(exam.registrationEndDate)}
                {regEndDays > 0 && regStatus.status === 'open' && (
                  <span className="ml-2 text-xs text-red-600 font-semibold">
                    ({regEndDays} days left)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="space-y-2">
          {exam.examPattern && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {exam.examPattern}
              </Badge>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {exam.examMode && (
              <Badge variant="secondary" className="text-xs">
                {exam.examMode}
              </Badge>
            )}
            {exam.duration && (
              <Badge variant="secondary" className="text-xs">
                Duration: {exam.duration}
              </Badge>
            )}
            {exam.totalMarks && (
              <Badge variant="secondary" className="text-xs">
                {exam.totalMarks} Marks
              </Badge>
            )}
          </div>

          {exam.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{exam.location}</span>
            </div>
          )}

          {exam.applicationFee && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Application Fee: <span className="font-medium text-green-600">{exam.applicationFee}</span>
              </span>
            </div>
          )}
        </div>

        {/* Eligibility */}
        {exam.eligibility && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Eligibility</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{exam.eligibility}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(exam.officialWebsite, '_blank')}
            data-testid="visit-website"
          >
            <Globe className="h-4 w-4 mr-2" />
            Visit Official Website
          </Button>
          {exam.syllabus && (
            <Button variant="outline" size="sm" data-testid="view-syllabus">
              View Syllabus
            </Button>
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
          exam.conductingOrganization.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesOrg = selectedOrganization === "all" || 
          exam.conductingOrganization.toLowerCase().includes(selectedOrganization.toLowerCase());

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

  const organizations = exams ? Array.from(new Set(exams.map(exam => exam.conductingOrganization))) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Government Exam Calendar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with upcoming government exams, registration dates, and important schedules
          </p>
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