import { useState, useEffect } from "react";
import { BellRing, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "subscribed" | "denied">("idle");

  useEffect(() => {
    // Check if browser supports notifications
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const dismissed = localStorage.getItem("gjn_push_dismissed");
    const subscribed = localStorage.getItem("gjn_push_subscribed");

    if (subscribed === "true") {
      setStatus("subscribed");
      return;
    }

    if (Notification.permission === "granted") {
      setStatus("subscribed");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    // Show prompt after 3 seconds if not dismissed
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser notifications are not supported on this device.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        localStorage.setItem("gjn_push_subscribed", "true");
        setStatus("subscribed");
        setIsVisible(false);
        // Display test notification
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("GovtJobNow Alerts Activated! 🚀", {
              body: "You will now receive instant alerts for 10th Pass, 12th Pass, and Graduate government jobs.",
              icon: "/logo.png"
            });
          });
        }
      } else {
        localStorage.setItem("gjn_push_dismissed", "true");
        setStatus("denied");
        setIsVisible(false);
      }
    } catch (e) {
      console.error("Push notification error:", e);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("gjn_push_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible || status === "subscribed") return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/60 flex items-start gap-3 relative">
        <div className="p-2.5 bg-blue-600 rounded-xl text-white shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
          <BellRing className="h-5 w-5 animate-pulse" />
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-extrabold text-sm text-white">Enable Instant Job Alerts 🔔</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Get instant browser notifications when new 10th Pass, Railway, or SSC vacancies are announced.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={handleSubscribe}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-sm"
            >
              Allow Job Alerts
            </Button>
            <button
              onClick={handleDismiss}
              className="text-xs text-slate-400 hover:text-white font-semibold px-2 py-1 transition-colors"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
