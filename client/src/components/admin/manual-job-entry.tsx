import { useState, useEffect } from "react";
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
  FileSpreadsheet,
  Plus,
  X,
  Sparkles,
  Loader2,
  Globe,
  Building2,
  Upload,
  Download,
  DownloadCloud,
  FileText,
  ExternalLink,
  ImagePlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// ... (existing job templates and options)
const jobTemplates = {
  ssc: {
    title: "SSC [Position Name] Recruitment 2025",
    department: "Staff Selection Commission",
    location: "All India",
    qualification: "Graduate/Post Graduate",
    description: "Staff Selection Commission has released notification for [Position] posts. Eligible candidates can apply online.",
    salary: "₹25,500 - ₹81,100 per month",
    jobCategory: "Central Government",
    employmentType: "Permanent",
    recruitingOrganization: "Staff Selection Commission",
    ageLimit: "18-27 years",
    applicationFee: "₹100 (General/OBC), No fee for SC/ST/EWS",
    selectionProcess: "Computer Based Examination + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  upsc: {
    title: "UPSC [Position Name] Recruitment 2025",
    department: "Union Public Service Commission",
    location: "All India",
    qualification: "Graduate Degree from recognized university",
    description: "Union Public Service Commission invites applications for [Position] posts. Interested candidates can apply online.",
    salary: "₹56,100 - ₹1,77,500 per month",
    jobCategory: "Central Government",
    employmentType: "Permanent",
    recruitingOrganization: "Union Public Service Commission",
    ageLimit: "21-32 years",
    applicationFee: "₹25 (General/OBC), No fee for SC/ST/PH/EWS/ESM",
    selectionProcess: "Preliminary Exam + Main Exam + Interview",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  ibps: {
    title: "IBPS [Position] Recruitment 2025",
    department: "Institute of Banking Personnel Selection",
    location: "Pan India",
    qualification: "Graduate Degree in any discipline",
    description: "IBPS has released notification for [Position] posts in participating banks. Eligible candidates can apply online.",
    salary: "₹23,700 - ₹42,020 per month",
    jobCategory: "Banking",
    employmentType: "Permanent",
    recruitingOrganization: "Institute of Banking Personnel Selection",
    ageLimit: "20-28 years",
    applicationFee: "₹175 (General/OBC), ₹175 (SC/ST/PH)",
    selectionProcess: "Prelims + Mains + Interview + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  sbi: {
    title: "SBI [Position] Recruitment 2025",
    department: "State Bank of India",
    location: "All India",
    qualification: "Graduate in any discipline with minimum 60% marks",
    description: "State Bank of India invites applications for [Position] posts. Candidates can apply online through official website.",
    salary: "₹31,540 - ₹45,950 per month",
    jobCategory: "Banking",
    employmentType: "Permanent",
    recruitingOrganization: "State Bank of India",
    ageLimit: "21-30 years",
    applicationFee: "₹750 (General/OBC/EWS), ₹125 (SC/ST/PH)",
    selectionProcess: "Online Written Test + Group Exercise + Interview",
    vacancyBreakdown: "General: 49.5%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  rrb: {
    title: "RRB [Position] Recruitment 2025",
    department: "Railway Recruitment Board",
    location: "All India",
    qualification: "10th/12th/ITI/Graduate as per post requirement",
    description: "Railway Recruitment Board has released notification for [Position] posts. Interested candidates can apply online.",
    salary: "₹19,900 - ₹63,200 per month",
    jobCategory: "Railway",
    employmentType: "Permanent",
    recruitingOrganization: "Railway Recruitment Board",
    ageLimit: "18-33 years",
    applicationFee: "₹500 (General/OBC), ₹250 (SC/ST)",
    selectionProcess: "CBT 1 + CBT 2 + Typing Test + Document Verification + Medical Test",
    vacancyBreakdown: "UR: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  army: {
    title: "Indian Army [Position] Recruitment 2025",
    department: "Indian Army",
    location: "Various Locations",
    qualification: "10th/12th/Graduate as per post requirement",
    description: "Indian Army invites applications for [Position] posts. Physically fit candidates meeting eligibility criteria can apply.",
    salary: "₹21,700 - ₹69,100 per month",
    jobCategory: "Defence",
    employmentType: "Permanent",
    recruitingOrganization: "Indian Army",
    ageLimit: "17.5-23 years",
    applicationFee: "No application fee",
    selectionProcess: "Physical Fitness Test + Written Exam + Medical Examination + Documentation",
    vacancyBreakdown: "As per Army recruitment policy"
  },
  police: {
    title: "[State] Police [Position] Recruitment 2025",
    department: "State Police Department",
    location: "State-wide",
    qualification: "12th Pass/Graduate as per post requirement",
    description: "State Police Department has released notification for [Position] posts. Physically fit candidates can apply online.",
    salary: "₹21,700 - ₹38,600 per month",
    jobCategory: "Police",
    employmentType: "Permanent",
    recruitingOrganization: "State Police Recruitment Board",
    ageLimit: "18-25 years",
    applicationFee: "₹400 (General/OBC), ₹200 (SC/ST)",
    selectionProcess: "Written Test + Physical Efficiency Test + Medical Test + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  aiims: {
    title: "AIIMS [Position] Recruitment 2025",
    department: "All India Institute of Medical Sciences",
    location: "New Delhi/Various AIIMS",
    qualification: "MBBS/MD/MS/Nursing Degree as per post requirement",
    description: "AIIMS has released notification for [Position] posts. Qualified medical professionals can apply online.",
    salary: "₹56,100 - ₹1,25,000 per month",
    jobCategory: "Healthcare",
    employmentType: "Permanent",
    recruitingOrganization: "All India Institute of Medical Sciences",
    ageLimit: "Not exceeding 35 years",
    applicationFee: "₹1,500 (General/OBC), ₹1,200 (SC/ST)",
    selectionProcess: "Written Test + Interview + Document Verification",
    vacancyBreakdown: "UR: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  teacher: {
    title: "Government Teacher Recruitment 2025",
    department: "Education Department",
    location: "District/State-wide",
    qualification: "B.Ed + Graduate/Post Graduate in relevant subject",
    description: "Education Department invites applications for Teacher posts in Government Schools. TET qualified candidates can apply.",
    salary: "₹35,400 - ₹1,12,400 per month",
    jobCategory: "Education",
    employmentType: "Permanent",
    recruitingOrganization: "Education Department",
    ageLimit: "21-40 years",
    applicationFee: "₹500 (General/OBC), ₹250 (SC/ST)",
    selectionProcess: "Written Test + Interview + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  psu: {
    title: "[PSU Name] [Position] Recruitment 2025",
    department: "Public Sector Undertaking",
    location: "Various Locations",
    qualification: "Engineering Degree/Graduate/Diploma as per post",
    description: "Public Sector Undertaking has released notification for [Position] posts. Eligible candidates can apply online.",
    salary: "₹40,000 - ₹1,40,000 per month",
    jobCategory: "PSU",
    employmentType: "Permanent",
    recruitingOrganization: "Public Sector Undertaking",
    ageLimit: "18-30 years",
    applicationFee: "₹500 (General/OBC), ₹125 (SC/ST/PH)",
    selectionProcess: "Written Test + Interview + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  state: {
    title: "[State] Government [Position] Recruitment 2025",
    department: "State Government Department",
    location: "State-wide",
    qualification: "Graduate/Post Graduate as per post requirement",
    description: "State Government has released notification for [Position] posts in various departments. Eligible candidates can apply.",
    salary: "₹25,500 - ₹81,100 per month",
    jobCategory: "State Government",
    employmentType: "Permanent",
    recruitingOrganization: "State Public Service Commission",
    ageLimit: "21-35 years",
    applicationFee: "₹150 (General/OBC), ₹50 (SC/ST)",
    selectionProcess: "Preliminary Exam + Main Exam + Interview + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
  },
  clerk: {
    title: "Government Clerk Recruitment 2025",
    department: "Various Government Departments",
    location: "District/State-wide",
    qualification: "12th Pass with Computer Knowledge",
    description: "Government departments invite applications for Clerk posts. Candidates with typing skills preferred.",
    salary: "₹19,900 - ₹63,200 per month",
    jobCategory: "Central Government",
    employmentType: "Permanent",
    recruitingOrganization: "Subordinate Service Selection Board",
    ageLimit: "18-27 years",
    applicationFee: "₹100 (General/OBC), No fee (SC/ST)",
    selectionProcess: "Written Test + Typing Test + Document Verification",
    vacancyBreakdown: "General: 50%, OBC: 27%, SC: 15%, ST: 7.5%, EWS: 10%"
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

// New field options for enhanced entry
const jobCategoryOptions = [
  "Central Government",
  "State Government",
  "PSU",
  "Banking",
  "Railway",
  "Defence",
  "Police",
  "Healthcare",
  "Education"
];

const employmentTypeOptions = [
  "Permanent",
  "Contract",
  "Apprentice",
  "Temporary",
  "Part-time"
];

const recruitingOrgSuggestions = [
  "Staff Selection Commission",
  "Union Public Service Commission",
  "Railway Recruitment Board",
  "State Bank of India",
  "IBPS",
  "ONGC",
  "SAIL",
  "Coal India Limited",
  "BHEL",
  "NTPC",
  "Indian Army",
  "Indian Navy",
  "Indian Air Force",
  "DRDO",
  "ISRO"
];

interface ManualJobEntryProps {
  onJobAdded: () => void;
}

export default function ManualJobEntry({ onJobAdded }: ManualJobEntryProps) {
  // Keyboard shortcut handler for Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };
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
    positions: "1",
    ageLimit: "",
    applicationFee: "",
    selectionProcess: "",
    experienceRequired: "",
    // New priority fields for enhanced entry
    jobCategory: "",
    employmentType: "",
    recruitingOrganization: "",
    applicationStartDate: "",
    vacancyBreakdown: "",
    prepGuide: "",
    syllabus: "",
    notificationFileUrl: "",
    slug: "",
    featuredImageUrl: "",
    notifications: [] as Array<{ label: string; url: string; type: 'file' | 'link' }>,
    customLinks: [] as Array<{ label: string; url: string }>
  });

  // State for multiple positions
  const [jobPositions, setJobPositions] = useState([
    {
      id: crypto.randomUUID(),
      positionName: "",
      qualification: "",
      experienceRequired: "",
      salaryRange: "",
      numberOfVacancies: "1",
      specificRequirements: ""
    }
  ]);
  const [useMultiplePositions, setUseMultiplePositions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiProvider, setAiProvider] = useState<"gemini" | "groq">("gemini");

  // Load saved AI provider from site settings on mount
  const { data: siteSettings } = useQuery({
    queryKey: ["/api/site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to fetch site settings");
      return res.json();
    }
  });

  useEffect(() => {
    if (siteSettings?.aiModelProvider && (siteSettings.aiModelProvider === "gemini" || siteSettings.aiModelProvider === "groq")) {
      setAiProvider(siteSettings.aiModelProvider as "gemini" | "groq");
    }
  }, [siteSettings]);
  const [theme, setTheme] = useState("saffron-glass");
  const [customBgUrl, setCustomBgUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateFeaturedImage = async () => {
    if (!formData.title || !formData.department || !formData.qualification) {
      toast({ title: "Incomplete Details", description: "Please enter Title, Department, and Qualification first.", variant: "destructive" });
      return;
    }
    
    setIsGeneratingImage(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/generate-featured-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: formData.title, 
          department: formData.department, 
          qualification: formData.qualification,
          positions: formData.positions,
          deadline: formData.deadline,
          theme,
          customBgUrl
        }),
      });

      if (!response.ok) throw new Error("Failed to generate image");
      
      const { imageUrl } = await response.json();
      if (imageUrl) {
        setFormData(prev => ({ ...prev, featuredImageUrl: imageUrl }));
        toast({ title: "Success", description: "Featured Image generated automatically!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Image generation failed.", variant: "destructive" });
    } finally {
      setIsGeneratingImage(false);
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
      const extractResponse = await fetch("/api/admin/extract-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText: text, provider: aiProvider }),
      });

        if (extractResponse.ok) {
          const data = await extractResponse.json();
          const { jobPositions: extractedPositions, useMultiplePositions: aiDetectedMulti, ...jobData } = data;
          
          setFormData(prev => ({
            ...prev,
            ...jobData,
            prepGuide: data.prepGuide || "",
            syllabus: data.syllabus || "",
            sourceUrl: scrapeUrl // Automatically pre-fill the source URL field too
          }));

          if (aiDetectedMulti && extractedPositions && extractedPositions.length > 0) {
            setUseMultiplePositions(true);
            setJobPositions(extractedPositions.map((pos: any) => ({
              ...pos,
              id: pos.id || crypto.randomUUID()
            })));
          }

          toast({ title: "Pipeline Successful", description: "URL Scraped and Job details organized automatically. Please review carefully." });
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
      toast({ title: "Error", description: "Please paste job details first", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/extract-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText, provider: aiProvider }),
      });

      if (response.ok) {
        const data = await response.json();
        const { jobPositions: extractedPositions, useMultiplePositions: aiDetectedMulti, ...jobData } = data;
        
        setFormData(prev => ({ 
          ...prev, 
          ...jobData,
          prepGuide: data.prepGuide || "",
          syllabus: data.syllabus || ""
        }));

        if (aiDetectedMulti && extractedPositions && extractedPositions.length > 0) {
          setUseMultiplePositions(true);
          setJobPositions(extractedPositions.map((pos: any) => ({
            ...pos,
            id: pos.id || crypto.randomUUID()
          })));
        }

        toast({ title: "Extraction Successful", description: "Job details have been organized. Please review before publishing." });
      } else {
        throw new Error("Failed to extract");
      }
    } catch (error) {
      toast({ title: "Extraction Failed", description: "Could not organize job details. Please try again.", variant: "destructive" });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Auto-generate slug if title changes and slug is empty or matches previous title's slug
      if (field === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const template = jobTemplates[templateKey as keyof typeof jobTemplates];
    setFormData(prev => ({
      ...prev,
      ...template,
      customLinks: []
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
    if (!formData.jobCategory.trim()) errors.push("Job category is required");
    if (!formData.employmentType.trim()) errors.push("Employment type is required");
    if (!formData.recruitingOrganization.trim()) errors.push("Recruiting organization is required");
    if (!formData.department.trim()) errors.push("Department is required");
    if (!formData.location.trim()) errors.push("Location is required");

    // Validate qualification based on mode
    if (!useMultiplePositions && !formData.qualification.trim()) {
      errors.push("Qualification is required");
    }

    if (!formData.deadline.trim()) errors.push("Application deadline is required");
    if (!formData.applyLink.trim()) errors.push("Application link is required");

    // Validate multiple positions if enabled
    if (useMultiplePositions) {
      const validPositions = jobPositions.filter(pos => pos.positionName && String(pos.positionName).trim() !== '');

      if (validPositions.length === 0) {
        errors.push("At least one position with a name is required");
      }

      validPositions.forEach((position, index) => {
        if (!position.positionName || String(position.positionName).trim() === '') {
          errors.push(`Position ${index + 1}: Position name is required`);
        }
        if (!position.qualification || String(position.qualification).trim() === '') {
          errors.push(`Position ${index + 1}: Qualification is required`);
        }
        if (!position.numberOfVacancies || String(position.numberOfVacancies).trim() === "") {
          errors.push(`Position ${index + 1}: Number of vacancies is required`);
        }
      });
    }

    // Set defaults for optional fields
    if (!formData.sourceUrl.trim()) {
      formData.sourceUrl = "Manual Entry";
    }

    // Validate URL format
    if (formData.applyLink && !isValidUrl(formData.applyLink)) {
      errors.push("Application link must be a valid URL");
    }
    if (formData.sourceUrl && formData.sourceUrl !== "Manual Entry" && !isValidUrl(formData.sourceUrl)) {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      handleInputChange("notificationFileUrl", data.url);
      toast({
        title: "Success",
        description: "Official Notification uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input to allow identical file selection
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the red alert box at the top of the form for missing or invalid fields.",
        variant: "destructive"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("admin_token");

      // Prepare job data with required fields and smart defaults
      const jobData = {
        ...formData,
        postedOn: new Date().toISOString().split('T')[0], // Today's date
        sourceUrl: formData.sourceUrl || "Manual Entry",
        positions: formData.positions.toString() || "1", // Use text
        // Set application start date if provided
        applicationStartDate: formData.applicationStartDate || null,
        slug: formData.slug || generateSlug(formData.title),
        notifications: formData.notifications || [],
        customLinks: formData.customLinks || [],
        // Include multiple positions data if enabled
        ...(useMultiplePositions && {
          jobPositions: jobPositions
            .filter(pos => pos.positionName.trim() !== '')
            .map(pos => ({
              ...pos,
              numberOfVacancies: pos.numberOfVacancies.toString() || "1" // Use text
            })),
          useMultiplePositions: true
        })
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
          positions: "1",
          ageLimit: "",
          applicationFee: "",
          experienceRequired: "",
          jobCategory: "",
          employmentType: "",
          recruitingOrganization: "",
          applicationStartDate: "",
          vacancyBreakdown: "",
          selectionProcess: "",
          prepGuide: "",
          syllabus: "",
          notificationFileUrl: "",
          featuredImageUrl: "",
          slug: "",
          notifications: [],
          customLinks: []
        });

        // Reset additional state
        setJobPositions([]);
        setUseMultiplePositions(false);
        setRawText("");
        setScrapeUrl("");
        setValidationErrors([]);

        onJobAdded();
      } else {
        const error = await response.json();
        const errorMessage = error.message || "Please check your input and try again.";
        
        // If it's a validation error with details, we could show them in setValidationErrors
        if (error.details && Array.isArray(error.details)) {
          setValidationErrors(error.details.map((d: any) => `${d.path.join('.')} - ${d.message}`));
        } else {
          setValidationErrors([errorMessage]);
        }

        toast({
          title: "Failed to Add Job",
          description: errorMessage,
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
      positions: "1",
      ageLimit: "",
      applicationFee: "",
      experienceRequired: "",
      jobCategory: "",
      employmentType: "",
      recruitingOrganization: "",
      applicationStartDate: "",
      vacancyBreakdown: "",
      selectionProcess: "",
      prepGuide: "",
      syllabus: "",
      notificationFileUrl: "",
      featuredImageUrl: "",
      slug: "",
      notifications: [],
      customLinks: []
    });
    setJobPositions([{
      id: crypto.randomUUID(),
      positionName: "",
      qualification: "",
      experienceRequired: "",
      salaryRange: "",
      numberOfVacancies: "1",
      specificRequirements: ""
    }]);
    setUseMultiplePositions(false);
    setValidationErrors([]);
  };

  // Position management functions
  const addPosition = () => {
    setJobPositions(prev => [...prev, {
      id: crypto.randomUUID(),
      positionName: "",
      qualification: "",
      experienceRequired: "",
      salaryRange: "",
      numberOfVacancies: "1",
      specificRequirements: ""
    }]);
  };

  const removePosition = (positionId: string) => {
    if (jobPositions.length > 1) {
      setJobPositions(prev => prev.filter(pos => pos.id !== positionId));
    }
  };

  const updatePosition = (positionId: string, field: string, value: string | number) => {
    setJobPositions(prev => prev.map(pos =>
      pos.id === positionId ? { ...pos, [field]: value } : pos
    ));
  };

  const toggleMultiplePositions = (enabled: boolean) => {
    setUseMultiplePositions(enabled);
    if (!enabled) {
      // Reset to single position
      setJobPositions([{
        id: crypto.randomUUID(),
        positionName: "",
        qualification: "",
        experienceRequired: "",
        salaryRange: "",
        numberOfVacancies: "1",
        specificRequirements: ""
      }]);
    }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {/* AI Extraction Section */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Smart Extraction
          </CardTitle>
          <CardDescription>
            Paste raw job details or notification text below. Gemini will extract and organize it into the form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/80 p-4 rounded-lg border border-purple-100 flex flex-col md:flex-row gap-3">
            <div className="flex-[2] space-y-2">
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
            <div className="flex-1 space-y-2">
              <Label className="text-purple-900 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Engine
              </Label>
              <Select value={aiProvider} onValueChange={(val: any) => setAiProvider(val)}>
                <SelectTrigger className="border-purple-200 bg-white">
                  <SelectValue placeholder="Engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq" className="font-medium text-green-700">Groq (Llama 3) - Fast</SelectItem>
                  <SelectItem value="gemini" className="font-medium text-blue-700">Gemini (AI Studio)</SelectItem>
                </SelectContent>
              </Select>
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
            placeholder="Paste raw job description, notification text, or advertisement details here..."
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
                Organize Job Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Header with Templates */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">⚡ Rapid Job Entry</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Optimized for 30-45 second job posting • Use templates for instant setup
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
            data-testid="button-templates"
            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Quick Templates
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
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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

              {/* Priority Fields Row for Speed */}
              <div>
                <Label htmlFor="jobCategory">Job Category *</Label>
                <Select
                  value={formData.jobCategory}
                  onValueChange={(value) => handleInputChange('jobCategory', value)}
                >
                  <SelectTrigger data-testid="select-job-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleInputChange('employmentType', value)}
                >
                  <SelectTrigger data-testid="select-employment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recruiting Organization */}
              <div className="md:col-span-2">
                <Label htmlFor="recruitingOrganization">Recruiting Organization *</Label>
                <Input
                  id="recruitingOrganization"
                  value={formData.recruitingOrganization}
                  onChange={(e) => handleInputChange('recruitingOrganization', e.target.value)}
                  placeholder="e.g., Staff Selection Commission, Railway Recruitment Board"
                  list="recruiting-org-suggestions"
                  data-testid="input-recruiting-organization"
                />
                <datalist id="recruiting-org-suggestions">
                  {recruitingOrgSuggestions.map(org => (
                    <option key={org} value={org} />
                  ))}
                </datalist>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g., Staff Selection Commission"
                  list="department-suggestions"
                  data-testid="input-department"
                />
                <datalist id="department-suggestions">
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., All India, Delhi"
                  list="location-suggestions"
                  data-testid="input-location"
                />
                <datalist id="location-suggestions">
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
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

              {/* Experience Required */}
              <div>
                <Label htmlFor="experienceRequired">Experience Required</Label>
                <Input
                  id="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                  placeholder="e.g., Fresh graduates, 2-5 years, No experience required"
                  data-testid="input-experience"
                />
              </div>

              {/* Application Dates Row */}
              <div>
                <Label htmlFor="applicationStartDate">Application Start Date *</Label>
                <Input
                  id="applicationStartDate"
                  type="date"
                  value={formData.applicationStartDate}
                  onChange={(e) => handleInputChange('applicationStartDate', e.target.value)}
                  data-testid="input-application-start-date"
                />
              </div>

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

              {/* Slug / Permalink */}
              <div className="md:col-span-2">
                <Label htmlFor="slug">Search Friendly Permalink (Slug) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="e.g., ssc-cgl-recruitment-2025"
                    data-testid="input-slug"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleInputChange('slug', generateSlug(formData.title))}
                    className="shrink-0"
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase">
                  URL will be: govtjobnow.com/job/{formData.slug || "..."}
                </p>
              </div>

              {/* Featured Image Generation */}
              <div className="md:col-span-2 space-y-4 bg-gray-50/50 p-4 border rounded-xl border-gray-100">
                <Label className="text-lg font-black flex items-center gap-2 text-indigo-800">
                  <ImagePlus className="h-5 w-5" />
                  Satori Banner Engine
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Select Graphic Theme</Label>
                    <Select value={theme} onValueChange={(val) => setTheme(val)}>
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Select Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saffron-glass">Saffron Glass (Indian Gov)</SelectItem>
                        <SelectItem value="blue-slate">Blue Slate (Corporate)</SelectItem>
                        <SelectItem value="minimal-light">Minimal White (Clean)</SelectItem>
                        <SelectItem value="admin-pro">Admin Pro (Navy Split)</SelectItem>
                        <SelectItem value="ocean-wave">Ocean Wave (Cyan Vibes)</SelectItem>
                        <SelectItem value="sunrise-glow">Sunrise Glow (Warm)</SelectItem>
                        <SelectItem value="cherry-blossom">Cherry Blossom (Soft Pink)</SelectItem>
                        <SelectItem value="emerald-city">Emerald City (Vibrant Green)</SelectItem>
                        <SelectItem value="forest-dark">Deep Forest (Dark Green)</SelectItem>
                        <SelectItem value="dark-hacker">Dark Hacker (Intense Black)</SelectItem>
                        <SelectItem value="ruby-red">Ruby Red (Dark Crimson)</SelectItem>
                        <SelectItem value="purple-nebula">Purple Nebula (Cyberpunk)</SelectItem>
                        <SelectItem value="midnight-gold">Midnight Gold (Premium)</SelectItem>
                        <SelectItem value="metro-dark">Metro Dark (Slate Blue)</SelectItem>
                        <SelectItem value="monochrome-steel">Monochrome Steel (Professional)</SelectItem>
                        <SelectItem value="custom">Upload Custom Template...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {theme === "custom" && (
                     <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700 flex justify-between">
                          <span>Custom Background Settings</span>
                       </Label>
                       <div className="flex gap-2">
                         <Input 
                           placeholder="Paste URL or upload local image..."
                           value={customBgUrl}
                           onChange={(e) => setCustomBgUrl(e.target.value)}
                           className="border-gray-200"
                         />
                         
                         <div className="shrink-0 relative">
                           <Input 
                             type="file"
                             accept="image/*"
                             id="custom-bg-upload"
                             className="hidden"
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
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
                                   setCustomBgUrl(data.url);
                                   toast({ title: "Template Uploaded", description: "Image synced securely to server!" });
                                 } else {
                                   toast({ title: "Upload Failed", variant: "destructive" });
                                 }
                               } catch (error) {
                                 toast({ title: "Upload Failed", variant: "destructive" });
                               }
                             }}
                           />
                           <Button 
                             type="button" 
                             variant="outline" 
                             onClick={() => document.getElementById("custom-bg-upload")?.click()}
                             className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                           >
                             <Upload className="w-4 h-4 md:mr-2" />
                             <span className="hidden md:inline">From PC</span>
                           </Button>
                         </div>
                       </div>
                     </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 items-center">
                  <Input 
                    placeholder="Resulting Image URL: /uploads/featured-....png"
                    value={formData.featuredImageUrl || ""} 
                    onChange={(e) => handleInputChange("featuredImageUrl", e.target.value)}
                    className="flex-1 bg-white"
                  />
                  
                  {/* Custom Featured Image Upload */}
                  <div className="shrink-0 relative">
                    <Input 
                      type="file"
                      accept="image/*"
                      id="featured-image-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (file.size > 10 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Please upload an image smaller than 10MB.",
                            variant: "destructive"
                          });
                          return;
                        }

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
                            handleInputChange("featuredImageUrl", data.url);
                            toast({ title: "Image Uploaded", description: "Your custom featured image has been uploaded successfully!" });
                          } else {
                            toast({ title: "Upload Failed", variant: "destructive" });
                          }
                        } catch (error) {
                          toast({ title: "Upload Failed", variant: "destructive" });
                        } finally {
                          e.target.value = ''; // Reset
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById("featured-image-upload")?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-10 px-3"
                      title="Upload Custom Image"
                    >
                      <Upload className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Upload</span>
                    </Button>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGenerateFeaturedImage}
                    disabled={isGeneratingImage || !formData.title || !formData.department || !formData.qualification}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-md font-bold shrink-0 h-10"
                  >
                    {isGeneratingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    <span className="hidden md:inline">Burn Text to Image</span>
                  </Button>
                </div>
                {formData.featuredImageUrl && (
                  <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm relative bg-gray-50 flex flex-col items-center justify-center p-2 group">
                    <img 
                      src={formData.featuredImageUrl} 
                      alt="Featured Preview" 
                      className="max-w-full h-auto object-contain rounded-lg transition-opacity group-hover:opacity-80" 
                      style={{ maxHeight: '200px' }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <Button 
                        type="button"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = formData.featuredImageUrl;
                          a.download = formData.featuredImageUrl.split('/').pop() || 'featured-image.png';
                          a.click();
                        }}
                        className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">Auto-generated image runs via Satori and Resvg and saves directly to the uploads folder.</p>
              </div>

              {/* Additional Fields Row 1 */}
              <div>
                <Label htmlFor="positions">Number of Positions</Label>
                <Input
                  id="positions"
                  type="text"
                  value={formData.positions}
                  onChange={(e) => handleInputChange('positions', e.target.value)}
                  placeholder="e.g. 1500+, Various, To be announced"
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

              <div className="space-y-2">
                <Label htmlFor="selectionProcess">Selection Process</Label>
                <Textarea
                  id="selectionProcess"
                  placeholder="e.g., CBT, Physical, Interview"
                  value={formData.selectionProcess || ""}
                  onChange={(e) => setFormData({ ...formData, selectionProcess: e.target.value })}
                  data-testid="input-selection-process"
                />
              </div>

              {/* Vacancy Breakdown */}
              <div className="md:col-span-2">
                <Label htmlFor="vacancyBreakdown">Vacancy Breakdown (Optional)</Label>
                <Input
                  id="vacancyBreakdown"
                  value={formData.vacancyBreakdown}
                  onChange={(e) => handleInputChange('vacancyBreakdown', e.target.value)}
                  placeholder="e.g., UR:20, OBC:10, SC:5, ST:3, EWS:2"
                  data-testid="input-vacancy-breakdown"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Category-wise vacancy distribution (UR, OBC, SC, ST, EWS)
                </p>
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

              {/* Official Notifications (Multiple) */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Official Notifications (Multiple PDFs/Links)</h3>
                    <p className="text-sm text-gray-500">Add all official documents, short notices, or external links here.</p>
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => setFormData(p => ({ 
                      ...p, 
                      notifications: [...(p.notifications || []), { label: "Official Notification", url: "", type: 'link' }] 
                    }))}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Notification
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
                        onClick={() => setFormData(p => ({
                          ...p,
                          notifications: p.notifications.filter((_, i) => i !== index)
                        }))}
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
                            setFormData(p => ({ ...p, notifications: newNotifs }));
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
                              setFormData(p => ({ ...p, notifications: newNotifs }));
                            }}
                          />
                          <div className="shrink-0 relative">
                            <Input
                              type="file"
                              accept=".pdf,image/*"
                              className="hidden"
                              id={`file-upload-${index}`}
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
                                    setFormData(p => ({ ...p, notifications: newNotifs }));
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
                              onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                              disabled={isUploading}
                              title="Upload File"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legacy field for backward compatibility - keep sync'ed or hidden */}
                <div className="hidden">
                  <Input
                    id="notificationFileUrl"
                    value={formData.notificationFileUrl || ''}
                    readOnly
                  />
                </div>
              </div>

              {/* SEO Enrichment Section */}
              <div className="md:col-span-2 space-y-4 pt-6 mt-6 border-t-2 border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-800">
                  <Building2 className="h-6 w-6" />
                  <h3 className="text-xl font-bold">SEO & AdSense Booster (Unique Content)</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="prepGuide" className="text-blue-900 font-semibold">Preparation Strategy & Tips</Label>
                    <Textarea
                      id="prepGuide"
                      rows={5}
                      className="bg-white border-blue-200 focus:border-blue-500"
                      placeholder="AI will generate unique strategy here..."
                      value={formData.prepGuide || ""}
                      onChange={(e) => setFormData({ ...formData, prepGuide: e.target.value })}
                    />
                    <p className="text-xs text-blue-600 font-medium">✨ This unique content is key for ranking on Google's first page and AdSense approval.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="syllabus" className="text-blue-900 font-semibold">Syllabus Overview</Label>
                    <Textarea
                      id="syllabus"
                      rows={5}
                      className="bg-white border-blue-200 focus:border-blue-500"
                      placeholder="AI will generate structured syllabus here..."
                      value={formData.syllabus || ""}
                      onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Links Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-indigo-600" />
                  <Label className="text-lg font-black text-gray-900">Custom Important Links</Label>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 font-bold"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      customLinks: [...prev.customLinks, { label: "", url: "" }]
                    }));
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Link
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Add additional helpful links like "Apply Here", "Syllabus PDF", "Previous Year Papers", etc.
              </p>

              {formData.customLinks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.customLinks.map((link, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative group">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white border shadow-sm text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            customLinks: prev.customLinks.filter((_, i) => i !== idx)
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link Label</Label>
                        <input
                          className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                          placeholder="e.g. Official Syllabus"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...formData.customLinks];
                            newLinks[idx].label = e.target.value;
                            setFormData(prev => ({ ...prev, customLinks: newLinks }));
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link URL</Label>
                        <input
                          className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...formData.customLinks];
                            newLinks[idx].url = e.target.value;
                            setFormData(prev => ({ ...prev, customLinks: newLinks }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Multiple Positions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Multiple Positions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable for jobs with different posts having different requirements
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="multiple-positions">Enable Multiple Positions</Label>
                  <input
                    id="multiple-positions"
                    type="checkbox"
                    checked={useMultiplePositions}
                    onChange={(e) => toggleMultiplePositions(e.target.checked)}
                    className="rounded"
                    data-testid="checkbox-multiple-positions"
                  />
                </div>
              </div>

              {useMultiplePositions && (
                <div className="space-y-4">
                  <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                    <strong>Note:</strong> When using multiple positions, the main qualification and salary fields above will be ignored.
                    Each position will have its own specific requirements.
                  </div>

                  {jobPositions.map((position, index) => (
                    <div key={position.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Position {index + 1}</h4>
                        {jobPositions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePosition(position.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`button-remove-position-${index}`}
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Position Name */}
                        <div>
                          <Label htmlFor={`position-name-${position.id}`}>Position Name *</Label>
                          <Input
                            id={`position-name-${position.id}`}
                            value={position.positionName}
                            onChange={(e) => updatePosition(position.id, 'positionName', e.target.value)}
                            placeholder="e.g., Assistant, Inspector, Officer"
                            data-testid={`input-position-name-${index}`}
                          />
                        </div>

                        {/* Number of Vacancies */}
                        <div>
                          <Label htmlFor={`vacancies-${position.id}`}>Number of Vacancies</Label>
                          <Input
                            id={`vacancies-${position.id}`}
                            type="text"
                            value={position.numberOfVacancies}
                            onChange={(e) => updatePosition(position.id, 'numberOfVacancies', e.target.value)}
                            placeholder="e.g. 1500+, Various"
                            data-testid={`input-vacancies-${index}`}
                          />
                        </div>

                        {/* Qualification */}
                        <div>
                          <Label htmlFor={`position-qualification-${position.id}`}>Required Qualification *</Label>
                          <Input
                            id={`position-qualification-${position.id}`}
                            value={position.qualification}
                            onChange={(e) => updatePosition(position.id, 'qualification', e.target.value)}
                            placeholder="e.g., Graduate, Post Graduate, Diploma"
                            data-testid={`input-position-qualification-${index}`}
                          />
                        </div>

                        {/* Experience */}
                        <div>
                          <Label htmlFor={`position-experience-${position.id}`}>Experience Required</Label>
                          <Input
                            id={`position-experience-${position.id}`}
                            value={position.experienceRequired}
                            onChange={(e) => updatePosition(position.id, 'experienceRequired', e.target.value)}
                            placeholder="e.g., 2-5 years, Fresh graduates"
                            data-testid={`input-position-experience-${index}`}
                          />
                        </div>

                        {/* Salary Range */}
                        <div>
                          <Label htmlFor={`position-salary-${position.id}`}>Salary Range</Label>
                          <Input
                            id={`position-salary-${position.id}`}
                            value={position.salaryRange}
                            onChange={(e) => updatePosition(position.id, 'salaryRange', e.target.value)}
                            placeholder="e.g., ₹25,500 - ₹81,100 per month"
                            data-testid={`input-position-salary-${index}`}
                          />
                        </div>

                        {/* Specific Requirements */}
                        <div>
                          <Label htmlFor={`position-requirements-${position.id}`}>Specific Requirements</Label>
                          <Input
                            id={`position-requirements-${position.id}`}
                            value={position.specificRequirements}
                            onChange={(e) => updatePosition(position.id, 'specificRequirements', e.target.value)}
                            placeholder="Any position-specific requirements"
                            data-testid={`input-position-requirements-${index}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPosition}
                    className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                    data-testid="button-add-position"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Position
                  </Button>
                </div>
              )}
            </div>

            {/* Speed Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">⚡ Speed Tips</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Use templates for instant setup</li>
                <li>• Tab through fields quickly</li>
                <li>• Ctrl+Enter to submit from any field</li>
                <li>• Recruiting org has auto-suggestions</li>
                <li>• Enable multiple positions for jobs like SSC CGL with different posts</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                    Publish Job (Ctrl+Enter)
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