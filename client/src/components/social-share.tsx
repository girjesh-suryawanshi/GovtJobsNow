import { useState } from "react";
import { 
  Share2, MessageCircle, Send, Facebook, Twitter, 
  Linkedin, Copy, Check, X, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@shared/schema";

interface SocialShareProps {
  url: string;
  title: string;
  trigger?: React.ReactNode;
}

export default function SocialShare({ url, title, trigger }: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link Copied", description: "The URL has been copied to your clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Copy Failed", variant: "destructive" });
    }
  };

  const enabledPlatforms = (settings?.enabledSocialPlatforms as string[]) || ["whatsapp", "telegram", "facebook", "twitter", "linkedin"];

  // Fallback trigger if none provided
  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
      <Share2 className="h-5 w-5" />
    </Button>
  );

  const sharePlatforms = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366]",
      onClick: () => {
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
        window.open(shareUrl, "_blank");
      }
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: Send,
      color: "bg-[#0088cc]",
      onClick: () => {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, "_blank");
      }
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2]",
      onClick: () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
      }
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "bg-[#000000]",
      onClick: () => {
        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, "_blank");
      }
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2]",
      onClick: () => {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
      }
    }
  ].filter(p => enabledPlatforms.includes(p.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md rounded-3xl p-6 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Share2 className="h-6 w-6 text-blue-600" /> Share This Opportunity
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-6">
          {sharePlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={platform.onClick}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className={`${platform.color} p-4 rounded-2xl text-white shadow-lg shadow-gray-200 group-hover:scale-110 group-active:scale-95 transition-all`}>
                <platform.icon className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
                {platform.name}
              </span>
            </button>
          ))}
          
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 group transition-all"
          >
            <div className={`bg-gray-100 p-4 rounded-2xl text-gray-600 shadow-lg shadow-gray-200 group-hover:scale-110 group-active:scale-95 transition-all`}>
              {copied ? <Check className="h-6 w-6 text-green-600" /> : <Copy className="h-6 w-6" />}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Direct Link</p>
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 overflow-hidden">
             <span className="text-xs text-gray-500 font-medium truncate flex-1">
               {url}
             </span>
             <ExternalLink className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
