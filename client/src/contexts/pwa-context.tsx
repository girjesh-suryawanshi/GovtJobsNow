import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PWAContextType {
  deferredPrompt: any;
  isInstallable: boolean;
  installApp: () => Promise<void>;
  isInstalled: boolean;
  showManualGuide: boolean;
  setShowManualGuide: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

let deferredPromptGlobal: any = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPromptGlobal = e;
  });
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check global capture
    if (deferredPromptGlobal) {
      setDeferredPrompt(deferredPromptGlobal);
      setIsInstallable(true);
    }
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      console.log("PWA: beforeinstallprompt caught");
      e.preventDefault();
      deferredPromptGlobal = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("PWA: App installed successfully");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem("gj_pwa_installed", "true");
      toast({ title: "App Installed", description: "GovtJobsNow is now available on your device." });
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      setShowManualGuide(true);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <PWAContext.Provider value={{ deferredPrompt, isInstallable, installApp, isInstalled, showManualGuide, setShowManualGuide }}>
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}
