import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Save, Eye, EyeOff, Search, Tag, Image,
  FileText, Settings, BarChart2, Globe, Twitter, Facebook,
  Link2, ChevronDown, ChevronUp, Loader2, CheckCircle2,
  XCircle, AlertTriangle, BookOpen, HelpCircle, ListChecks,
  Monitor, Smartphone, Copy, RefreshCw, PenLine, ExternalLink,
  Zap, ArrowLeft, Filter, Calendar, Bold, Italic, Underline,
  Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, Table, Sparkles, Undo, Redo
} from "lucide-react";
import { BlogPost, InsertBlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// ============================================================
// WordPress-Style Rich Text WYSIWYG Editor Component
// ============================================================
interface WordPressEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function WordPressEditor({ value, onChange }: WordPressEditorProps) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize value into editorRef when switching back to visual or initial load
  useEffect(() => {
    if (editorRef.current && mode === "visual") {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, mode]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertHtml = (htmlStr: string) => {
    document.execCommand("insertHTML", false, htmlStr);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL (e.g. https://govtjobnow.com/...):");
    if (url) {
      exec("createLink", url);
    }
  };

  const handleImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const alt = prompt("Enter image alt text:", "Blog Image") || "Blog Image";
      insertHtml(`<img src="${url}" alt="${alt}" class="my-4 rounded-xl shadow-md max-w-full h-auto" />`);
    }
  };

  const handleTable = () => {
    const tableHtml = `
<table class="w-full my-4 border-collapse border border-slate-300">
  <thead>
    <tr class="bg-slate-100">
      <th class="border border-slate-300 p-2 text-left">Header 1</th>
      <th class="border border-slate-300 p-2 text-left">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">Data 1</td>
      <td class="border border-slate-300 p-2">Data 2</td>
    </tr>
  </tbody>
</table>
`;
    insertHtml(tableHtml);
  };

  const handleCallout = () => {
    const calloutHtml = `
<div class="my-4 p-4 bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 rounded-r-xl">
  <p class="font-bold text-blue-900 dark:text-blue-200 m-0">💡 Key Highlights</p>
  <p class="text-sm text-blue-800 dark:text-blue-300 mt-1 m-0">Add your highlight summary text here...</p>
</div>
`;
    insertHtml(calloutHtml);
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      {/* WordPress Top Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs">
        {/* Mode Switcher */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 mr-2">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-colors ${mode === "visual" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"}`}
          >
            <Eye className="w-3.5 h-3.5" /> Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-colors ${mode === "code" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"}`}
          >
            <Code className="w-3.5 h-3.5" /> HTML Source
          </button>
        </div>

        {mode === "visual" && (
          <>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Block Formatting Selector */}
            <select
              onChange={(e) => exec("formatBlock", e.target.value)}
              className="h-8 px-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-medium cursor-pointer"
            >
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="h4">Heading 4 (H4)</option>
              <option value="blockquote">Quote Block</option>
            </select>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Bold, Italic, Underline, Strike */}
            <button type="button" onClick={() => exec("bold")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("italic")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("underline")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Underline"><Underline className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("strikeThrough")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Alignment */}
            <button type="button" onClick={() => exec("justifyLeft")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("justifyCenter")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("justifyRight")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Align Right"><AlignRight className="w-4 h-4" /></button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Lists */}
            <button type="button" onClick={() => exec("insertUnorderedList")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Bulleted List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("insertOrderedList")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("formatBlock", "blockquote")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Blockquote"><Quote className="w-4 h-4" /></button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Media & Custom Inserts */}
            <button type="button" onClick={handleLink} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-blue-600" title="Insert Link"><Link2 className="w-4 h-4" /></button>
            <button type="button" onClick={handleImage} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-purple-600" title="Insert Image"><Image className="w-4 h-4" /></button>
            <button type="button" onClick={handleTable} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-amber-600" title="Insert Table"><Table className="w-4 h-4" /></button>
            <button type="button" onClick={handleCallout} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-green-600" title="Insert Callout Box"><Sparkles className="w-4 h-4" /></button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Undo / Redo */}
            <button type="button" onClick={() => exec("undo")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Undo"><Undo className="w-4 h-4" /></button>
            <button type="button" onClick={() => exec("redo")} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Redo"><Redo className="w-4 h-4" /></button>
          </>
        )}
      </div>

      {/* Editor Body */}
      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onBlur={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-[380px] p-5 outline-none prose dark:prose-invert max-w-none text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
          style={{ minHeight: "380px" }}
        />
      ) : (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<h2>Introduction</h2><p>Article content HTML...</p>"
          rows={16}
          className="font-mono text-xs p-4 rounded-none border-none resize-y min-h-[380px] bg-slate-950 text-slate-100"
        />
      )}
    </div>
  );
}

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
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
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
// Blog Editor Component Form
// ============================================================
interface BlogEditorFormProps {
  editingPost?: BlogPost | null;
  onSaved?: () => void;
  onBack?: () => void;
}

const EMPTY_FORM: Partial<InsertBlogPost> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "Exam Guide",
  tags: [],
  coverImage: "",
  coverImageAlt: "",
  coverImageCaption: "",
  authorName: "GovtJobNow Editorial",
  authorBio: "Senior Government Recruitment Content Editor",
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

function BlogEditorForm({ editingPost, onSaved, onBack }: BlogEditorFormProps) {
  const [formData, setFormData] = useState<Partial<InsertBlogPost>>(() => {
    if (!editingPost) return { ...EMPTY_FORM };
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
    mutationFn: async (data: Partial<InsertBlogPost>) => {
      const r = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create post");
      }
      return r.json();
    },
    onSuccess: (post: BlogPost) => {
      setCurrentPostId(post.id);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "✅ Post Saved", description: `"${post.title}" saved successfully.` });
      onSaved?.();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message || "Failed to create post.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertBlogPost>) => {
      const r = await fetch(`/api/admin/blog/${currentPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update post");
      }
      return r.json();
    },
    onSuccess: (post: BlogPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "✅ Post Updated", description: `"${post.title}" updated.` });
      onSaved?.();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message || "Failed to update post.", variant: "destructive" }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (publishNow = false) => {
    if (!formData.title?.trim()) {
      toast({ title: "Validation Error", description: "Post Title is required.", variant: "destructive" });
      return;
    }
    if (!formData.slug?.trim()) {
      toast({ title: "Validation Error", description: "URL Slug is required.", variant: "destructive" });
      return;
    }

    // Prepare clean data structure to avoid Zod schema validation errors
    const dataToSend: any = {
      ...formData,
      status: publishNow ? "published" : (formData.status || "draft"),
    };

    // Clean optional properties if empty to avoid Zod date/string errors
    if (!dataToSend.publishedAt) delete dataToSend.publishedAt;
    if (!dataToSend.coverImage) delete dataToSend.coverImage;
    if (!dataToSend.coverImageAlt) delete dataToSend.coverImageAlt;
    if (!dataToSend.coverImageCaption) delete dataToSend.coverImageCaption;
    if (!dataToSend.authorImage) delete dataToSend.authorImage;

    if (currentPostId) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
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
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900 gap-1.5 text-xs font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back to All Posts
              </Button>
            )}
            <Badge className={formData.status === "published" ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
              {formData.status === "published" ? "Published" : "Draft"}
            </Badge>
            {currentPostId && (
              <a href={`/blog/${formData.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View Live <ExternalLink className="w-3 h-3" />
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
              Publish Article
            </Button>
          </div>
        </div>

        {/* Core Fields */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <PenLine className="w-4 h-4 text-blue-600" /> Article Content & Gutenberg-Style WordPress Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Post Title *</label>
              <Input value={formData.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Enter compelling article title..." className="text-lg font-semibold" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block flex items-center justify-between">
                URL Slug
                <button onClick={() => { setSlugAutoMode(!slugAutoMode); }} className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${slugAutoMode ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                  {slugAutoMode ? "Auto Slug" : "Manual"}
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

            {/* WordPress Rich Text WYSIWYG Editor */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Article Body Editor (WordPress WYSIWYG Mode)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${formData.content?.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length || 0 >= 800
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                  {formData.content?.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length || 0} words
                </span>
              </label>

              <WordPressEditor
                value={formData.content || ""}
                onChange={(html) => update("content", html)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Author Section */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-purple-600" /> Author (EEAT Signals)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
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
          </CardContent>
        </Card>

        {/* SEO Fields */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <BarChart2 className="w-4 h-4 text-green-600" /> Search Engine Optimization (SEO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
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
          </CardContent>
        </Card>

        {/* OpenGraph & Social */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-indigo-600" /> Open Graph & Social Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
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
          </CardContent>
        </Card>

        {/* Schema & Structured Data */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-amber-500" /> Structured Data & Schema Markup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
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
          </CardContent>
        </Card>
      </div>

      {/* ================================================================
          RIGHT: SIDEBAR SCORE PANELS
          ================================================================ */}
      <div className="w-80 flex-shrink-0 overflow-y-auto pl-4 border-l border-slate-100 dark:border-slate-800 space-y-4 max-h-[calc(100vh-200px)]">

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-semibold transition-all ${activeTab === tab.key
                  ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Focus Keyword Input */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Focus Keyword</label>
          <Input
            placeholder="e.g. ssc cgl syllabus 2026"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* ---- TAB: SEO Score ---- */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <CardContent className="pt-5">
                <div className="flex justify-center mb-2">
                  <ScoreRing score={seoScore} size={84} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">SEO Health Score</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time keyword & meta analysis</p>
              </CardContent>
            </Card>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Checklist</p>
              {seoChecks.map((c, i) => <CheckRow key={i} item={c} />)}
            </div>
          </div>
        )}

        {/* ---- TAB: AI / AEO Score ---- */}
        {activeTab === "aeo" && (
          <div className="space-y-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <CardContent className="pt-5">
                <div className="flex justify-center mb-2">
                  <ScoreRing score={aeoScore} size={84} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">AEO / AI Citation Score</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Optimized for ChatGPT, Perplexity & Gemini</p>
              </CardContent>
            </Card>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AEO & E-E-A-T Checklist</p>
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

// ============================================================
// Main Blog Management Dashboard Component (Exported Default)
// ============================================================
export default function ManualBlogEntry({ editingPost: initialEditingPost, onSaved }: { editingPost?: BlogPost | null; onSaved?: () => void }) {
  const [viewMode, setViewMode] = useState<"list" | "editor">(initialEditingPost ? "editor" : "list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(initialEditingPost || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("admin_token") || "";

  // Fetch all blog posts for table view
  const { data, isLoading, refetch, isFetching } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/admin/blog", statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "100");

      const response = await fetch(`/api/admin/blog?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json();
    },
    enabled: viewMode === "list",
  });

  // Toggle status mutation (Publish / Unpublish)
  const toggleStatusMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      const newStatus = post.status === "published" ? "draft" : "published";
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      return response.json();
    },
    onSuccess: (updatedPost: BlogPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: `Status Updated`,
        description: `"${updatedPost.title}" is now ${updatedPost.status.toUpperCase()}.`,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "🗑️ Deleted", description: "Blog post deleted successfully." });
      setDeletingPostId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
      setDeletingPostId(null);
    }
  });

  const handleCreateNew = () => {
    setEditingPost(null);
    setViewMode("editor");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setViewMode("editor");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingPost(null);
    refetch();
  };

  const posts = data?.posts || [];
  const totalPosts = data?.total || posts.length;
  const publishedCount = posts.filter(p => p.status === "published").length;
  const draftCount = posts.filter(p => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  if (viewMode === "editor") {
    return (
      <BlogEditorForm
        editingPost={editingPost}
        onBack={handleBackToList}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
          onSaved?.();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Blog Posts & Articles Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, edit, publish, delete, and monitor SEO scores of articles
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Article
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Articles</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{totalPosts}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-green-50/50 to-white dark:from-slate-900 dark:to-slate-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-950/50 rounded-xl text-green-600 dark:text-green-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Published</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-900 dark:to-slate-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Drafts</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{draftCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-purple-50/50 to-white dark:from-slate-900 dark:to-slate-950">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Views</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{totalViews.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search posts by title, excerpt, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-white dark:bg-slate-950"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <div className="flex bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            {(["all", "published", "draft"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors capitalize ${statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-xs text-slate-500">Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No blog posts found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "Try clearing your search filters to view all posts."
                  : "Get started by creating your first SEO & AI-optimized blog post."}
              </p>
              <Button size="sm" onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5 mt-2">
                <Plus className="w-4 h-4" /> Create First Article
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category & Tags</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-center">Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {posts.map((post) => {
                    const tagsList = (post.tags as string[]) || [];
                    const isDeleting = deletingPostId === post.id;
                    const isToggling = toggleStatusMutation.isPending && toggleStatusMutation.variables?.id === post.id;

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center flex-shrink-0 text-blue-500 font-black text-sm">
                                GJ
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-blue-600 transition-colors">
                                {post.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                  <Link2 className="w-3 h-3 text-slate-300" /> /{post.slug}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Tags */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-semibold">
                              {post.category || "Uncategorized"}
                            </span>
                            {tagsList.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {tagsList.slice(0, 2).map(t => (
                                  <span key={t} className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                    #{t}
                                  </span>
                                ))}
                                {tagsList.length > 2 && (
                                  <span className="text-[9px] text-slate-400">+{tagsList.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status & Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleStatusMutation.mutate(post)}
                            disabled={isToggling}
                            title={`Click to switch to ${post.status === "published" ? "Draft" : "Published"}`}
                            className="inline-flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                          >
                            {post.status === "published" ? (
                              <Badge className="bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-200 text-[10px] gap-1 px-2 py-0.5">
                                {isToggling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                                Published
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-200 text-[10px] gap-1 px-2 py-0.5">
                                {isToggling ? <Loader2 className="w-3 h-3 animate-spin" /> : <EyeOff className="w-3 h-3" />}
                                Draft
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Views */}
                        <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                          <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                            <BarChart2 className="w-3 h-3 text-slate-400" />
                            {post.viewCount || 0}
                          </span>
                        </td>

                        {/* Updated Date */}
                        <td className="py-3.5 px-4 text-center text-[11px] text-slate-500 whitespace-nowrap">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Not published"}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Live Link */}
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                              title="View Live Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(post)}
                              className="h-8 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs font-semibold gap-1"
                              title="Edit Article"
                            >
                              <PenLine className="w-3.5 h-3.5" /> Edit
                            </Button>

                            {/* Delete Button */}
                            {isDeleting ? (
                              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 p-1 rounded-lg">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-6 px-2 text-[10px]"
                                  onClick={() => deleteMutation.mutate(post.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                                </Button>
                                <button
                                  onClick={() => setDeletingPostId(null)}
                                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingPostId(post.id)}
                                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
