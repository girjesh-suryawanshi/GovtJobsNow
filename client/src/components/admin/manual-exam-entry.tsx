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
    officialWebsite: "https://ssc.nic.in"
  },
  upsc: {
    title: "UPSC [Exam Name] 2025",
    conductingOrganization: "Union Public Service Commission",
    officialWebsite: "https://upsc.gov.in"
  },
  ibps: {
    title: "IBPS [Exam Name] 2025",
    conductingOrganization: "Institute of Banking Personnel Selection",
    officialWebsite: "https://ibps.in"
  },
  sbi: {
    title: "SBI [Exam Name] 2025",
    conductingOrganization: "State Bank of India",
    officialWebsite: "https://sbi.co.in/careers"
  },
  railway: {
    title: "Railway [Exam Name] 2025",
    conductingOrganization: "Railway Recruitment Board",
    officialWebsite: "https://rrbcdg.gov.in"
  }
};

interface ExamFormData {
  title: string;
  conductingOrganization: string;
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  vacancies: string;
  officialWebsite: string;
  resultsDate: string;
  admitCardDate: string;
  slug: string;
  notifications: Array<{ label: string; url: string; type: 'file' | 'link' }>;
  customLinks: Array<{ label: string; url: string }>;
}

export default function ManualExamEntry() {
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    conductingOrganization: "",
    examDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    vacancies: "",
    officialWebsite: "",
    resultsDate: "",
    admitCardDate: "",
    slug: "",
    notifications: [],
    customLinks: []
  });

  const [aiProvider, setAiProvider] = useState<"groq" | "gemini">("groq");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmitting, setIsAdmitting] = useState(false);
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
      examDate: exam.examDate || "",
      registrationStartDate: exam.registrationStartDate || "",
      registrationEndDate: exam.registrationEndDate || "",
      vacancies: exam.vacancies || "",
      officialWebsite: exam.officialWebsite || "",
      resultsDate: exam.resultsDate || "",
      admitCardDate: exam.admitCardDate || "",
      slug: exam.slug || "",
      notifications: (exam.notifications as any) || [],
      customLinks: (exam.customLinks as any) || []
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

      toast({ title: "Scraping Complete", description: `Running ${aiProvider.toUpperCase()} extraction now...`, duration: 2000 });

      // 2. Feed scraped text directly into the AI Extraction endpoint
      setIsExtracting(true);
      const extractResponse = await fetch("/api/admin/extract-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText: text, provider: aiProvider }),
      });

      if (extractResponse.ok) {
        const data = await extractResponse.json();
        setFormData(prev => ({
          ...prev,
          ...data,
          officialWebsite: scrapeUrl,
          customLinks: data.customLinks || []
        }));
        toast({ title: "Pipeline Successful", description: `URL Scraped and Exam details organized by ${aiProvider.toUpperCase()}.` });
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
        body: JSON.stringify({ rawText, provider: aiProvider }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data, customLinks: data.customLinks || [] }));
        toast({ title: "Extraction Successful", description: `Organized by ${aiProvider.toUpperCase()}. Please review.` });
      } else {
        throw new Error("Failed to extract");
      }
    } catch (error) {
      toast({ title: "Extraction Failed", description: "Could not organize exam details. Please try again.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (field: keyof ExamFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Auto-generate slug if title changes and slug is empty or matches previous title's slug
      if (field === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const applyTemplate = (templateKey: string) => {
    const template = examTemplates[templateKey as keyof typeof examTemplates];
    if (template) {
      setFormData(prev => ({
        ...prev,
        ...template,
        customLinks: []
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
      vacancies: "",
      officialWebsite: "",
      resultsDate: "",
      admitCardDate: "",
      slug: "",
      notifications: [],
      customLinks: []
    });
    setSelectedTemplate("");
    setEditingId(null);
    setRawText("");
    setScrapeUrl("");
  };

  const handleSubmit = async () => {
    // Basic validation - Dates are now optional based on user request
    if (!formData.title || !formData.conductingOrganization || !formData.officialWebsite) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in title, organization and official website URL."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const examData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        notifications: formData.notifications || [],
        customLinks: formData.customLinks || []
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
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Smart Extraction
            </CardTitle>
            <CardDescription>
              Paste details or notification URL. AI will organize it automatically.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-lg border border-purple-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-purple-400 px-2">Provider:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={aiProvider === "groq" ? "default" : "ghost"}
                className={aiProvider === "groq" ? "bg-purple-600 h-7 text-[10px]" : "h-7 text-[10px]"}
                onClick={() => setAiProvider("groq")}
              >
                GROQ (Fast)
              </Button>
              <Button
                size="sm"
                variant={aiProvider === "gemini" ? "default" : "ghost"}
                className={aiProvider === "gemini" ? "bg-purple-600 h-7 text-[10px]" : "h-7 text-[10px]"}
                onClick={() => setAiProvider("gemini")}
              >
                GEMINI
              </Button>
            </div>
          </div>
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
                <Label htmlFor="registrationStartDate">Registration Start Date</Label>
                <Input
                  id="registrationStartDate"
                  type="date"
                  value={formData.registrationStartDate}
                  onChange={(e) => handleInputChange("registrationStartDate", e.target.value)}
                  data-testid="input-reg-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationEndDate">Registration End Date</Label>
                <Input
                  id="registrationEndDate"
                  type="date"
                  value={formData.registrationEndDate}
                  onChange={(e) => handleInputChange("registrationEndDate", e.target.value)}
                  data-testid="input-reg-end"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
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
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="officialWebsite">Official Website URL *</Label>
                <Input
                  id="officialWebsite"
                  value={formData.officialWebsite}
                  onChange={(e) => handleInputChange("officialWebsite", e.target.value)}
                  placeholder="https://example.com"
                  data-testid="input-website"
                />
              </div>
            </div>
          </div>

          {/* Official Notifications (Multiple) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Official Notifications (Multiple PDFs/Links) *</h3>
                <p className="text-sm text-gray-500">Add all official documents, short notices, or external links here.</p>
              </div>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={() => handleInputChange("notifications", [...(formData.notifications || []), { label: "Official Notification", url: "", type: 'link' }])}
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Notification
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.notifications || []).map((notif, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newNotifs = [...formData.notifications];
                      newNotifs.splice(index, 1);
                      handleInputChange("notifications", newNotifs);
                    }}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                  
                  <div className="flex-1">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">Label</Label>
                    <Input 
                      placeholder="e.g., Short Notice, Full Guidelines" 
                      value={notif.label}
                      onChange={(e) => {
                        const newNotifs = [...formData.notifications];
                        newNotifs[index].label = e.target.value;
                        handleInputChange("notifications", newNotifs);
                      }}
                    />
                  </div>

                  <div className="flex-[2] space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-gray-400">URL / File Path</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://..." 
                        value={notif.url}
                        onChange={(e) => {
                          const newNotifs = [...formData.notifications];
                          newNotifs[index].url = e.target.value;
                          newNotifs[index].type = e.target.value.includes('http') ? 'link' : 'file';
                          handleInputChange("notifications", newNotifs);
                        }}
                      />
                      <div className="shrink-0 relative">
                        <Input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id={`exam-file-upload-${index}`}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading(true);
                            const uploadData = new FormData();
                            uploadData.append("file", file);
                            try {
                              const token = localStorage.getItem('admin_token');
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: uploadData
                              });
                              if (response.ok) {
                                const data = await response.json();
                                const newNotifs = [...formData.notifications];
                                newNotifs[index].url = data.url;
                                newNotifs[index].type = 'file';
                                handleInputChange("notifications", newNotifs);
                                toast({ title: "File Uploaded" });
                              }
                            } catch (e) { toast({ title: "Upload Failed", variant: "destructive" }); }
                            finally { setIsUploading(false); }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => document.getElementById(`exam-file-upload-${index}`)?.click()}
                          disabled={isUploading}
                          title="Upload File"
                        >
                          <Loader2 className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {formData.notifications.length === 0 && (
                <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                  No notifications added yet. Click "Add Notification" to include PDF links or documents.
                </div>
              )}
            </div>
          </div>

          {/* Custom Links Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Custom Important Links</h3>
                <p className="text-sm text-gray-500">Add any additional links like Apply Here, Syllabus, Previous Papers, etc.</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 font-bold"
                onClick={() => {
                  handleInputChange("customLinks", [...(formData.customLinks || []), { label: "", url: "" }]);
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Custom Link
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.customLinks || []).map((link, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white border shadow-sm text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newLinks = [...formData.customLinks];
                      newLinks.splice(idx, 1);
                      handleInputChange("customLinks", newLinks);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link Label</Label>
                    <Input
                      placeholder="e.g. Official Syllabus"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...formData.customLinks];
                        newLinks[idx].label = e.target.value;
                        handleInputChange("customLinks", newLinks);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link URL</Label>
                    <Input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.customLinks];
                        newLinks[idx].url = e.target.value;
                        handleInputChange("customLinks", newLinks);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden legacy field for validation/backward compat */}
          <div className="hidden">
            <Input
              id="officialWebsite"
              value={formData.officialWebsite || (formData.notifications[0]?.url || "")}
              readOnly
            />
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