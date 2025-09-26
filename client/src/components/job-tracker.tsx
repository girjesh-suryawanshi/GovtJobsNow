import { useState } from "react";
import { Target, Calendar, FileText, CheckCircle, Clock, AlertCircle, Plus, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  deadline: string;
  status: 'applied' | 'under_review' | 'exam_scheduled' | 'interview_scheduled' | 'selected' | 'rejected';
  examDate?: string;
  interviewDate?: string;
  notes: string;
  documents: string[];
}

interface JobTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  jobToAdd?: Job;
}

export default function JobTracker({ isOpen, onClose, jobToAdd }: JobTrackerProps) {
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<Application[]>([]);

  const [newApplication, setNewApplication] = useState({
    jobTitle: jobToAdd?.title || '',
    department: jobToAdd?.department || '',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: jobToAdd?.deadline || '',
    status: 'applied' as const,
    notes: '',
    documents: [] as string[]
  });

  const [showAddForm, setShowAddForm] = useState(!!jobToAdd);
  const [newDocument, setNewDocument] = useState('');

  const statusConfig = {
    applied: { label: 'Applied', color: 'bg-blue-500', icon: FileText },
    under_review: { label: 'Under Review', color: 'bg-yellow-500', icon: Clock },
    exam_scheduled: { label: 'Exam Scheduled', color: 'bg-purple-500', icon: Calendar },
    interview_scheduled: { label: 'Interview Scheduled', color: 'bg-orange-500', icon: Calendar },
    selected: { label: 'Selected', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-500', icon: X }
  };

  const getStatusProgress = (status: string) => {
    const statusOrder = ['applied', 'under_review', 'exam_scheduled', 'interview_scheduled', 'selected'];
    const currentIndex = statusOrder.indexOf(status);
    return status === 'rejected' ? 0 : ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddApplication = () => {
    if (!newApplication.jobTitle || !newApplication.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title and department",
        variant: "destructive"
      });
      return;
    }

    const application: Application = {
      id: Date.now().toString(),
      jobId: Date.now().toString(),
      ...newApplication
    };

    setApplications([application, ...applications]);
    setNewApplication({
      jobTitle: '',
      department: '',
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'applied',
      notes: '',
      documents: []
    });
    setShowAddForm(false);

    toast({
      title: "Application Added",
      description: `"${application.jobTitle}" has been added to your tracker`
    });
  };

  const updateApplicationStatus = (appId: string, status: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status } : app
    ));

    const app = applications.find(a => a.id === appId);
    toast({
      title: "Status Updated",
      description: `"${app?.jobTitle}" status changed to ${statusConfig[status].label}`
    });
  };

  const addDocument = (appId: string) => {
    if (!newDocument.trim()) return;
    
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, documents: [...app.documents, newDocument] } : app
    ));
    setNewDocument('');
  };

  const removeDocument = (appId: string, docIndex: number) => {
    setApplications(applications.map(app => 
      app.id === appId ? { 
        ...app, 
        documents: app.documents.filter((_, i) => i !== docIndex) 
      } : app
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-semibold">Job Application Tracker</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <Card key={status}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center mx-auto mb-2`}>
                      <config.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-gray-600">{config.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add New Application Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={newApplication.jobTitle}
                      onChange={(e) => setNewApplication({...newApplication, jobTitle: e.target.value})}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={newApplication.department}
                      onChange={(e) => setNewApplication({...newApplication, department: e.target.value})}
                      placeholder="Enter department"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Applied Date</Label>
                    <Input
                      type="date"
                      value={newApplication.appliedDate}
                      onChange={(e) => setNewApplication({...newApplication, appliedDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Application Deadline</Label>
                    <Input
                      type="date"
                      value={newApplication.deadline}
                      onChange={(e) => setNewApplication({...newApplication, deadline: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                    placeholder="Add any notes about this application..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddApplication}>Add Application</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((app) => {
              const config = statusConfig[app.status];
              const progress = getStatusProgress(app.status);
              const daysLeft = getDaysLeft(app.deadline);
              
              return (
                <Card key={app.id} className="border-l-4" style={{borderLeftColor: config.color.replace('bg-', '#')}}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{app.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">{app.department}</Badge>
                          <span>Applied: {app.appliedDate}</span>
                          <span className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Select value={app.status} onValueChange={(value: any) => updateApplicationStatus(app.id, value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <config.icon className="h-4 w-4" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Application Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Important Dates */}
                    {(app.examDate || app.interviewDate) && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Important Dates</span>
                        </div>
                        {app.examDate && (
                          <div className="text-sm text-blue-700">Exam: {app.examDate}</div>
                        )}
                        {app.interviewDate && (
                          <div className="text-sm text-blue-700">Interview: {app.interviewDate}</div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {app.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Notes</h4>
                        <p className="text-sm text-gray-600">{app.notes}</p>
                      </div>
                    )}

                    {/* Documents */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Documents ({app.documents.length})</h4>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Add document..."
                            value={newDocument}
                            onChange={(e) => setNewDocument(e.target.value)}
                            className="w-40 h-8"
                          />
                          <Button size="sm" onClick={() => addDocument(app.id)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {app.documents.map((doc, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {doc}
                            <button 
                              onClick={() => removeDocument(app.id, index)}
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {applications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No applications tracked yet</h3>
                <p className="mb-4">Start tracking your job applications to stay organized</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}