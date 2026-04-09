import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  KeyRound, 
  UserPlus, 
  Users, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  qualification: string;
  deadline: string;
  postedOn: string;
  applyLink: string;
  sourceUrl: string;
  positions?: string;
  salary?: string;
  ageLimit?: string;
  applicationFee?: string;
  description?: string;
  selectionProcess?: string;
  experienceRequired?: string;
  jobCategory?: string;
  employmentType?: string;
  recruitingOrganization?: string;
  applicationStartDate?: string;
  vacancyBreakdown?: string;
  notificationFileUrl?: string;
  featuredImageUrl?: string;
  prepGuide?: string;
  syllabus?: string;
  slug?: string;
}

export default function AdminManagement() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  // New admin user form
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin"
  });

  useEffect(() => {
    fetchAdminUsers();
    fetchJobs();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const users = await response.json();
        setAdminUsers(users);
      }
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?limit=50");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      if (response.ok) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
        setPasswordForm({ currentPassword: "", newPassword: "" });
      } else {
        const error = await response.json();
        toast({
          title: "Password Change Failed",
          description: error.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin user? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Admin Deleted",
          description: "Admin user has been deleted successfully.",
        });
        fetchAdminUsers();
      } else {
        const error = await response.json();
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting admin",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserForm),
      });

      if (response.ok) {
        toast({
          title: "User Created",
          description: "New admin user has been created successfully.",
        });
        setNewUserForm({ username: "", email: "", password: "", role: "admin" });
        fetchAdminUsers(); // Refresh the list
      } else {
        const error = await response.json();
        toast({
          title: "User Creation Failed",
          description: error.message || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Job Deleted",
          description: "Job has been deleted successfully.",
        });
        fetchJobs(); // Refresh the list
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete job",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting job",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = async (jobData: Partial<Job>) => {
    if (!editingJob) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/jobs/${editingJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        toast({
          title: "Job Updated",
          description: "Job has been updated successfully.",
        });
        setEditingJob(null);
        fetchJobs(); // Refresh the list
      } else {
        const error = await response.json();
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update job",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
        <Button onClick={() => { fetchAdminUsers(); fetchJobs(); }} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="create-user">Create User</TabsTrigger>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
        </TabsList>

        {/* Change Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your admin password. Make sure to use a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      data-testid="input-current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      data-testid="input-new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} data-testid="button-change-password">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create User Tab */}
        <TabsContent value="create-user">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New Admin User
              </CardTitle>
              <CardDescription>
                Add a new admin user who can manage job postings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newUserForm.username}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                      required
                      minLength={3}
                      data-testid="input-username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userPassword">Password</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                </div>

                <Button type="submit" disabled={isLoading} data-testid="button-create-user">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Admin Users
              </CardTitle>
              <CardDescription>
                Manage admin users who have access to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" data-testid={`text-username-${user.id}`}>{user.username}</span>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-email-${user.id}`}>{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      onClick={() => handleDeleteAdmin(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Manage Job Posts
              </CardTitle>
              <CardDescription>
                Edit or delete published job posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="font-medium" data-testid={`text-job-title-${job.id}`}>{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        <span data-testid={`text-job-department-${job.id}`}>{job.department}</span> • 
                        <span data-testid={`text-job-location-${job.id}`}> {job.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Deadline: {job.deadline} • Posted: {job.postedOn}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingJob(job)}
                        data-testid={`button-edit-${job.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        data-testid={`button-delete-${job.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold">Edit Job Post</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingJob(null)}
                data-testid="button-close-edit-modal"
              >
                ×
              </Button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form
                id="edit-job-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const jobData: Partial<Job> = {};
                  formData.forEach((value, key) => {
                    jobData[key as keyof Job] = value as string;
                  });
                  handleEditJob(jobData);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Job Title</Label>
                    <Input id="edit-title" name="title" defaultValue={editingJob.title} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department/Org</Label>
                    <Input id="edit-department" name="department" defaultValue={editingJob.department} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input id="edit-location" name="location" defaultValue={editingJob.location} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-deadline">Deadline</Label>
                    <Input id="edit-deadline" name="deadline" defaultValue={editingJob.deadline} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-qualification">Qualification</Label>
                    <Input id="edit-qualification" name="qualification" defaultValue={editingJob.qualification} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-experienceRequired">Experience Required</Label>
                    <Input id="edit-experienceRequired" name="experienceRequired" defaultValue={editingJob.experienceRequired || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-salary">Salary Range</Label>
                    <Input id="edit-salary" name="salary" defaultValue={editingJob.salary || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-applyLink">Apply Link</Label>
                    <Input id="edit-applyLink" name="applyLink" defaultValue={editingJob.applyLink} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-positions">Positions (Count)</Label>
                    <Input id="edit-positions" name="positions" defaultValue={editingJob.positions || "1"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ageLimit">Age Limit</Label>
                    <Input id="edit-ageLimit" name="ageLimit" defaultValue={editingJob.ageLimit || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-applicationFee">Application Fee</Label>
                    <Input id="edit-applicationFee" name="applicationFee" defaultValue={editingJob.applicationFee || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-jobCategory">Job Category</Label>
                    <Input id="edit-jobCategory" name="jobCategory" defaultValue={editingJob.jobCategory || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-employmentType">Employment Type</Label>
                    <Input id="edit-employmentType" name="employmentType" defaultValue={editingJob.employmentType || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-applicationStartDate">Start Date</Label>
                    <Input id="edit-applicationStartDate" name="applicationStartDate" defaultValue={editingJob.applicationStartDate || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-recruitingOrganization">Recruiting Org</Label>
                    <Input id="edit-recruitingOrganization" name="recruitingOrganization" defaultValue={editingJob.recruitingOrganization || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-featuredImageUrl">Image URL</Label>
                    <Input id="edit-featuredImageUrl" name="featuredImageUrl" defaultValue={editingJob.featuredImageUrl || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-notificationFileUrl">Notification PDF URL</Label>
                    <Input id="edit-notificationFileUrl" name="notificationFileUrl" defaultValue={editingJob.notificationFileUrl || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sourceUrl">Source URL</Label>
                    <Input id="edit-sourceUrl" name="sourceUrl" defaultValue={editingJob.sourceUrl || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-slug">URL Slug (Optional)</Label>
                  <Input id="edit-slug" name="slug" defaultValue={editingJob.slug || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Job Description</Label>
                  <textarea
                    id="edit-description"
                    name="description"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    defaultValue={editingJob.description || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-selectionProcess">Selection Process</Label>
                  <textarea
                    id="edit-selectionProcess"
                    name="selectionProcess"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingJob.selectionProcess || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-prepGuide">Preparation Guide</Label>
                  <textarea
                    id="edit-prepGuide"
                    name="prepGuide"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingJob.prepGuide || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-syllabus">Exam Syllabus</Label>
                  <textarea
                    id="edit-syllabus"
                    name="syllabus"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingJob.syllabus || ""}
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex gap-4 justify-end shrink-0 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingJob(null)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-job-form"
                disabled={isLoading}
                data-testid="button-save-edit"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}