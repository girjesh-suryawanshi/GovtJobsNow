import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Tag, BookOpen, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { BlogCard } from "@/components/blog/BlogCard";
import SEO from "@/components/seo-head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";

const POSTS_PER_PAGE = 9;

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeTag, setActiveTag] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/blog", { search, category: activeCategory, tag: activeTag, page, limit: POSTS_PER_PAGE }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(POSTS_PER_PAGE) });
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      const res = await fetch(`/api/blog?${params}`);
      return res.json();
    },
  });

  const { data: tags = [] } = useQuery<string[]>({
    queryKey: ["/api/blog/tags"],
    queryFn: () => fetch("/api/blog/tags").then((r) => r.json()),
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // Derive unique categories from posts
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("");
    setActiveTag("");
    setPage(1);
  };

  const hasFilters = search || activeCategory || activeTag;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "GovtJobNow Blog",
    description: "Expert guides, exam strategies, and government job news for Indian job seekers.",
    url: "https://govtjobnow.com/blog",
    publisher: {
      "@type": "Organization",
      name: "GovtJobNow",
      url: "https://govtjobnow.com",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEO
        title="Blog — Government Job Guides, Exam Tips & Sarkari News | GovtJobNow"
        description="Read expert articles on government exam preparation, Sarkari job application strategies, and the latest notifications from SSC, UPSC, Railway, and Banking sectors."
        keywords="sarkari naukri tips, govt exam preparation, SSC CGL guide, railway exam strategy, government job blog"
        url="https://govtjobnow.com/blog"
        type="website"
        jsonLd={jsonLd}
      />
      <Header />

      {/* Hero Banner */}
      <div className="page-hero mb-10" style={{ borderRadius: '0 0 20px 20px' }}>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Expert Knowledge Base
          </div>
          <h1>
            Government Job Insights & Guides
          </h1>
          <p>
            Strategies, tips, and news to help you crack the most competitive Sarkari exams in India.
          </p>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/25 focus:border-white/40"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4" /> <span className="font-medium">Filter:</span>
          </div>
          {/* Category filters */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(activeCategory === cat ? "" : cat); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Tag filters */}
          {(Array.isArray(tags) ? tags : []).slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => { setActiveTag(activeTag === tag ? "" : tag); setPage(1); }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTag === tag
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300"
              }`}
            >
              <Tag className="w-2.5 h-2.5" /> {tag}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 ml-2 underline">
              Clear all
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {isLoading ? "Loading..." : `${total} article${total !== 1 ? "s" : ""}${hasFilters ? " found" : ""}`}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl h-80 animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No articles found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 transition-colors bg-white dark:bg-slate-900"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    page === pageNum
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 transition-colors bg-white dark:bg-slate-900"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
