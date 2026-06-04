import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Save, Eye, EyeOff, Search, Tag, Image,
  FileText, Settings, BarChart2, Globe, Twitter, Facebook,
  Link2, ChevronDown, ChevronUp, Loader2, CheckCircle2,
  XCircle, AlertTriangle, BookOpen, HelpCircle, ListChecks,
  Monitor, Smartphone, Copy, RefreshCw, PenLine, ExternalLink,
  Zap, ArrowLeft
} from "lucide-react";
import { BlogPost, InsertBlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// ============================================================
// SEO / AEO Scoring Utilities
// ============================================================

interface SeoCheckItem {
  label: string;
  pass: boolean;
  weight: number;
}

function calcSeoScore(formData: Partial<InsertBlogPost>, focusKeyword: string): { score: number; checks: SeoCheckItem[] } {
  const kw = focusKeyword.toLowerCase().trim();
  const title = (formData.title || "").toLowerCase();
  const slug = (formData.slug || "").toLowerCase();
  const seoDesc = (formData.seoDescription || "").toLowerCase();
  const content = formData.content || "";
  const wordCount = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const checks: SeoCheckItem[] = [
    { label: "Focus keyword in title", pass: !!kw && title.includes(kw), weight: 15 },
    { label: "Focus keyword in URL slug", pass: !!kw && slug.includes(kw.replace(/\s+/g, "-")), weight: 10 },
    { label: "Focus keyword in meta description", pass: !!kw && seoDesc.includes(kw), weight: 12 },
    { label: "SEO title 40–60 characters", pass: (formData.seoTitle || formData.title || "").length >= 40 && (formData.seoTitle || formData.title || "").length <= 60, weight: 10 },
    { label: "Meta description 120–160 characters", pass: seoDesc.length >= 120 && seoDesc.length <= 160, weight: 10 },
    { label: "Content ≥ 800 words", pass: wordCount >= 800, weight: 15 },
    { label: "Cover image alt text present", pass: !!(formData.coverImageAlt && formData.coverImageAlt.length > 5), weight: 8 },
    { label: "Internal links detected", pass: /href=["'][\/](?!\/)[^"']+["']/i.test(content), weight: 10 },
    { label: "External links detected", pass: /href=["']https?:\/\/(?!govtjobnow)[^"']+["']/i.test(content), weight: 5 },
    { label: "H2 headings present", pass: /<h2[\s>]/i.test(content), weight: 8 },
    { label: "H3 subheadings present", pass: /<h3[\s>]/i.test(content), weight: 7 },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / totalWeight) * 100);

  return { score, checks };
}

function calcAeoScore(formData: Partial<InsertBlogPost>): { score: number; checks: SeoCheckItem[] } {
  const content = formData.content || "";
  const faqs = (formData.faq as any[]) || [];
  const headings = Array.from(content.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/gi)).map((m) => m[1].toLowerCase());

  const checks: SeoCheckItem[] = [
    { label: "Key Takeaways summary (excerpt) present", pass: !!(formData.excerpt && formData.excerpt.length > 50), weight: 18 },
    { label: "FAQ items present (≥ 2)", pass: faqs.length >= 2, weight: 20 },
    { label: "Conversational headings (how/what/why/?)", pass: headings.some((h) => /how|what|why|when|where|\?/.test(h)), weight: 15 },
    { label: "Lists or tables in content", pass: /<ul|<ol|<table/i.test(content), weight: 12 },
    { label: "Author name provided", pass: !!(formData.authorName && formData.authorName.trim().length > 2), weight: 10 },
    { label: "Author bio provided (EEAT)", pass: !!(formData.authorBio && formData.authorBio.length > 30), weight: 10 },
    { label: "Author image provided (EEAT)", pass: !!(formData.authorImage && formData.authorImage.length > 5), weight: 8 },
    { label: "Blockquotes or statistics in content", pass: /<blockquote/i.test(content) || /\d+(\.\d+)?%/.test(content) || /\b\d{4,}\b/.test(content), weight: 7 },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / totalWeight) * 100);

  return { score, checks };
}

// ============================================================
// Score Ring Component
// ============================================================
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-black" style={{ color }}>{score}</span>
    </div>
  );
}

// ============================================================
// Check Item Row
// ============================================================
function CheckRow({ item }: { item: SeoCheckItem }) {
  return (
    <div className={`flex items-start gap-2.5 py-2 px-3 rounded-lg text-xs transition-colors ${item.pass ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/20"}`}>
      {item.pass ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
      )}
      <span className={item.pass ? "text-green-800 dark:text-green-300" : "text-red-700 dark:text-red-400"}>
        {item.label}
      </span>
      <span className="ml-auto text-slate-400 font-medium">{item.weight}pt</span>
    </div>
  );
}

// ============================================================
// Google Snippet Preview
// ============================================================
function GooglePreview({ title, url, description, mobile }: { title: string; url: string; description: string; mobile?: boolean }) {
  const siteName = "govtjobnow.com › blog";
  const displayTitle = title || "Article Title";
  const displayDesc = description || "Meta description will appear here...";
  const truncTitle = displayTitle.length > 60 ? displayTitle.slice(0, 57) + "..." : displayTitle;
  const truncDesc = displayDesc.length > 160 ? displayDesc.slice(0, 157) + "..." : displayDesc;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 ${mobile ? "max-w-sm" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4 bg-blue-100 dark:bg-blue-950 rounded-sm flex items-center justify-center">
          <span className="text-blue-600 text-[8px] font-black">G</span>
        </div>
        <span className="text-xs text-slate-500">{siteName}</span>
      </div>
      <p className="text-blue-700 dark:text-blue-400 font-medium text-sm hover:underline cursor-pointer leading-snug">{truncTitle}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{truncDesc}</p>
    </div>
  );
}

// ============================================================
// Social Card Previews
// ============================================================
function FacebookCardPreview({ title, description, image }: { title: string; description: string; image?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-[#e4e6ea] max-w-sm bg-[#f0f2f5] dark:bg-slate-800 dark:border-slate-700">
      {image ? (
        <img src={image} alt="og preview" className="w-full h-36 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-36 bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
          <Image className="w-8 h-8 text-blue-300" />
        </div>
      )}
      <div className="px-3 py-2.5">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">govtjobnow.com</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug mt-0.5">{title || "Article Title"}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{description || "Description"}</p>
      </div>
    </div>
  );
}

function TwitterCardPreview({ title, description, image }: { title: string; description: string; image?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-sm bg-white dark:bg-slate-900">
      {image ? (
        <img src={image} alt="twitter preview" className="w-full h-40 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Twitter className="w-8 h-8 text-slate-300" />
        </div>
      )}
      <div className="px-4 py-3">
        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">{title || "Article Title"}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{description || "Description"}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Link2 className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] text-slate-400">govtjobnow.com</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Slug Generator
// ============================================================
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ============================================================
// FAQ Builder
// ============================================================
interface FaqBuilderProps {
  items: Array<{ question: string; answer: string }>;
  onChange: (items: Array<{ question: string; answer: string }>) => void;
}

function FaqBuilder({ items, onChange }: FaqBuilderProps) {
  const add = () => onChange([...items, { question: "", answer: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: "question" | "answer", value: string) => {
    const updated = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">FAQ #{i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input
            placeholder="Question..."
            value={item.question}
            onChange={(e) => update(i, "question", e.target.value)}
            className="mb-2 text-sm"
          />
          <Textarea
            placeholder="Answer..."
            value={item.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-3.5 h-3.5" /> Add FAQ Item
      </button>
    </div>
  );
}

// ============================================================
// Internal Linking Suggestions Tab
// ============================================================
function LinkingSuggestionsTab({ postId, token }: { postId?: string; token: string }) {
  const { data: suggestions, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog/linking-suggestions", postId],
    queryFn: () =>
      fetch(`/api/admin/blog/linking-suggestions/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    enabled: !!postId,
  });

  const { toast } = useToast();

  const copyHtml = (post: BlogPost) => {
    const html = `<a href="/blog/${post.slug}">${post.title}</a>`;
    navigator.clipboard.writeText(html);
    toast({ title: "Copied!", description: "HTML link copied to clipboard." });
  };

  if (!postId) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <Link2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        Save the post first to see linking suggestions.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No similar posts found yet. Publish more content to get suggestions.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 mb-3">
        {suggestions.length} related post{suggestions.length !== 1 ? "s" : ""} found. Click to copy HTML link.
      </p>
      {suggestions.map((post) => {
        const html = `<a href="/blog/${post.slug}">${post.title}</a>`;
        return (
          <div
            key={post.id}
            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{post.title}</p>
              <code className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">{html}</code>
            </div>
            <button
              onClick={() => copyHtml(post)}
              className="flex-shrink-0 p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
interface ManualBlogEntryProps {
  editingPost?: BlogPost | null;
  onSaved?: () => void;
}

const EMPTY_FORM: Partial<InsertBlogPost> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "",
  tags: [],
  coverImage: "",
  coverImageAlt: "",
  coverImageCaption: "",
  authorName: "GovtJobNow Editorial",
  authorBio: "",
  authorImage: "",
  readingTime: 5,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  indexing: "index",
  follow: "follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterCard: "summary_large_image",
  schemaType: "BlogPosting",
  faq: [],
  howTo: [],
  tocEnabled: true,
  ctaType: "newsletter",
};

type ActiveTab = "seo" | "aeo" | "preview" | "links";

export default function ManualBlogEntry({ editingPost, onSaved }: ManualBlogEntryProps) {
  const [formData, setFormData] = useState<Partial<InsertBlogPost>>(() => {
    if (!editingPost) return { ...EMPTY_FORM };
    // Cast JSON db fields to their expected runtime types
    const { id, viewCount, createdAt, updatedAt, ...rest } = editingPost as any;
    return rest as Partial<InsertBlogPost>;
  });
  const [focusKeyword, setFocusKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("seo");
  const [tagInput, setTagInput] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [currentPostId, setCurrentPostId] = useState<string | undefined>(editingPost?.id);
  const [slugAutoMode, setSlugAutoMode] = useState(!editingPost);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("admin_token") || "";

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, WEBP, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        update("coverImage", data.url);
        if (!formData.coverImageAlt) {
          update("coverImageAlt", formData.title || "Featured Image");
        }
        toast({ title: "✅ Image Uploaded", description: "Featured image set successfully." });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err) {
      toast({ title: "Upload Failed", description: "Failed to upload image. Please try again.", variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    update("coverImage", "");
    update("coverImageAlt", "");
    update("coverImageCaption", "");
    toast({ title: "🗑️ Image Removed", description: "Featured image cleared." });
  };

  // Real-time scores
  const { score: seoScore, checks: seoChecks } = calcSeoScore(formData, focusKeyword);
  const { score: aeoScore, checks: aeoChecks } = calcAeoScore(formData);

  const update = (key: keyof InsertBlogPost, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && slugAutoMode) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<InsertBlogPost>) =>
      fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (post: BlogPost) => {
      setCurrentPostId(post.id);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "✅ Post Created", description: `"${post.title}" saved successfully.` });
      onSaved?.();
    },
    onError: () => toast({ title: "Error", description: "Failed to create post.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertBlogPost>) =>
      fetch(`/api/admin/blog/${currentPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (post: BlogPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "✅ Post Updated", description: `"${post.title}" updated.` });
      onSaved?.();
    },
    onError: () => toast({ title: "Error", description: "Failed to update post.", variant: "destructive" }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (publishNow = false) => {
    const data: Partial<InsertBlogPost> = {
      ...formData,
      status: publishNow ? "published" : (formData.status || "draft"),
    };
    if (currentPostId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const existing = (formData.tags as string[]) || [];
    if (!existing.includes(t)) update("tags", [...existing, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    update("tags", ((formData.tags as string[]) || []).filter((t) => t !== tag));
  };

  const faqs = (formData.faq as Array<{ question: string; answer: string }>) || [];

  const scoreColor = (s: number) =>
    s >= 70 ? "text-green-600 bg-green-50 border-green-200"
    : s >= 40 ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";

  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: "seo", label: "SEO", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { key: "aeo", label: "AI / AEO", icon: <Zap className="w-3.5 h-3.5" /> },
    { key: "preview", label: "Previews", icon: <Eye className="w-3.5 h-3.5" /> },
    { key: "links", label: "Linking", icon: <Link2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex gap-0 h-full">
      {/* ================================================================
          LEFT: EDITOR PANEL
          ================================================================ */}
      <div className="flex-1 min-w-0 overflow-y-auto pr-4 space-y-5 max-h-[calc(100vh-200px)]">

        {/* Status Bar */}
        <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-950 py-2 z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Badge className={formData.status === "published" ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
              {formData.status === "published" ? "Published" : "Draft"}
            </Badge>
            {currentPostId && (
              <a href={`/blog/${formData.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSave(true)} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Publish
            </Button>
          </div>
        </div>

        {/* Core Fields */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <PenLine className="w-3.5 h-3.5" /> Core Content
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Post Title *</label>
            <Input value={formData.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Enter compelling article title..." className="text-lg font-semibold" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block flex items-center justify-between">
              URL Slug
              <button onClick={() => { setSlugAutoMode(!slugAutoMode); }} className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${slugAutoMode ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                {slugAutoMode ? "Auto" : "Manual"}
              </button>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex-shrink-0">/blog/</span>
              <Input
                value={formData.slug || ""}
                onChange={(e) => { setSlugAutoMode(false); update("slug", e.target.value); }}
                placeholder="article-url-slug"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Category</label>
              <Input value={formData.category || ""} onChange={(e) => update("category", e.target.value)} placeholder="e.g. SSC Exam Guide" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Reading Time (min)</label>
              <Input type="number" value={formData.readingTime || 5} onChange={(e) => update("readingTime", parseInt(e.target.value) || 5)} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type tag + Enter"
                className="text-sm"
              />
              <Button variant="outline" size="sm" onClick={addTag}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {((formData.tags as string[]) || []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Key Takeaways / Excerpt *</label>
            <Textarea
              value={formData.excerpt || ""}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Write a compelling 2-3 sentence summary. This appears as the AI-citation callout block at the top of the article."
              rows={3}
              className="text-sm"
            />
            <p className="text-[10px] text-slate-400 mt-1">{(formData.excerpt || "").length} chars — used for AEO callout and meta description fallback</p>
          </div>

          {/* Featured Image Section */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Featured Cover Image</label>
            
            {formData.coverImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    id="blog-image-replace" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={isUploadingImage}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => document.getElementById("blog-image-replace")?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                    Replace Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div 
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("blog-image-upload")?.click()}
                >
                  <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Click to upload featured image</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    id="blog-image-upload" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={isUploadingImage}
                  />
                </div>
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink-0 mx-3 text-[10px] text-slate-400 uppercase font-bold">Or paste direct image URL</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <Input 
                  value={formData.coverImage || ""} 
                  onChange={(e) => update("coverImage", e.target.value)} 
                  placeholder="https://example.com/image.jpg" 
                  className="text-xs font-mono"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Image Alt Text</label>
                <Input value={formData.coverImageAlt || ""} onChange={(e) => update("coverImageAlt", e.target.value)} placeholder="e.g. SSC Exam Syllabus guide" className="text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Image Caption</label>
                <Input value={formData.coverImageCaption || ""} onChange={(e) => update("coverImageCaption", e.target.value)} placeholder="Source or description" className="text-xs" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block flex items-center justify-between">
              <span>Article Content (HTML)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                formData.content?.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length || 0 >= 800
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
              }`}>
                {formData.content?.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length || 0} words
              </span>
            </label>
            <Textarea
              value={formData.content || ""}
              onChange={(e) => update("content", e.target.value)}
              placeholder="<h2>Introduction</h2><p>Your article content here...</p>"
              rows={16}
              className="font-mono text-xs resize-y"
            />
          </div>
        </section>

        {/* Author Section */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Author (EEAT Signals)
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Author Name</label>
            <Input value={formData.authorName || ""} onChange={(e) => update("authorName", e.target.value)} placeholder="Author full name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Author Bio</label>
            <Textarea value={formData.authorBio || ""} onChange={(e) => update("authorBio", e.target.value)} placeholder="Short bio (50+ chars)..." rows={2} className="text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Author Image URL</label>
            <Input value={formData.authorImage || ""} onChange={(e) => update("authorImage", e.target.value)} placeholder="https://..." />
          </div>
        </section>

        {/* SEO Fields */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" /> Traditional SEO
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>SEO Title</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${(formData.seoTitle || formData.title || "").length >= 40 && (formData.seoTitle || formData.title || "").length <= 60 ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                {(formData.seoTitle || formData.title || "").length} / 40-60
              </span>
            </label>
            <Input value={formData.seoTitle || ""} onChange={(e) => update("seoTitle", e.target.value)} placeholder="Leave blank to use post title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>Meta Description</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${(formData.seoDescription || "").length >= 120 && (formData.seoDescription || "").length <= 160 ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                {(formData.seoDescription || "").length} / 120-160
              </span>
            </label>
            <Textarea value={formData.seoDescription || ""} onChange={(e) => update("seoDescription", e.target.value)} placeholder="Compelling description for search engine results..." rows={3} className="text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">SEO Keywords</label>
            <Input value={formData.seoKeywords || ""} onChange={(e) => update("seoKeywords", e.target.value)} placeholder="keyword1, keyword2, keyword3" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Indexing</label>
              <select className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background" value={formData.indexing || "index"} onChange={(e) => update("indexing", e.target.value)}>
                <option value="index">Index</option>
                <option value="noindex">No Index</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Follow</label>
              <select className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background" value={formData.follow || "follow"} onChange={(e) => update("follow", e.target.value)}>
                <option value="follow">Follow</option>
                <option value="nofollow">No Follow</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Canonical URL (optional)</label>
            <Input value={formData.canonicalUrl || ""} onChange={(e) => update("canonicalUrl", e.target.value)} placeholder="https://govtjobnow.com/blog/slug" />
          </div>
        </section>

        {/* Social / OG */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Facebook className="w-3.5 h-3.5" /> Social Sharing
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">OG Title</label>
            <Input value={formData.ogTitle || ""} onChange={(e) => update("ogTitle", e.target.value)} placeholder="Leave blank to use post title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">OG Description</label>
            <Textarea value={formData.ogDescription || ""} onChange={(e) => update("ogDescription", e.target.value)} placeholder="Description for Facebook/LinkedIn shares..." rows={2} className="text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">OG / Twitter Image URL</label>
            <Input value={formData.ogImage || ""} onChange={(e) => update("ogImage", e.target.value)} placeholder="https://... (1200×630 recommended)" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Twitter Card Type</label>
            <select className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background" value={formData.twitterCard || "summary_large_image"} onChange={(e) => update("twitterCard", e.target.value)}>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="summary">Summary</option>
            </select>
          </div>
        </section>

        {/* AEO/Schema */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> AI / AEO Schema
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Schema Type</label>
            <select className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background" value={formData.schemaType || "BlogPosting"} onChange={(e) => update("schemaType", e.target.value)}>
              <option value="BlogPosting">BlogPosting</option>
              <option value="NewsArticle">NewsArticle</option>
              <option value="Article">Article</option>
              <option value="HowTo">HowTo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> FAQ Items
            </label>
            <FaqBuilder items={faqs} onChange={(items) => update("faq", items)} />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="toc-enabled"
              checked={!!formData.tocEnabled}
              onChange={(e) => update("tocEnabled", e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="toc-enabled" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Enable Table of Contents
            </label>
          </div>
        </section>
      </div>

      {/* ================================================================
          RIGHT: SEO ANALYSIS PANEL
          ================================================================ */}
      <div className="w-[360px] flex-shrink-0 border-l border-slate-200 dark:border-slate-700 pl-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 sticky top-0 z-10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- TAB: SEO Score ---- */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            {/* Focus Keyword */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-500" /> Focus Keyword
              </label>
              <Input
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. ssc cgl exam guide"
                className="text-sm"
              />
            </div>

            {/* Score */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border ${scoreColor(seoScore)}`}>
              <ScoreRing score={seoScore} size={70} />
              <div>
                <p className="font-bold text-base">{seoScore}/100</p>
                <p className="text-xs opacity-70">SEO Score</p>
                <p className="text-xs mt-1 font-medium">
                  {seoScore >= 70 ? "🟢 Good" : seoScore >= 40 ? "🟡 Needs work" : "🔴 Poor"}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5">
              {seoChecks.map((c, i) => <CheckRow key={i} item={c} />)}
            </div>
          </div>
        )}

        {/* ---- TAB: AEO Score ---- */}
        {activeTab === "aeo" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">AI Search Optimization</h4>
            </div>
            <p className="text-xs text-slate-500 -mt-2">How well AI engines (ChatGPT, Gemini, Perplexity) can cite your content.</p>

            {/* Score */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border ${scoreColor(aeoScore)}`}>
              <ScoreRing score={aeoScore} size={70} />
              <div>
                <p className="font-bold text-base">{aeoScore}/100</p>
                <p className="text-xs opacity-70">AEO / GEO Score</p>
                <p className="text-xs mt-1 font-medium">
                  {aeoScore >= 70 ? "🟢 Citation Ready" : aeoScore >= 40 ? "🟡 Improving" : "🔴 Needs Work"}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5">
              {aeoChecks.map((c, i) => <CheckRow key={i} item={c} />)}
            </div>
          </div>
        )}

        {/* ---- TAB: Previews ---- */}
        {activeTab === "preview" && (
          <div className="space-y-5">
            {/* Google Snippet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-500" /> Google Snippet
                </p>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                  {[{ label: "Desktop", icon: <Monitor className="w-3 h-3" />, key: "desktop" as const },
                    { label: "Mobile", icon: <Smartphone className="w-3 h-3" />, key: "mobile" as const }].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setPreviewMode(m.key)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${previewMode === m.key ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm" : "text-slate-500"}`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <GooglePreview
                title={formData.seoTitle || formData.title || ""}
                url={`govtjobnow.com/blog/${formData.slug || "post-slug"}`}
                description={formData.seoDescription || formData.excerpt || ""}
                mobile={previewMode === "mobile"}
              />
            </div>

            {/* Facebook Card */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook OG Card
              </p>
              <FacebookCardPreview
                title={formData.ogTitle || formData.title || ""}
                description={formData.ogDescription || formData.excerpt || ""}
                image={formData.ogImage || formData.coverImage || undefined}
              />
            </div>

            {/* Twitter Card */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5" /> Twitter Card
              </p>
              <TwitterCardPreview
                title={formData.ogTitle || formData.title || ""}
                description={formData.ogDescription || formData.excerpt || ""}
                image={formData.ogImage || formData.coverImage || undefined}
              />
            </div>
          </div>
        )}

        {/* ---- TAB: Internal Linking ---- */}
        {activeTab === "links" && (
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-blue-500" /> Internal Linking Suggestions
            </p>
            <p className="text-xs text-slate-500 mb-4">Posts with similar tags — copy HTML anchor to embed in your content.</p>
            <LinkingSuggestionsTab postId={currentPostId} token={token} />
          </div>
        )}
      </div>
    </div>
  );
}
