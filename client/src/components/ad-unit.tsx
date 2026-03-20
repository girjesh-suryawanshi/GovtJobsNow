import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { SiteSettings } from "@shared/schema";

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

/**
 * AdUnit component for strategic AdSense placement.
 * Now dynamic: Controlled by Admin Dashboard settings.
 */
export const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = "auto", 
  className = "", 
  label = "Sponsored" 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  useEffect(() => {
    // If ads are enabled and we have ad content code, trigger AdSense push
    if (settings?.adsEnabled && settings.adsContentCode && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [settings?.adsEnabled, settings?.adsContentCode]);

  // If ads are disabled or we don't have code yet, show a premium placeholder
  if (!settings?.adsEnabled || !settings?.adsContentCode) {
    return (
      <div className={`my-8 w-full ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            {label}
          </span>
          <Card className="relative flex min-h-[120px] w-full items-center justify-center overflow-hidden border-dashed bg-muted/20 transition-all hover:bg-muted/30">
            {/* Subtle geometric pattern background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="ad-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="1" height="1" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#ad-pattern)" />
              </svg>
            </div>
            
            <div className="z-10 text-center opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <div className="text-sm font-extrabold text-muted-foreground/40 tracking-tighter">
                AD SPACE
              </div>
              {slot && (
                <div className="mt-1 text-[10px] text-muted-foreground/30">
                  ID: {slot}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render real AdSense unit if enabled
  return (
    <div className={`my-8 w-full overflow-hidden ${className}`} ref={adRef}>
      <div className="flex flex-col items-center justify-center">
        <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
          {label}
        </span>
        {/* AdSense HTML Injection - We strip common <script> tags from content code to handle pushing manually above */}
        <div 
          className="w-full flex justify-center"
          dangerouslySetInnerHTML={{ 
            __html: settings.adsContentCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") 
          }} 
        />
      </div>
    </div>
  );
};
