import { useState } from "react";
import { Calendar, Clock, MapPin, Users, AlertCircle, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamEvent {
  id: string;
  title: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  type: 'preliminary' | 'main' | 'interview' | 'skill_test' | 'medical';
  registrationDeadline?: string;
  syllabus: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  expectedCandidates: number;
  fees: string;
  isRegistered: boolean;
}

interface ExamCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamCalendar({ isOpen, onClose }: ExamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [exams] = useState<ExamEvent[]>([]);

  const typeColors = {
    preliminary: 'bg-blue-500',
    main: 'bg-green-500',
    interview: 'bg-purple-500',
    skill_test: 'bg-orange-500',
    medical: 'bg-red-500'
  };

  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  };

  const getUpcomingExams = () => {
    const today = new Date();
    return exams
      .filter(exam => new Date(exam.date) >= today)
      .filter(exam => selectedCategory === 'all' || exam.type === selectedCategory)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getDaysUntilExam = (date: string) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isRegistrationOpen = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) > new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-semibold">Exam Calendar & Schedule</h2>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exam Types</SelectItem>
                <SelectItem value="preliminary">Preliminary</SelectItem>
                <SelectItem value="main">Main Exams</SelectItem>
                <SelectItem value="interview">Interviews</SelectItem>
                <SelectItem value="skill_test">Skill Tests</SelectItem>
                <SelectItem value="medical">Medical Tests</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{exams.filter(e => new Date(e.date) >= new Date()).length}</div>
                <div className="text-sm text-gray-600">Upcoming Exams</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{exams.filter(e => e.isRegistered).length}</div>
                <div className="text-sm text-gray-600">Registered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {exams.filter(e => e.registrationDeadline && isRegistrationOpen(e.registrationDeadline)).length}
                </div>
                <div className="text-sm text-gray-600">Registration Open</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {exams.filter(e => getDaysUntilExam(e.date) <= 7 && getDaysUntilExam(e.date) > 0).length}
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </CardContent>
            </Card>
          </div>

          {/* Exam List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Exams</h3>
              <div className="text-sm text-gray-600">
                {getUpcomingExams().length} exams scheduled
              </div>
            </div>

            {getUpcomingExams().map((exam) => {
              const daysUntil = getDaysUntilExam(exam.date);
              const regOpen = isRegistrationOpen(exam.registrationDeadline);
              
              return (
                <Card key={exam.id} className={`border-l-4 ${exam.isRegistered ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{exam.title}</h3>
                          <Badge className={`${typeColors[exam.type]} text-white text-xs`}>
                            {exam.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${difficultyColors[exam.difficulty]}`}>
                            {exam.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{exam.department}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium">{formatDate(exam.date)}</div>
                              <div className="text-xs text-gray-500">{exam.time}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="font-medium">Venue</div>
                              <div className="text-xs text-gray-500">{exam.venue}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            <div>
                              <div className="font-medium">{exam.expectedCandidates.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">Expected candidates</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className={`text-lg font-bold mb-1 ${
                          daysUntil <= 3 ? 'text-red-600' : 
                          daysUntil <= 7 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {daysUntil <= 0 ? 'Today' : `${daysUntil} days`}
                        </div>
                        <div className="text-xs text-gray-500">until exam</div>
                        
                        {exam.isRegistered ? (
                          <Badge className="bg-green-100 text-green-700 mt-2">
                            ✓ Registered
                          </Badge>
                        ) : regOpen ? (
                          <Badge className="bg-orange-100 text-orange-700 mt-2">
                            Registration Open
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-2">
                            Registration Closed
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Registration Deadline Alert */}
                    {exam.registrationDeadline && regOpen && !exam.isRegistered && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Registration Deadline: {exam.registrationDeadline}</span>
                          <span className="text-sm">({getDaysUntilExam(exam.registrationDeadline)} days left)</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Syllabus */}
                      <div>
                        <h4 className="font-medium mb-2">Syllabus</h4>
                        <div className="flex flex-wrap gap-1">
                          {exam.syllabus.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div>
                        <h4 className="font-medium mb-2">Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><strong>Exam Fee:</strong> {exam.fees}</div>
                          <div><strong>Difficulty:</strong> {exam.difficulty}</div>
                          {exam.registrationDeadline && (
                            <div><strong>Registration:</strong> {regOpen ? 'Open' : 'Closed'}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      {!exam.isRegistered && regOpen && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Register Now
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Add to Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {getUpcomingExams().length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No upcoming exams</h3>
                <p>Check back later for new exam schedules</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}