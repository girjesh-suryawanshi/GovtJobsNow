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
  Calendar,
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Copy,
  FileSpreadsheet,
  Clock,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Exam templates for quick entry
const examTemplates = {
  ssc: {
    title: "SSC [Exam Name] 2025",
    conductingOrganization: "Staff Selection Commission",
    examPattern: "Computer Based Examination (CBE)",
    eligibility: "Graduate Degree from recognized university",
    applicationFee: "₹100 (General/OBC), No fee for SC/ST/EWS",
    officialWebsite: "https://ssc.nic.in",
    examMode: "Online",
    duration: "60 minutes",
    totalMarks: 100,
    languagesAvailable: "Hindi, English"
  },
  upsc: {
    title: "UPSC [Exam Name] 2025",
    conductingOrganization: "Union Public Service Commission",
    examPattern: "Preliminary + Main + Interview",
    eligibility: "Graduate Degree from recognized university",
    applicationFee: "₹25 (General/OBC), No fee for SC/ST/PH/EWS/ESM",
    officialWebsite: "https://upsc.gov.in",
    examMode: "Offline",
    duration: "2 hours per paper",
    totalMarks: 200,
    languagesAvailable: "Hindi, English, Regional Languages"
  },
  ibps: {
    title: "IBPS [Exam Name] 2025",
    conductingOrganization: "Institute of Banking Personnel Selection",
    examPattern: "Preliminary + Main Examination",
    eligibility: "Graduate Degree in any discipline",
    applicationFee: "₹175 (General/OBC), ₹175 (SC/ST/PH)",
    officialWebsite: "https://ibps.in",
    examMode: "Online",
    duration: "1 hour (Prelims), 3 hours (Mains)",
    totalMarks: 100,
    languagesAvailable: "Hindi, English"
  },
  sbi: {
    title: "SBI [Exam Name] 2025",
    conductingOrganization: "State Bank of India",
    examPattern: "Preliminary + Main + Group Discussion/Interview",
    eligibility: "Graduate in any discipline with minimum 60% marks",
    applicationFee: "₹750 (General/EWS/OBC), ₹125 (SC/ST/PH)",
    officialWebsite: "https://sbi.co.in/careers",
    examMode: "Online",
    duration: "1 hour (Prelims), 3 hours (Mains)",
    totalMarks: 100,
    languagesAvailable: "Hindi, English"
  },
  railway: {
    title: "Railway [Exam Name] 2025",
    conductingOrganization: "Railway Recruitment Board",
    examPattern: "Computer Based Test (CBT)",
    eligibility: "10th/12th/ITI/Graduate as per post requirement",
    applicationFee: "₹500 (General/OBC), ₹250 (SC/ST)",
    officialWebsite: "https://rrbcdg.gov.in",
    examMode: "Online",
    duration: "90 minutes",
    totalMarks: 100,
    languagesAvailable: "Hindi, English, Regional Languages"
  }
};

interface ExamFormData {
  title: string;
  conductingOrganization: string;
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: string;
  examPattern: string;
  eligibility: string;
  officialWebsite: string;
  resultsDate: string;
  admitCardDate: string;
  syllabus: string;
  location: string;
  duration: string;
  totalMarks: string;
  examMode: string;
  languagesAvailable: string;
}

export default function ManualExamEntry() {
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    conductingOrganization: "",
    examDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    applicationFee: "",
    examPattern: "",
    eligibility: "",
    officialWebsite: "",
    resultsDate: "",
    admitCardDate: "",
    syllabus: "",
    location: "",
    duration: "",
    totalMarks: "",
    examMode: "",
    languagesAvailable: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { toast } = useToast();

  const handleInputChange = (field: keyof ExamFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyTemplate = (templateKey: string) => {
    const template = examTemplates[templateKey as keyof typeof examTemplates];
    if (template) {
      setFormData(prev => ({
        ...prev,
        ...template,
        totalMarks: template.totalMarks.toString()
      }));
      setSelectedTemplate(templateKey);
      toast({
        title: "Template Applied",
        description: `${template.title} template has been applied. Customize the details as needed.`
      });
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      conductingOrganization: "",
      examDate: "",
      registrationStartDate: "",
      registrationEndDate: "",
      applicationFee: "",
      examPattern: "",
      eligibility: "",
      officialWebsite: "",
      resultsDate: "",
      admitCardDate: "",
      syllabus: "",
      location: "",
      duration: "",
      totalMarks: "",
      examMode: "",
      languagesAvailable: ""
    });
    setSelectedTemplate("");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.conductingOrganization || !formData.examDate || 
        !formData.registrationStartDate || !formData.registrationEndDate || 
        !formData.eligibility || !formData.officialWebsite) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with *"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert totalMarks to number if provided
      const examData = {
        ...formData,
        totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : null
      };

      await apiRequest("/api/admin/exams", {
        method: "POST",
        body: JSON.stringify(examData),
      });

      toast({
        title: "Success!",
        description: `Exam "${formData.title}" has been successfully created.`,
      });

      // Clear form after successful submission
      clearForm();
      
      // Invalidate any exam queries
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });

    } catch (error) {
      console.error("Failed to create exam:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create exam. Please check your input and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Manual Exam Entry
          </h2>
          <p className="text-muted-foreground">
            Add new government exams to the calendar and schedule
          </p>
        </div>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Quick Templates
          </CardTitle>
          <CardDescription>
            Choose a template to auto-fill common exam details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(examTemplates).map(([key, template]) => (
              <Button
                key={key}
                variant={selectedTemplate === key ? "default" : "outline"}
                size="sm"
                onClick={() => applyTemplate(key)}
                className="h-auto p-3 flex flex-col items-center gap-2"
                data-testid={`template-${key}`}
              >
                <span className="font-medium text-xs text-center">
                  {key.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground text-center leading-tight">
                  {template.conductingOrganization}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Exam Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., SSC CGL 2025"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conductingOrganization">Conducting Organization *</Label>
              <Input
                id="conductingOrganization"
                value={formData.conductingOrganization}
                onChange={(e) => handleInputChange("conductingOrganization", e.target.value)}
                placeholder="e.g., Staff Selection Commission"
                data-testid="input-organization"
              />
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationStartDate">Registration Start Date *</Label>
                <Input
                  id="registrationStartDate"
                  type="date"
                  value={formData.registrationStartDate}
                  onChange={(e) => handleInputChange("registrationStartDate", e.target.value)}
                  data-testid="input-reg-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationEndDate">Registration End Date *</Label>
                <Input
                  id="registrationEndDate"
                  type="date"
                  value={formData.registrationEndDate}
                  onChange={(e) => handleInputChange("registrationEndDate", e.target.value)}
                  data-testid="input-reg-end"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date *</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => handleInputChange("examDate", e.target.value)}
                  data-testid="input-exam-date"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admitCardDate">Admit Card Release Date</Label>
                <Input
                  id="admitCardDate"
                  type="date"
                  value={formData.admitCardDate}
                  onChange={(e) => handleInputChange("admitCardDate", e.target.value)}
                  data-testid="input-admit-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultsDate">Results Date (Expected)</Label>
                <Input
                  id="resultsDate"
                  type="date"
                  value={formData.resultsDate}
                  onChange={(e) => handleInputChange("resultsDate", e.target.value)}
                  data-testid="input-results"
                />
              </div>
            </div>
          </div>

          {/* Exam Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exam Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examPattern">Exam Pattern</Label>
                <Input
                  id="examPattern"
                  value={formData.examPattern}
                  onChange={(e) => handleInputChange("examPattern", e.target.value)}
                  placeholder="e.g., Computer Based Examination"
                  data-testid="input-pattern"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examMode">Exam Mode</Label>
                <Select 
                  value={formData.examMode} 
                  onValueChange={(value) => handleInputChange("examMode", value)}
                >
                  <SelectTrigger data-testid="select-exam-mode">
                    <SelectValue placeholder="Select exam mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Both">Both Online & Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., 60 minutes"
                  data-testid="input-duration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange("totalMarks", e.target.value)}
                  placeholder="e.g., 100"
                  data-testid="input-marks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., All India"
                  data-testid="input-location"
                />
              </div>
            </div>
          </div>

          {/* Application & Eligibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicationFee">Application Fee</Label>
                <Input
                  id="applicationFee"
                  value={formData.applicationFee}
                  onChange={(e) => handleInputChange("applicationFee", e.target.value)}
                  placeholder="e.g., ₹100 (General/OBC), No fee for SC/ST"
                  data-testid="input-fee"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languagesAvailable">Languages Available</Label>
                <Input
                  id="languagesAvailable"
                  value={formData.languagesAvailable}
                  onChange={(e) => handleInputChange("languagesAvailable", e.target.value)}
                  placeholder="e.g., Hindi, English"
                  data-testid="input-languages"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility Criteria *</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility}
                onChange={(e) => handleInputChange("eligibility", e.target.value)}
                placeholder="Describe the eligibility criteria for this exam..."
                rows={3}
                data-testid="textarea-eligibility"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officialWebsite">Official Website *</Label>
              <Input
                id="officialWebsite"
                type="url"
                value={formData.officialWebsite}
                onChange={(e) => handleInputChange("officialWebsite", e.target.value)}
                placeholder="https://example.gov.in"
                data-testid="input-website"
              />
            </div>
          </div>

          {/* Syllabus */}
          <div className="space-y-2">
            <Label htmlFor="syllabus">Syllabus</Label>
            <Textarea
              id="syllabus"
              value={formData.syllabus}
              onChange={(e) => handleInputChange("syllabus", e.target.value)}
              placeholder="Describe the exam syllabus and topics..."
              rows={4}
              data-testid="textarea-syllabus"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center gap-2"
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? "Creating..." : "Create Exam"}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearForm}
              data-testid="button-clear"
            >
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Fields marked with * are required. Make sure to verify all dates and information before submitting.
        </AlertDescription>
      </Alert>
    </div>
  );
}