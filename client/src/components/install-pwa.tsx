import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/contexts/pwa-context";

export default function InstallPWA() {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("gj_pwa_dismissed");
    if (isInstallable && !isInstalled && !dismissed) {
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
    <div className="fixed bottom-6 left-6 right-6 z-[150] md:left-auto md:right-8 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-blue-100 dark:border-blue-900/50 p-6 flex items-center gap-4 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Smartphone className="h-20 w-20" />
        </div>
        
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
          <Download className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Install Official App</h4>
          <p className="text-[10px] text-gray-400 font-bold">Access jobs & alerts instantly from your {window.innerWidth < 768 ? 'Mobile' : 'Desktop'}.</p>
        </div>
        
        <div className="flex flex-col gap-2">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-300" onClick={handleDismiss}>
             <X className="h-4 w-4" />
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-bold text-xs" onClick={handleInstallClick}>
             INSTALL
           </Button>
        </div>
      </div>
    </div>
  );
}
