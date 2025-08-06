import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Globe, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Save,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessedJob {
  title: string;
  department: string;
  location: string;
  qualification: string;
  deadline: string;
  salary?: string;
  description?: string;
}

interface UrlProcessorProps {
  onJobProcessed: () => void;
}

export default function UrlProcessor({ onJobProcessed }: UrlProcessorProps) {
  const [url, setUrl] = useState("");
  const [autoPublish, setAutoPublish] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedJob, setProcessedJob] = useState<ProcessedJob | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "review">("idle");
  const [error, setError] = useState("");
  const [processingTime, setProcessingTime] = useState(0);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!url) return;

    setIsProcessing(true);
    setStatus("idle");
    setError("");
    setProcessedJob(null);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/process-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          autoPublish,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setProcessedJob(result.extractedJob);
        setProcessingTime(result.processingTimeMs);
        
        if (result.status === "completed") {
          setStatus("success");
          toast({
            title: "Job Processed Successfully",
            description: autoPublish ? "Job has been published!" : "Job extracted for review.",
          });
        } else {
          setStatus("review");
        }
        
        onJobProcessed();
      } else {
        setStatus("error");
        setError(result.message || "Failed to process URL");
      }
    } catch (err) {
      setStatus("error");
      setError("Network error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishJob = async () => {
    if (!processedJob) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/publish-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(processedJob),
      });

      if (response.ok) {
        setStatus("success");
        toast({
          title: "Job Published",
          description: "The job has been successfully published!",
        });
        onJobProcessed();
      } else {
        throw new Error("Failed to publish job");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to publish job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setUrl("");
    setProcessedJob(null);
    setStatus("idle");
    setError("");
    setProcessingTime(0);
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Process Job URL
          </CardTitle>
          <CardDescription>
            Enter a job posting URL to automatically extract and create a job listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Job Post URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/job-posting"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-publish"
                checked={autoPublish}
                onCheckedChange={setAutoPublish}
                disabled={isProcessing}
              />
              <Label htmlFor="auto-publish" className="text-sm">
                Auto-publish if extraction confidence is high
              </Label>
            </div>

            <Button
              onClick={handleProcess}
              disabled={!url || isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Process URL
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {status !== "idle" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {status === "success" && (
                <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              )}
              {status === "review" && (
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              )}
              {status === "error" && (
                <XCircle className="h-6 w-6 text-red-600 mt-1" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    status === "success" ? "default" : 
                    status === "review" ? "secondary" : "destructive"
                  }>
                    {status === "success" ? "Completed" : 
                     status === "review" ? "Review Required" : "Failed"}
                  </Badge>
                  
                  {processingTime > 0 && (
                    <Badge variant="outline">
                      {Math.round(processingTime / 1000)}s
                    </Badge>
                  )}
                </div>
                
                {error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Job Data for Review */}
      {processedJob && status === "review" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-600" />
              Review Extracted Data
            </CardTitle>
            <CardDescription>
              Please review and edit the extracted job information before publishing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={processedJob.title}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, title: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={processedJob.department}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, department: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={processedJob.location}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, location: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={processedJob.qualification}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, qualification: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  value={processedJob.deadline}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, deadline: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  value={processedJob.salary || ""}
                  onChange={(e) => setProcessedJob(prev => prev ? {...prev, salary: e.target.value} : null)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={processedJob.description || ""}
                onChange={(e) => setProcessedJob(prev => prev ? {...prev, description: e.target.value} : null)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handlePublishJob} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Publish Job
              </Button>
              
              <Button variant="outline" onClick={handleReset}>
                <Trash2 className="h-4 w-4 mr-2" />
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {status === "success" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Job Successfully Processed!</p>
                <p className="text-sm text-green-700">
                  The job has been {autoPublish ? 'automatically published' : 'added to the review queue'}.
                </p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Process Another URL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}