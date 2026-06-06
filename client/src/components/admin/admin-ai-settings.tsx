import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Save, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminAiSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    aiModelProvider: "gemini",
    geminiApiKey: "",
    groqApiKey: "",
    ollamaEndpoint: "http://localhost:11434",
    ollamaModel: "llama3",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/site-settings"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/site-settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        aiModelProvider: settings.aiModelProvider || "gemini",
        geminiApiKey: settings.geminiApiKey || "",
        groqApiKey: settings.groqApiKey || "",
        ollamaEndpoint: settings.ollamaEndpoint || "http://localhost:11434",
        ollamaModel: settings.ollamaModel || "llama3",
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Settings Saved",
        description: "AI model configuration updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save AI settings.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          AI Assistant Settings
        </h2>
        <p className="text-gray-500 mt-1">Configure which AI model powers the job seeker chatbot.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Model Selection</CardTitle>
            <CardDescription>Choose between cloud-hosted models (Gemini/Groq) or local VPS models (Ollama).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Active AI Provider</Label>
              <Select
                value={formData.aiModelProvider}
                onValueChange={(val) => setFormData(p => ({ ...p, aiModelProvider: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="groq">Groq (Fast Inference)</SelectItem>
                  <SelectItem value="ollama">Ollama (Local/VPS)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.aiModelProvider === "gemini" && (
              <div className="space-y-2 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <Label>Gemini API Key</Label>
                <Input
                  type="password"
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData(p => ({ ...p, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                />
                <p className="text-xs text-gray-500">Get this from Google AI Studio.</p>
              </div>
            )}

            {formData.aiModelProvider === "groq" && (
              <div className="space-y-2 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <Label>Groq API Key</Label>
                <Input
                  type="password"
                  value={formData.groqApiKey}
                  onChange={(e) => setFormData(p => ({ ...p, groqApiKey: e.target.value }))}
                  placeholder="gsk_..."
                />
                <p className="text-xs text-gray-500">Get this from Groq Console.</p>
              </div>
            )}

            {formData.aiModelProvider === "ollama" && (
              <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="space-y-2">
                  <Label>Ollama Endpoint URL</Label>
                  <Input
                    value={formData.ollamaEndpoint}
                    onChange={(e) => setFormData(p => ({ ...p, ollamaEndpoint: e.target.value }))}
                    placeholder="http://localhost:11434"
                  />
                  <p className="text-xs text-gray-500">The base URL of your Ollama instance.</p>
                </div>
                <div className="space-y-2">
                  <Label>Ollama Model Name</Label>
                  <Input
                    value={formData.ollamaModel}
                    onChange={(e) => setFormData(p => ({ ...p, ollamaModel: e.target.value }))}
                    placeholder="llama3"
                  />
                  <p className="text-xs text-gray-500">Ensure this model is pulled on your VPS (e.g., llama3, mistral).</p>
                </div>
              </div>
            )}

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save AI Settings
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
