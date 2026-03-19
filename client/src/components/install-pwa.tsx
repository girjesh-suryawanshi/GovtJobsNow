import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/contexts/pwa-context";

export default function InstallPWA() {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("gj_pwa_dismissed");
    const permanentlyInstalled = localStorage.getItem("gj_pwa_installed");
    if (isInstallable && !isInstalled && !dismissed && !permanentlyInstalled) {
      setIsVisible(true);
    }
  }, [isInstallable, isInstalled]);

  if (!isVisible || isInstalled) return null;

  const handleInstallClick = () => {
    installApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("gj_pwa_dismissed", "true");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] md:bottom-8 md:right-8 md:left-auto md:w-96 animate-in slide-in-from-bottom-full duration-500">
      <div className="bg-white dark:bg-gray-900 md:rounded-[2rem] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] md:shadow-2xl border-t md:border border-blue-100 dark:border-blue-900/50 p-4 md:p-6 flex items-center gap-4 overflow-hidden relative group">
        <div className="hidden md:block absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Smartphone className="h-20 w-20" />
        </div>
        
        <div className="bg-blue-600 p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-100 shrink-0">
          <Download className="h-5 w-5 md:h-6 md:h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xs md:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">Install GovtJobsNow</h4>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold line-clamp-1">Fast access to job alerts & admit cards.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-400 font-bold text-[10px] hover:bg-transparent hover:text-gray-600" onClick={handleDismiss}>
             NOT NOW
           </Button>
           <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8 text-gray-300" onClick={handleDismiss}>
             <X className="h-4 w-4" />
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 md:h-10 px-4 md:px-6 font-black text-[10px] md:text-xs shadow-lg shadow-blue-100" onClick={handleInstallClick}>
             INSTALL
           </Button>
        </div>
      </div>
    </div>
  );
}
