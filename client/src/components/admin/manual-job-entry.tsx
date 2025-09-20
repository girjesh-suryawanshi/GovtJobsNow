import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PlusCircle, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Copy,
  FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Job templates for quick entry
const jobTemplates = {
  ssc: {
    title: "SSC [Position Name] Recruitment 2025",
    department: "Staff Selection Commission",
    location: "All India",
    qualification: "Graduate/Post Graduate",
    description: "Staff Selection Commission has released notification for [Position] posts. Eligible candidates can apply online.",
    salary: "₹25,500 - ₹81,100 per month"
  },
  upsc: {
    title: "UPSC [Service Name] Examination 2025", 
    department: "Union Public Service Commission",
    location: "All India",
    qualification: "Bachelor's Degree",
    description: "Union Public Service Commission has announced [Service] examination. Apply online for civil services positions.",
    salary: "₹56,100 - ₹1,77,500 per month"
  },
  railway: {
    title: "Railway Recruitment [Position] 2025",
    department: "Railway Recruitment Board", 
    location: "Pan India",
    qualification: "10th/12th/ITI/Graduate",
    description: "Railway Recruitment Board has issued notification for [Position] vacancies. Apply online for railway jobs.",
    salary: "₹19,900 - ₹63,200 per month"
  },
  banking: {
    title: "Bank [Position] Recruitment 2025",
    department: "Banking Sector",
    location: "Pan India", 
    qualification: "Graduate with Banking/Finance background",
    description: "Leading bank has announced recruitment for [Position]. Eligible candidates can apply online.",
    salary: "₹23,700 - ₹42,020 per month"
  },
  psu: {
    title: "[PSU Name] [Position] Recruitment 2025",
    department: "Public Sector Undertaking",
    location: "India Wide",
    qualification: "Engineering/Management Degree",
    description: "Public Sector Undertaking has released notification for [Position] posts. Apply online through official website.",
    salary: "₹30,000 - ₹1,20,000 per month"
  }
};

const departmentOptions = [
  "Staff Selection Commission",
  "Union Public Service Commission", 
  "Railway Recruitment Board",
  "Banking Sector",
  "Defense Services",
  "Public Sector Undertaking",
  "State Government",
  "Police & Security Forces",
  "Education & Teaching",
  "Healthcare & Medical",
  "Other Government Department"
];

const locationOptions = [
  "All India",
  "Pan India", 
  "India Wide",
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "State Wise",
  "Multiple Locations"
];

const qualificationOptions = [
  "10th Pass",
  "12th Pass", 
  "ITI/Diploma",
  "Graduate (Any Stream)",
  "Post Graduate",
  "Engineering Degree",
  "Medical Degree",
  "Law Degree",
  "Management Degree",
  "Professional Qualification",
  "Experience Based"
];

interface ManualJobEntryProps {
  onJobAdded: () => void;
}

export default function ManualJobEntry({ onJobAdded }: ManualJobEntryProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    qualification: "",
    deadline: "",
    salary: "",
    description: "",
    applyLink: "",
    sourceUrl: "",
    positions: 1,
    ageLimit: "",
    applicationFee: "",
    selectionProcess: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const template = jobTemplates[templateKey as keyof typeof jobTemplates];
    setFormData(prev => ({
      ...prev,
      ...template
    }));
    setShowTemplates(false);
    toast({
      title: "Template Applied",
      description: `${templateKey.toUpperCase()} job template has been applied. Please customize the details.`,
    });
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push("Job title is required");
    if (!formData.department.trim()) errors.push("Department is required");
    if (!formData.location.trim()) errors.push("Location is required");
    if (!formData.qualification.trim()) errors.push("Qualification is required");
    if (!formData.deadline.trim()) errors.push("Application deadline is required");
    if (!formData.applyLink.trim()) errors.push("Application link is required");
    
    // Set default sourceUrl if empty (required field)
    if (!formData.sourceUrl.trim()) {
      formData.sourceUrl = "Manual Entry";
    }
    
    // Validate URL format
    if (formData.applyLink && !isValidUrl(formData.applyLink)) {
      errors.push("Application link must be a valid URL");
    }
    if (formData.sourceUrl && !isValidUrl(formData.sourceUrl)) {
      errors.push("Source URL must be a valid URL");
    }

    // Validate deadline date
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        errors.push("Deadline must be a future date");
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("admin_token");
      
      // Prepare job data with required fields
      const jobData = {
        ...formData,
        postedOn: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        sourceUrl: formData.sourceUrl || "Manual Entry",
        positions: formData.positions || 1
      };

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        toast({
          title: "Job Added Successfully", 
          description: "The job posting has been published and is now live.",
        });
        
        // Reset form
        setFormData({
          title: "",
          department: "",
          location: "",
          qualification: "",
          deadline: "",
          salary: "",
          description: "",
          applyLink: "",
          sourceUrl: "",
          positions: 1,
          ageLimit: "",
          applicationFee: "",
          selectionProcess: ""
        });
        
        onJobAdded();
      } else {
        const error = await response.json();
        toast({
          title: "Failed to Add Job",
          description: error.message || "Please check your input and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      qualification: "",
      deadline: "",
      salary: "",
      description: "",
      applyLink: "",
      sourceUrl: "",
      positions: 1,
      ageLimit: "",
      applicationFee: "",
      selectionProcess: ""
    });
    setValidationErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Templates */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Job Manually</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and publish government job postings with complete control over content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
            data-testid="button-templates"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="outline"
            onClick={clearForm}
            data-testid="button-clear"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Quick Templates */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quick Templates
            </CardTitle>
            <CardDescription>
              Pre-filled templates for common government job types. Click to apply and then customize.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(jobTemplates).map(([key, template]) => (
                <Card 
                  key={key}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => applyTemplate(key)}
                  data-testid={`template-${key}`}
                >
                  <CardContent className="p-4">
                    <div className="font-medium mb-2">{key.toUpperCase()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.department}
                    </div>
                    <div className="text-xs text-gray-500">
                      Click to apply template
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Job Details
          </CardTitle>
          <CardDescription>
            Fill in the job information. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="md:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., SSC CHSL Clerk Recruitment 2025"
                  data-testid="input-title"
                />
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger data-testid="select-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => handleInputChange('location', value)}
                >
                  <SelectTrigger data-testid="select-location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Qualification */}
              <div>
                <Label htmlFor="qualification">Required Qualification *</Label>
                <Select 
                  value={formData.qualification} 
                  onValueChange={(value) => handleInputChange('qualification', value)}
                >
                  <SelectTrigger data-testid="select-qualification">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationOptions.map(qual => (
                      <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div>
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-deadline"
                />
              </div>

              {/* Salary */}
              <div className="md:col-span-2">
                <Label htmlFor="salary">Salary Range (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g., ₹25,500 - ₹81,100 per month"
                  data-testid="input-salary"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed job description, eligibility criteria, selection process..."
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>

              {/* Application Link */}
              <div className="md:col-span-2">
                <Label htmlFor="applyLink">Application Link *</Label>
                <Input
                  id="applyLink"
                  value={formData.applyLink}
                  onChange={(e) => handleInputChange('applyLink', e.target.value)}
                  placeholder="https://example.gov.in/apply"
                  data-testid="input-apply-link"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Direct link where users can apply for this job
                </p>
              </div>

              {/* Additional Fields Row 1 */}
              <div>
                <Label htmlFor="positions">Number of Positions</Label>
                <Input
                  id="positions"
                  type="number"
                  value={formData.positions}
                  onChange={(e) => handleInputChange('positions', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  min="1"
                  data-testid="input-positions"
                />
              </div>

              <div>
                <Label htmlFor="ageLimit">Age Limit (Optional)</Label>
                <Input
                  id="ageLimit"
                  value={formData.ageLimit}
                  onChange={(e) => handleInputChange('ageLimit', e.target.value)}
                  placeholder="e.g., 18-30 years"
                  data-testid="input-age-limit"
                />
              </div>

              {/* Additional Fields Row 2 */}
              <div>
                <Label htmlFor="applicationFee">Application Fee (Optional)</Label>
                <Input
                  id="applicationFee"
                  value={formData.applicationFee}
                  onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                  placeholder="e.g., ₹500 (SC/ST: ₹250)"
                  data-testid="input-application-fee"
                />
              </div>

              <div>
                <Label htmlFor="selectionProcess">Selection Process (Optional)</Label>
                <Input
                  id="selectionProcess"
                  value={formData.selectionProcess}
                  onChange={(e) => handleInputChange('selectionProcess', e.target.value)}
                  placeholder="e.g., Written Exam + Interview"
                  data-testid="input-selection-process"
                />
              </div>

              {/* Source URL */}
              <div className="md:col-span-2">
                <Label htmlFor="sourceUrl">Source URL (Optional)</Label>
                <Input
                  id="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                  placeholder="https://source-website.gov.in/notification (Leave empty for manual entry)"
                  data-testid="input-source-url"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Original notification or source website URL. Leave empty if manually created.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Publishing Job...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Publish Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}