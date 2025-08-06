import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Eye,
  MoreHorizontal,
  Edit,
  Save,
  X
} from "lucide-react";

interface ProcessingLog {
  id: string;
  url: string;
  status: string;
  createdAt: string;
  processingTimeMs?: number;
  errorMessage?: string;
  extractedData?: any;
}

export default function ProcessingHistory() {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<ProcessingLog | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProcessingHistory();
  }, []);

  const fetchProcessingHistory = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/processing-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch processing history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "review_required":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      failed: "destructive",
      review_required: "secondary",
      processing: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const formatDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleReviewJob = (log: ProcessingLog) => {
    if (log.extractedData) {
      setReviewData(log.extractedData);
      setSelectedLog(log);
      setIsReviewing(true);
    } else {
      toast({
        title: "No Data Available",
        description: "This extraction has no data available for review.",
        variant: "destructive"
      });
    }
  };

  const handlePublishJob = async () => {
    if (!reviewData || !selectedLog) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/publish-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          logId: selectedLog.id,
          jobData: reviewData
        })
      });

      if (response.ok) {
        toast({
          title: "Job Published",
          description: "The job has been successfully published!"
        });
        setIsReviewing(false);
        setSelectedLog(null);
        setReviewData(null);
        fetchProcessingHistory(); // Refresh the list
      } else {
        throw new Error("Failed to publish job");
      }
    } catch (error) {
      toast({
        title: "Publication Failed",
        description: "Failed to publish the job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDiscardReview = () => {
    setIsReviewing(false);
    setSelectedLog(null);
    setReviewData(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading processing history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing History Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No processing history found</p>
                      {searchTerm && (
                        <p className="text-sm">Try adjusting your search terms</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <a
                          href={log.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline truncate block"
                        >
                          {log.url}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatDomain(log.url)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.processingTimeMs ? (
                        <span className="text-sm text-gray-600">
                          {Math.round(log.processingTimeMs / 1000)}s
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {log.status === "review_required" && log.extractedData && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReviewJob(log)}
                            className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                            title="Review & Publish"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {isReviewing && reviewData && (
        <Dialog open={isReviewing} onOpenChange={() => handleDiscardReview()}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Review Extracted Job Data
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={reviewData.title || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, title: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={reviewData.department || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, department: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={reviewData.location || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, location: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={reviewData.qualification || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, qualification: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    value={reviewData.deadline || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, deadline: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (Optional)</Label>
                  <Input
                    id="salary"
                    value={reviewData.salary || ""}
                    onChange={(e) => setReviewData((prev: any) => ({...prev, salary: e.target.value}))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={reviewData.description || ""}
                  onChange={(e) => setReviewData((prev: any) => ({...prev, description: e.target.value}))}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button onClick={handlePublishJob} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Publish Job
                </Button>
                
                <Button variant="outline" onClick={handleDiscardReview}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Log Details Modal */}
      {selectedLog && !isReviewing && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Processing Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">URL</h4>
              <p className="text-sm text-gray-600 break-all">{selectedLog.url}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedLog.status)}
                {getStatusBadge(selectedLog.status)}
              </div>
            </div>
            
            {selectedLog.status === "review_required" && selectedLog.extractedData && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium mb-2 text-yellow-800">Action Required</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  This extraction requires review before publication.
                </p>
                <Button 
                  onClick={() => handleReviewJob(selectedLog)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Review & Publish
                </Button>
              </div>
            )}
            
            {selectedLog.errorMessage && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Error Message</h4>
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  {selectedLog.errorMessage}
                </p>
              </div>
            )}
            
            {selectedLog.extractedData && (
              <div>
                <h4 className="font-medium mb-2">Extracted Data</h4>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedLog.extractedData, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="text-xs text-gray-500 pt-4 border-t">
              Processed on {formatDate(selectedLog.createdAt)}
              {selectedLog.processingTimeMs && (
                <span> • Took {Math.round(selectedLog.processingTimeMs / 1000)}s</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}