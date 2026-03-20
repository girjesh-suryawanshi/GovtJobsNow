import { useState, useEffect } from "react";
import { Target, Calendar, FileText, CheckCircle, Clock, AlertCircle, Plus, X, Edit2, Download, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/types/job";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  deadline: string;
  status: 'applied' | 'admit_card_out' | 'exam_scheduled' | 'result_out' | 'selected' | 'rejected';
  examDate?: string;
  admitCardLink?: string;
  notes: string;
  documents: string[];
}

interface StatusItem {
  label: string;
  color: string;
  icon: any;
  step: number;
  actionRequired?: boolean;
}

const statusConfig: Record<Application['status'], StatusItem> = {
  applied: { label: 'Applied', color: 'bg-blue-500', icon: FileText, step: 1 },
  admit_card_out: { label: 'Admit Card Out', color: 'bg-orange-600', icon: Bell, step: 2, actionRequired: true },
  exam_scheduled: { label: 'Exam Scheduled', color: 'bg-purple-600', icon: Calendar, step: 3 },
  result_out: { label: 'Result Declared', color: 'bg-sky-600', icon: Sparkles, step: 4, actionRequired: true },
  selected: { label: 'Selected', color: 'bg-green-600', icon: CheckCircle, step: 5 },
  rejected: { label: 'Not Selected', color: 'bg-gray-500', icon: X, step: 0 }
};

interface JobTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  jobToAdd?: Job;
}

export default function JobTracker({ isOpen, onClose, jobToAdd }: JobTrackerProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    jobTitle: '',
    department: '',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'applied' as const,
    notes: '',
    documents: [] as string[]
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gj_tracker_apps');
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
      } catch (e) { console.error('Failed to load tracker', e); }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gj_tracker_apps', JSON.stringify(applications));
  }, [applications]);

  // Handle jobToAdd prop
  useEffect(() => {
    if (isOpen && jobToAdd) {
      // Check if already tracking
      if (applications.some(a => a.jobId === jobToAdd.id?.toString())) {
        return;
      }
      setNewApplication({
        jobTitle: jobToAdd.title,
        department: jobToAdd.department,
        appliedDate: new Date().toISOString().split('T')[0],
        deadline: jobToAdd.deadline,
        status: 'applied',
        notes: '',
        documents: []
      });
      setShowAddForm(true);
    }
  }, [isOpen, jobToAdd, applications.length]);

  const handleAddApplication = () => {
    if (!newApplication.jobTitle) return;
    const app: Application = {
      id: Date.now().toString(),
      jobId: jobToAdd?.id?.toString() || Date.now().toString(),
      ...newApplication
    };
    setApplications([app, ...applications]);
    setShowAddForm(false);
    toast({ title: "Application Tracked", description: "Monitoring milestones for " + app.jobTitle });
  };

  const updateStatus = (id: string, status: Application['status']) => {
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    toast({ title: "Status Updated", description: "Progress saved." });
  };

  const deleteApp = (id: string) => {
    setApplications(apps => apps.filter(a => a.id !== id));
    toast({ title: "Job Removed", description: "Successfully removed from tracker." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden border-none rounded-3xl shadow-2xl flex flex-col bg-white dark:bg-gray-900 z-[110]">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 dark:shadow-none shrink-0">
                <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Job Watchtower</DialogTitle>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest leading-none truncate">Monitoring Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <Button 
                variant="outline" 
                className="hidden sm:inline-flex rounded-full px-5 border-gray-200 dark:border-gray-700 h-10 text-xs font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Track Custom Job'}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-11 w-11 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" 
                onClick={onClose}
              >
                <X className="h-6 w-6 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
            {showAddForm && (
              <Card className="mb-8 border-2 border-blue-50 dark:border-blue-900/30 shadow-sm rounded-2xl overflow-hidden bg-blue-50/10 dark:bg-blue-900/10">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Title</Label>
                      <Input value={newApplication.jobTitle} onChange={e => setNewApplication({...newApplication, jobTitle: e.target.value})} className="rounded-xl border-gray-200 dark:border-gray-700 h-11 bg-white dark:bg-gray-800" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Organization / Dept</Label>
                      <Input value={newApplication.department} onChange={e => setNewApplication({...newApplication, department: e.target.value})} className="rounded-xl border-gray-200 dark:border-gray-700 h-11 bg-white dark:bg-gray-800" />
                    </div>
                  </div>
                  <Button onClick={handleAddApplication} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-100">
                    <Target className="h-4 w-4 mr-2" /> Start Tracking This Job
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              {applications.length === 0 && !showAddForm ? (
                <div className="text-center py-20">
                  <div className="bg-gray-50 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-12 w-12 text-gray-200 dark:text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active tracks</h3>
                  <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">Save jobs to track milestones like admit cards, exam dates, and results in real-time.</p>
                  <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 rounded-full px-8 h-11 font-bold">Start Tracking Now</Button>
                </div>
              ) : (
                applications.map((app) => {
                  const config = statusConfig[app.status];
                  return (
                    <Card key={app.id} className="rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white dark:bg-gray-800">
                      <CardContent className="p-0">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{app.jobTitle}</h3>
                              {config.actionRequired && (
                                <Badge className="bg-orange-500 text-white animate-bounce border-none text-[10px] font-black px-2 py-0.5">ALERT</Badge>
                              )}
                            </div>
                            <p className="text-xs text-blue-600 font-black uppercase tracking-widest">{app.department}</p>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <Select value={app.status} onValueChange={(val: any) => updateStatus(app.id, val)}>
                              <SelectTrigger className="w-full sm:w-48 rounded-2xl border-none bg-gray-50 dark:bg-gray-700 h-11 font-bold text-sm text-gray-900 dark:text-gray-100">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-2xl">
                                {Object.entries(statusConfig).map(([k, v]) => (
                                  <SelectItem key={k} value={k} className="rounded-xl my-1 focus:bg-blue-50">
                                    <div className="flex items-center gap-2">
                                      <v.icon className={`h-4 w-4 ${v.color.replace('bg-', 'text-')}`} />
                                      <span className="font-medium">{v.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="text-gray-200 hover:text-red-500 h-11 w-11 rounded-2xl" onClick={() => deleteApp(app.id)}>
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Timeline Overlay */}
                        <div className="bg-gray-50/50 dark:bg-gray-900/50 px-8 py-10 relative">
                          <div className="absolute top-1/2 left-8 right-8 h-1 bg-white dark:bg-gray-800 -translate-y-1/2 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(config.step / 5) * 100}%` }} />
                          </div>
                          <div className="relative flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map((s) => {
                              const isPast = config.step >= s;
                              const isCurrent = config.step === s;
                              const labels = ['Applied', 'Admit Card', 'Exam', 'Result', 'Selected'];
                              const icons = [FileText, Bell, Calendar, Sparkles, CheckCircle];
                              const StepIcon = icons[s-1];
                              return (
                                <div key={s} className="relative z-10 flex flex-col items-center">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                    isPast ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-110' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-200'
                                  }`}>
                                    <StepIcon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                  </div>
                                  <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-tighter text-center w-20 leading-tight transition-colors ${isCurrent ? 'text-blue-600' : 'text-gray-300'}`}>
                                    {labels[s-1]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-gray-50 dark:ring-gray-800">
                          <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              <AlertCircle className="h-4 w-4" /> Milestone Status
                            </h4>
                            {app.status === 'applied' && (
                              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
                                Successfully applied on <span className="font-black underline">{app.appliedDate}</span>. We'll alert you when the <span className="font-black italic underline">Admit Card</span> link appears on official site.
                              </div>
                            )}
                            {app.status === 'admit_card_out' && (
                              <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-3xl border border-orange-100 dark:border-orange-800 flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1">
                                  <p className="text-orange-900 dark:text-orange-100 font-black text-base italic">Admit Card is LIVE!</p>
                                  <p className="text-orange-800 dark:text-orange-300 text-xs">Download immediately to confirm your exam center.</p>
                                </div>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl h-11 px-6 shadow-xl shadow-orange-100 dark:shadow-none">
                                  <Download className="h-4 w-4 mr-2" /> DOWNLOAD
                                </Button>
                              </div>
                            )}
                            {app.status === 'exam_scheduled' && (
                              <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-3xl border border-purple-100 dark:border-purple-800 text-purple-900 dark:text-purple-100 text-sm">
                                Focused Study Mode! Exam date approaching. Access study guides in the <b>Instant Content Hub</b>.
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              <Edit2 className="h-4 w-4" /> Application Vault
                            </h4>
                            <Textarea 
                              placeholder="Roll No, Registration ID, Password, Exam Center..." 
                              className="rounded-[1.5rem] border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 text-sm h-32 p-4 focus:ring-blue-100" 
                              value={app.notes} 
                              onChange={e => {
                                  const newApps = [...applications];
                                  const index = newApps.findIndex(a => a.id === app.id);
                                  newApps[index].notes = e.target.value;
                                  setApplications(newApps);
                              }} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}