import { useState } from "react";
import { Bell, Mail, Smartphone, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JobAlert {
  id: string;
  title: string;
  keywords: string;
  location: string;
  department: string;
  salaryRange: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  matchingJobs: number;
}

interface JobAlertsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobAlerts({ isOpen, onClose }: JobAlertsProps) {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<JobAlert[]>([
    {
      id: '1',
      title: 'Banking Jobs Alert',
      keywords: 'bank clerk, probationary officer',
      location: 'Delhi',
      department: 'Banking',
      salaryRange: '30k-50k',
      emailNotifications: true,
      smsNotifications: false,
      frequency: 'daily',
      isActive: true,
      matchingJobs: 12
    },
    {
      id: '2', 
      title: 'Railway Jobs Alert',
      keywords: 'assistant loco pilot, technician',
      location: 'All India',
      department: 'Railway',
      salaryRange: '20k-30k',
      emailNotifications: true,
      smsNotifications: true,
      frequency: 'instant',
      isActive: true,
      matchingJobs: 8
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    title: '',
    keywords: '',
    location: 'All India',
    department: 'all-departments',
    salaryRange: 'all-salaries',
    emailNotifications: true,
    smsNotifications: false,
    frequency: 'daily' as const
  });

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.keywords) {
      toast({
        title: "Missing Information",
        description: "Please fill in alert title and keywords",
        variant: "destructive"
      });
      return;
    }

    if (newAlert.emailNotifications && !email) {
      toast({
        title: "Email Required",
        description: "Please enter your email for notifications",
        variant: "destructive"
      });
      return;
    }

    if (newAlert.smsNotifications && !phone) {
      toast({
        title: "Phone Required", 
        description: "Please enter your phone number for SMS notifications",
        variant: "destructive"
      });
      return;
    }

    const alert: JobAlert = {
      id: Date.now().toString(),
      ...newAlert,
      isActive: true,
      matchingJobs: Math.floor(Math.random() * 20) + 1
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      title: '',
      keywords: '',
      location: 'All India',
      department: 'all-departments',
      salaryRange: 'all-salaries',
      emailNotifications: true,
      smsNotifications: false,
      frequency: 'daily'
    });

    toast({
      title: "Job Alert Created",
      description: `"${alert.title}" alert is now active and monitoring ${alert.matchingJobs} matching jobs`,
    });
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
    
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      toast({
        title: alert.isActive ? "Alert Deactivated" : "Alert Activated",
        description: alert.isActive ? 
          `"${alert.title}" notifications stopped` : 
          `"${alert.title}" notifications resumed`
      });
    }
  };

  const deleteAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast({
      title: "Alert Deleted",
      description: `"${alert?.title}" has been removed`
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Job Alerts</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Create New Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Job Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Alert Title</Label>
                  <Input
                    placeholder="e.g., Banking Jobs in Delhi"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Keywords</Label>
                  <Input
                    placeholder="e.g., clerk, officer, assistant"
                    value={newAlert.keywords}
                    onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <Select value={newAlert.location} onValueChange={(value) => setNewAlert({...newAlert, location: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All India">All India</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <Select value={newAlert.department} onValueChange={(value) => setNewAlert({...newAlert, department: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-departments">All Departments</SelectItem>
                        <SelectItem value="Banking">Banking</SelectItem>
                        <SelectItem value="Railway">Railway</SelectItem>
                        <SelectItem value="SSC">SSC</SelectItem>
                        <SelectItem value="UPSC">UPSC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Salary Range</Label>
                  <Select value={newAlert.salaryRange} onValueChange={(value) => setNewAlert({...newAlert, salaryRange: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-salaries">All Salary Ranges</SelectItem>
                      <SelectItem value="below-20k">Below ₹20,000</SelectItem>
                      <SelectItem value="20k-30k">₹20,000 - ₹30,000</SelectItem>
                      <SelectItem value="30k-50k">₹30,000 - ₹50,000</SelectItem>
                      <SelectItem value="50k-75k">₹50,000 - ₹75,000</SelectItem>
                      <SelectItem value="above-75k">Above ₹75,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Email for Notifications</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Phone for SMS</Label>
                    <Input
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <Label className="text-sm">Email Notifications</Label>
                    </div>
                    <Switch 
                      checked={newAlert.emailNotifications}
                      onCheckedChange={(checked) => setNewAlert({...newAlert, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <Label className="text-sm">SMS Notifications</Label>
                    </div>
                    <Switch 
                      checked={newAlert.smsNotifications}
                      onCheckedChange={(checked) => setNewAlert({...newAlert, smsNotifications: checked})}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Frequency</Label>
                    <Select value={newAlert.frequency} onValueChange={(value: any) => setNewAlert({...newAlert, frequency: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleCreateAlert} className="w-full">
                  Create Job Alert
                </Button>
              </CardContent>
            </Card>

            {/* Existing Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Active Alerts</h3>
              {alerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${alert.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.isActive ? "default" : "secondary"}>
                          {alert.isActive ? 'Active' : 'Paused'}
                        </Badge>
                        <Badge variant="outline">
                          {alert.matchingJobs} matches
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Keywords:</strong> {alert.keywords}</div>
                      <div><strong>Location:</strong> {alert.location}</div>
                      <div><strong>Frequency:</strong> {alert.frequency}</div>
                      <div className="flex gap-2 mt-2">
                        {alert.emailNotifications && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Badge>
                        )}
                        {alert.smsNotifications && (
                          <Badge variant="outline" className="text-xs">
                            <Smartphone className="h-3 w-3 mr-1" />
                            SMS
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.isActive ? 'Pause' : 'Resume'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {alerts.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No job alerts yet</p>
                    <p className="text-sm">Create your first alert to get notified about new jobs</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}