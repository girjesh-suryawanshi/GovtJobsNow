import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Smartphone, Share, PlusSquare, Monitor, MoreVertical } from "lucide-react";
import { usePWA } from "@/contexts/pwa-context";

export default function PWAManualGuide() {
  const { showManualGuide, setShowManualGuide } = usePWA();

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <Dialog open={showManualGuide} onOpenChange={setShowManualGuide}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 leading-tight mb-2">
            Install GovtJobsNow
          </DialogTitle>
          <DialogDescription className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Follow these steps to add the app to your device
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {isIOS && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Share className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">1. Tap the 'Share' button</p>
                  <p className="text-xs text-gray-500 font-medium">Located at the bottom of your Safari browser.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <PlusSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">2. Select 'Add to Home Screen'</p>
                  <p className="text-xs text-gray-500 font-medium">Scroll down the share menu to find this option.</p>
                </div>
              </div>
            </div>
          )}

          {isAndroid && !isIOS && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <MoreVertical className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">1. Tap the menu icon</p>
                  <p className="text-xs text-gray-500 font-medium">The three dots in the top right of Chrome.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">2. Tap 'Install app'</p>
                  <p className="text-xs text-gray-500 font-medium">Or 'Add to Home Screen' if Install is not available.</p>
                </div>
              </div>
            </div>
          )}

          {!isIOS && !isAndroid && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Monitor className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Desktop Installation</p>
                  <p className="text-xs text-gray-500 font-medium">Look for the install icon in your browser's address bar (right side) to install GovtJobsNow.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-orange-50/20 rounded-2xl border border-orange-100/30 italic text-[11px] text-orange-600/70 text-center font-medium">
            <p className="font-black mb-1">Not seeing the 'Install' prompt?</p>
            Make sure you are accessing via <strong>localhost</strong> or <strong>https</strong>, and that you've refreshed the page at least once.
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-[11px] text-gray-400 text-center font-medium">
            "Once added, you'll get instant access to job alerts and admit cards directly from your home screen."
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
