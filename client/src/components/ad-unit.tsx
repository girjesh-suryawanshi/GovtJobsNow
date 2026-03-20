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
  const { data: settings, isLoading } = useQuery<SiteSettings>({
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

  // If loading or ads are disabled, show nothing (hide the container)
  if (isLoading || !settings?.adsEnabled || !settings?.adsContentCode) {
    return null;
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
