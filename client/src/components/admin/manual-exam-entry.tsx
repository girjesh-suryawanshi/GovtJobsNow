import { useState, useMemo } from "react";
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
  Globe,
  Sparkles,
  Loader2,
  Trash2,
  Edit,
  Search,
  Building2,
  PlusCircle,
  X,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Exam } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Exam templates for quick entry
const examTemplates = {
  ssc: {
    title: "SSC [Exam Name] 2025",
    conductingOrganization: "Staff Selection Commission",
    eligibility: "Graduate Degree from recognized university",
    applicationFee: "₹100 (General/OBC), No fee for SC/ST/EWS",
    officialWebsite: "https://ssc.nic.in",
    examMode: "Online",
    examBrief: "Tier-I: 100 Qs, 200 Marks, 60 min. Tier-II: 150 Qs, 450 Marks, 150 min. Negative marking applies."
  },
  upsc: {
    title: "UPSC [Exam Name] 2025",
    conductingOrganization: "Union Public Service Commission",
    eligibility: "Graduate Degree from recognized university",
    applicationFee: "₹25 (General/OBC), No fee for SC/ST/PH/EWS/ESM",
    officialWebsite: "https://upsc.gov.in",
    examMode: "Offline",
    examBrief: "Preliminary (Obj), Main (Written), Interview. Total 2025 Marks."
  },
  ibps: {
    title: "IBPS [Exam Name] 2025",
    conductingOrganization: "Institute of Banking Personnel Selection",
    eligibility: "Graduate Degree in any discipline",
    applicationFee: "₹175 (SC/ST/PH), ₹850 (Others)",
    officialWebsite: "https://ibps.in",
    examMode: "Online",
    examBrief: "Prelims (Obj), Mains (Obj/Desc), Interview. Time: 60/180 min."
  },
  sbi: {
    title: "SBI [Exam Name] 2025",
    conductingOrganization: "State Bank of India",
    eligibility: "Graduate in any discipline with minimum 60% marks",
    applicationFee: "₹750 (General/EWS/OBC), No fee for SC/ST/PH",
    officialWebsite: "https://sbi.co.in/careers",
    examMode: "Online",
    examBrief: "Prelims, Mains, GD/Interview. Sectional timing applies."
  },
  railway: {
    title: "Railway [Exam Name] 2025",
    conductingOrganization: "Railway Recruitment Board",
    eligibility: "10th/12th/ITI/Graduate as per post requirement",
    applicationFee: "₹500 (General/OBC), ₹250 (SC/ST)",
    officialWebsite: "https://rrbcdg.gov.in",
    examMode: "Online",
    examBrief: "Single or Dual Stage CBT followed by PET/PST. Duration: 90/120 min."
  }
};

interface ExamFormData {
  title: string;
  conductingOrganization: string;
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: string;
  eligibility: string;
  ageLimit: string;
  vacancies: string;
  officialWebsite: string;
  resultsDate: string;
  admitCardDate: string;
  syllabus: string;
  examMode: string;
  examBrief: string;
}

export default function ManualExamEntry() {
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    conductingOrganization: "",
    examDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    applicationFee: "",
    eligibility: "",
    ageLimit: "",
    vacancies: "",
    officialWebsite: "",
    resultsDate: "",
    admitCardDate: "",
    syllabus: "",
    examMode: "",
    examBrief: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [rawText, setRawText] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch all exams
  const { data: exams = [], isLoading: isLoadingExams } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });

  // Filter exams based on search query
  const filteredExams = useMemo(() => {
    return exams.filter(exam => 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.conductingOrganization?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  }, [exams, searchQuery]);

  const handleEdit = (exam: Exam) => {
    setFormData({
      title: exam.title,
      conductingOrganization: exam.conductingOrganization || "",
      examDate: exam.examDate,
      registrationStartDate: exam.registrationStartDate,
      registrationEndDate: exam.registrationEndDate,
      applicationFee: exam.applicationFee || "",
      eligibility: exam.eligibility || "",
      ageLimit: exam.ageLimit || "",
      vacancies: exam.vacancies || "",
      officialWebsite: exam.officialWebsite || "",
      resultsDate: exam.resultsDate || "",
      admitCardDate: exam.admitCardDate || "",
      syllabus: exam.syllabus || "",
      examMode: exam.examMode || "",
      examBrief: exam.examBrief || ""
    });
    setEditingId(exam.id);
    
    // Scroll to form
    const formElement = document.getElementById("exam-entry-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/exams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({ title: "Exam Deleted", description: `"${title}" has been removed.` });
        queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      } else {
        throw new Error("Failed to delete exam");
      }
    } catch (error) {
      toast({ title: "Delete Failed", description: "Could not delete exam. Please try again.", variant: "destructive" });
    }
  };

  const handleScrapeAndExtract = async () => {
    if (!scrapeUrl.trim() || !scrapeUrl.startsWith("http")) {
      toast({ title: "Invalid URL", description: "Please enter a valid HTTP/HTTPS URL", variant: "destructive" });
      return;
    }

    setIsScraping(true);
    try {
      const token = localStorage.getItem("admin_token");

      // 1. Scrape the URL
      const scrapeResponse = await fetch("/api/admin/scrape-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: scrapeUrl }),
      });

      if (!scrapeResponse.ok) {
        const errData = await scrapeResponse.json();
        throw new Error(errData.message || "Failed to scrape URL");
      }

      const { text } = await scrapeResponse.json();
      setRawText(text); // Plug text into the textarea so the admin can verify what the bot saw

      toast({ title: "Scraping Complete", description: "Running AI extraction now...", duration: 2000 });

      // 2. Feed scraped text directly into the AI Extraction endpoint
      setIsExtracting(true);
      const extractResponse = await fetch("/api/admin/extract-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText: text }),
      });

      if (extractResponse.ok) {
        const data = await extractResponse.json();
        setFormData(prev => ({
          ...prev,
          ...data,
          officialWebsite: scrapeUrl // Automatically pre-fill the officialWebsite field
        }));
        toast({ title: "Pipeline Successful", description: "URL Scraped and Exam details organized automatically. Please review carefully." });
      } else {
        throw new Error("Failed to extract data from scraped text");
      }

    } catch (error: any) {
      toast({ title: "Scraping Failed", description: error.message || "Pipeline interrupted", variant: "destructive" });
    } finally {
      setIsScraping(false);
      setIsExtracting(false);
    }
  };

  const handleExtract = async () => {
    if (!rawText.trim()) {
      toast({ title: "Error", description: "Please paste exam details first", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/extract-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data }));
        toast({ title: "Extraction Successful", description: "Exam details have been organized. Please review before publishing." });
      } else {
        throw new Error("Failed to extract");
      }
    } catch (error) {
      toast({ title: "Extraction Failed", description: "Could not organize exam details. Please try again.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

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
        ...template
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
      eligibility: "",
      ageLimit: "",
      vacancies: "",
      officialWebsite: "",
      resultsDate: "",
      admitCardDate: "",
      syllabus: "",
      examMode: "",
      examBrief: ""
    });
    setSelectedTemplate("");
    setEditingId(null);
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
      const examData = {
        ...formData
      };

      const token = localStorage.getItem("admin_token");
      const url = editingId ? `/api/admin/exams/${editingId}` : "/api/admin/exams";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        let errorMessage = `Server error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.message || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast({
        title: editingId ? "Exam Updated!" : "Success!",
        description: `Exam "${formData.title}" has been successfully ${editingId ? "updated" : "created"}.`,
      });

      // Clear form after successful submission
      clearForm();

      // Invalidate any exam queries
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });

    } catch (error: any) {
      console.error("Failed to create exam:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create exam. Please check your input and try again."
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
      {/* AI Extraction Section */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Smart Extraction
          </CardTitle>
          <CardDescription>
            Paste raw exam details or notification text below. Gemini will extract and organize it into the form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/80 p-4 rounded-lg border border-purple-100 flex flex-col md:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="scrapeUrl" className="text-purple-900 font-semibold flex items-center gap-2 relative">
                <Globe className="w-4 h-4" />
                Scrape from URL (Automated Pipeline)
              </Label>
              <Input
                id="scrapeUrl"
                placeholder="https://example.gov.in/notification"
                className="border-purple-200 focus-visible:ring-purple-500"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleScrapeAndExtract}
                disabled={isScraping || isExtracting}
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow"
              >
                {isScraping ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching...</>
                ) : (
                  <><Globe className="w-4 h-4 mr-2" /> Scrape & Extract</>
                )}
              </Button>
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-purple-200"></div>
            <span className="flex-shrink-0 mx-4 text-purple-400 text-xs uppercase font-medium">Or paste raw text manually</span>
            <div className="flex-grow border-t border-purple-200"></div>
          </div>

          <Textarea
            placeholder="Paste raw exam description, important dates, or notification details here..."
            className="min-h-[150px] bg-white border-purple-100 focus-visible:ring-purple-500"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center gap-2"
            onClick={handleExtract}
            disabled={isExtracting}
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Organize Exam Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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
      <Card id="exam-entry-form" className={editingId ? "ring-2 ring-blue-500 shadow-xl" : ""}>
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
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Exam & Eligibility Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageLimit">Age Limit *</Label>
                <Input
                  id="ageLimit"
                  value={formData.ageLimit}
                  onChange={(e) => handleInputChange("ageLimit", e.target.value)}
                  placeholder="e.g., 18-30 years as on 01-01-2025"
                  data-testid="input-age-limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancies">Number of Vacancies</Label>
                <Input
                  id="vacancies"
                  value={formData.vacancies}
                  onChange={(e) => handleInputChange("vacancies", e.target.value)}
                  placeholder="e.g., 1500 Posts"
                  data-testid="input-vacancies"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility Criteria *</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility}
                onChange={(e) => handleInputChange("eligibility", e.target.value)}
                placeholder="Describe the education and other eligibility criteria..."
                rows={3}
                data-testid="textarea-eligibility"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examBrief">Exam Brief / Pattern Summary</Label>
              <Textarea
                id="examBrief"
                value={formData.examBrief}
                onChange={(e) => handleInputChange("examBrief", e.target.value)}
                placeholder="Brief summary of exam pattern, duration, marks, etc."
                rows={3}
                data-testid="textarea-exam-brief"
              />
            </div>
          </div>

          {/* Website Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Official Links
            </h3>
            <div className="space-y-2">
              <Label htmlFor="officialWebsite">Official Website / Notification Link *</Label>
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
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                editingId ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />
              )}
              {isSubmitting 
                ? (editingId ? "Updating..." : "Creating...") 
                : (editingId ? "Update Exam" : "Create Exam")
              }
            </Button>
            
            {editingId && (
              <Button
                variant="outline"
                onClick={clearForm}
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </Button>
            )}

            {!editingId && (
              <Button
                variant="outline"
                onClick={clearForm}
                data-testid="button-clear"
              >
                Clear Form
              </Button>
            )}
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

      {/* Existing Exams List */}
      <div className="pt-8 border-t">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Manage Existing Exams
            </h2>
            <p className="text-sm text-muted-foreground">
              Search, edit, or delete previously posted exams
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoadingExams ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className={`overflow-hidden transition-all ${editingId === exam.id ? "ring-2 ring-blue-500 bg-blue-50/10" : "hover:shadow-md"}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{exam.title}</h3>
                        {editingId === exam.id && <Badge className="bg-blue-600">Editing Now</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {exam.conductingOrganization}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Exam: {formatDate(exam.examDate)}
                        </div>
                        <div className="flex items-center gap-1 text-orange-600 font-medium">
                          <Copy className="h-3 w-3" />
                          Ends: {formatDate(exam.registrationEndDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(exam)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exam.id, exam.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <a 
                        href={`/exams`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Page
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-lg">No exams found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {searchQuery ? `No exams match "${searchQuery}". Try a different term.` : "There are no exams in the calendar yet. Start by creating one above."}
              </p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 text-blue-600">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}