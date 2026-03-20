import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Info, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { SiteSettings } from "@shared/schema";

export default function AdminAdsSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [adsHeaderCode, setAdsHeaderCode] = useState("");
  const [adsContentCode, setAdsContentCode] = useState("");

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  useEffect(() => {
    if (settings) {
      setAdsEnabled(settings.adsEnabled);
      setAdsHeaderCode(settings.adsHeaderCode || "");
      setAdsContentCode(settings.adsContentCode || "");
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newData: Partial<SiteSettings>) => {
      return await apiRequest("PATCH", "/api/admin/site-settings", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Settings Updated",
        description: "AdSense configuration has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Could not save settings.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate({
      adsEnabled,
      adsHeaderCode,
      adsContentCode,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AdSense Management</h2>
        <p className="text-gray-600">Control global AdSense visibility and placement code.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Global Ad Visibility</CardTitle>
                <CardDescription>Toggle all AdSense units across the website.</CardDescription>
              </div>
              <Switch 
                checked={adsEnabled} 
                onCheckedChange={setAdsEnabled} 
              />
            </div>
          </CardHeader>
          {adsEnabled && (
            <CardContent className="bg-blue-50/50 border-t p-4 flex items-start gap-4">
              <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-700 leading-relaxed">
                Ads are currently <strong>Enabled</strong>. Ensure you have provided valid AdSense code below for them to render correctly.
              </p>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Header Script</CardTitle>
            <CardDescription>
              Paste the global AdSense script here. This will be injected into the <code>&lt;head&gt;</code> of every page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header-code">Script Tag</Label>
              <Textarea
                id="header-code"
                placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>'
                value={adsHeaderCode}
                onChange={(e) => setAdsHeaderCode(e.target.value)}
                className="font-mono text-sm min-h-[120px] bg-gray-50 dark:bg-gray-900"
              />
              <p className="text-[11px] text-muted-foreground">
                Copy this from your AdSense "Site" or "Header" setup instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Ad Unit Code</CardTitle>
            <CardDescription>
              The default HTML code for individual ad placements (Home, Job Details, etc).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-code">Ad Unit HTML</Label>
              <Textarea
                id="content-code"
                placeholder='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
                value={adsContentCode}
                onChange={(e) => setAdsContentCode(e.target.value)}
                className="font-mono text-sm min-h-[150px] bg-gray-50 dark:bg-gray-900"
              />
              <p className="text-[11px] text-muted-foreground">
                This code will be injected into every active <code>AdUnit</code> placement on the site.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={updateSettingsMutation.isPending}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>

        <Card className="border-dashed border-2 bg-gray-50/50 mt-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <h4 className="font-semibold text-gray-700">AdSense Quick Tips</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-3 list-disc pl-5">
              <li>Changes may take a few minutes to reflect globally due to browser caching.</li>
              <li>Make sure to use your unique <code>ca-pub-XXXXXXXX</code> ID correctly.</li>
              <li>If ads are enabled but not appearing, check the browser console for policy or sandbox errors.</li>
              <li>Always verify your AdSense account status for account-level restrictions.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
