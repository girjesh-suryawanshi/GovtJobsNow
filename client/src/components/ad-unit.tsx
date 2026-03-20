import React from "react";
import { Card } from "@/components/ui/card";

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

/**
 * AdUnit component for strategic AdSense placement.
 * Includes a placeholder for development/ad-blockers to maintain layout stability (prevent CLS).
 */
export const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = "auto", 
  className = "", 
  label = "Sponsored" 
}) => {
  // In a real production app, you would inject the AdSense script here.
  // For now, we provide a premium-looking placeholder that respects the layout.

  return (
    <div className={`my-8 w-full ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
          {label}
        </span>
        <Card className="relative flex min-h-[120px] w-full items-center justify-center overflow-hidden border-dashed bg-muted/30 transition-all hover:bg-muted/50">
          {/* Subtle geometric pattern background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="ad-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#ad-pattern)" />
            </svg>
          </div>
          
          <div className="z-10 text-center">
            <div className="text-sm font-extrabold text-muted-foreground/40">
              AD PLACEMENT
            </div>
            {slot && (
              <div className="mt-1 text-[10px] text-muted-foreground/30">
                Slot: {slot}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
