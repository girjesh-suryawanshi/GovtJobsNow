import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Globe,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractionTemplate {
  id: string;
  name: string;
  domain: string;
  selectors: Record<string, string>;
  patterns?: Record<string, string>;
  isActive: boolean;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

export default function TemplateManager() {
  const [templates, setTemplates] = useState<ExtractionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<ExtractionTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: "",
      name: "",
      domain: "",
      selectors: {
        title: "",
        department: "",
        location: "",
        qualification: "",
        deadline: "",
        salary: ""
      },
      patterns: {},
      isActive: true,
      successRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: ExtractionTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      const token = localStorage.getItem("admin_token");
      const url = editingTemplate.id 
        ? `/api/admin/templates/${editingTemplate.id}`
        : "/api/admin/templates";
      
      const method = editingTemplate.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTemplate),
      });

      if (response.ok) {
        toast({
          title: editingTemplate.id ? "Template Updated" : "Template Created",
          description: "Template has been saved successfully.",
        });
        fetchTemplates();
        setIsDialogOpen(false);
        setEditingTemplate(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Template Deleted",
          description: "Template has been removed.",
        });
        fetchTemplates();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive",
      });
    }
  };

  const toggleTemplateStatus = async (template: ExtractionTemplate) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...template,
          isActive: !template.isActive
        }),
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template status.",
        variant: "destructive",
      });
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSuccessRateIcon = (rate: number) => {
    if (rate >= 80) return <TrendingUp className="h-4 w-4" />;
    if (rate >= 60) return <Activity className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading templates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Extraction Templates</CardTitle>
            <CardDescription>
              Manage CSS selectors and patterns for different job sites
            </CardDescription>
          </div>
          <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </CardHeader>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found</p>
                      <p className="text-sm">Create your first extraction template</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{template.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline">{template.domain}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${getSuccessRateColor(template.successRate)}`}>
                        {getSuccessRateIcon(template.successRate)}
                        <span className="font-medium">{template.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={() => toggleTemplateStatus(template)}
                        />
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate?.id ? "Edit Template" : "Create New Template"}
            </DialogTitle>
            <DialogDescription>
              Configure CSS selectors and patterns to extract job information from specific domains
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate(prev => prev ? {...prev, name: e.target.value} : null)}
                    placeholder="e.g., Sarkari Result"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={editingTemplate.domain}
                    onChange={(e) => setEditingTemplate(prev => prev ? {...prev, domain: e.target.value} : null)}
                    placeholder="e.g., sarkariresult.com or * for generic"
                  />
                </div>
              </div>

              {/* CSS Selectors */}
              <div>
                <h4 className="font-medium mb-4">CSS Selectors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(editingTemplate.selectors).map(([field, selector]) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        id={field}
                        value={selector}
                        onChange={(e) => {
                          const newSelectors = {...editingTemplate.selectors};
                          newSelectors[field] = e.target.value;
                          setEditingTemplate(prev => prev ? {...prev, selectors: newSelectors} : null);
                        }}
                        placeholder={`CSS selector for ${field}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Regex Patterns */}
              <div>
                <h4 className="font-medium mb-4">Regex Patterns (Optional)</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patterns">Additional extraction patterns (JSON)</Label>
                    <Textarea
                      id="patterns"
                      value={JSON.stringify(editingTemplate.patterns || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const patterns = JSON.parse(e.target.value);
                          setEditingTemplate(prev => prev ? {...prev, patterns} : null);
                        } catch {
                          // Invalid JSON, ignore for now
                        }
                      }}
                      rows={4}
                      placeholder='{"salary": "₹[\\d,]+", "deadline": "\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}"}'
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingTemplate.id ? "Update Template" : "Create Template"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}