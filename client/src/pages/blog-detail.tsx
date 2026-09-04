import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Calendar, Clock, Tag, Share2, Twitter,
  Linkedin, Link2, Facebook, ExternalLink, ChevronRight
} from "lucide-react";
import { BlogPost } from "@shared/schema";
import { KeyTakeawaysCard } from "@/components/blog/KeyTakeawaysCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { FAQAccordion } from "@/components/blog/FAQAccordion";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCard } from "@/components/blog/BlogCard";
import SEO from "@/components/seo-head";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    queryFn: () => fetch(`/api/blog/${slug}`).then((r) => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
    enabled: !!slug,
  });

  const { data: recentPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/recent"],
    queryFn: () => fetch("/api/blog/recent?limit=4").then((r) => r.json()),
  });

  // Inject heading IDs into rendered content
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current || !post?.content) return;
    contentRef.current.querySelectorAll("h2, h3").forEach((el, idx) => {
      if (!el.id) el.id = `heading-${idx}`;
    });
  }, [post?.content]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                ))}
              </div>
              <div className="col-span-6 space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`h-4 bg-slate-200 dark:bg-slate-800 rounded ${i % 3 === 0 ? "w-full" : "w-5/6"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Article Not Found</h1>
            <p className="text-slate-500 mb-6">This article may have been removed or the URL is incorrect.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tags: string[] = (post.tags as string[]) || [];
  const rawFaqs = (post.faq as any[]) || [];
  const faqs = rawFaqs
    .map((f: any) => ({
      question: f.question || f.q || f.title || "",
      answer: f.answer || f.a || f.content || "",
    }))
    .filter((f) => f.question && f.answer);
  const pageUrl = `https://govtjobnow.com/blog/${post.slug}`;
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  // Build JSON-LD @graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": post.schemaType || "BlogPosting",
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || "",
        image: post.ogImage || post.coverImage,
        url: pageUrl,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          "@type": "Person",
          name: post.authorName || "GovtJobNow Editorial",
          ...(post.authorBio ? { description: post.authorBio } : {}),
          ...(post.authorImage ? { image: post.authorImage } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: "GovtJobNow",
          url: "https://govtjobnow.com",
          logo: { "@type": "ImageObject", url: "https://govtjobnow.com/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        keywords: post.seoKeywords || tags.join(", "),
        ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
      },
      ...(faqs.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://govtjobnow.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://govtjobnow.com/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEO
        title={post.seoTitle || `${post.title} | GovtJobNow Blog`}
        description={post.seoDescription || post.excerpt || ""}
        keywords={post.seoKeywords || tags.join(", ")}
        author={post.authorName || "GovtJobNow"}
        robots={`${post.indexing || "index"}, ${post.follow || "follow"}`}
        canonical={post.canonicalUrl || pageUrl}
        image={post.ogImage || post.coverImage || undefined}
        url={pageUrl}
        type="article"
        publishedTime={post.publishedAt?.toString()}
        modifiedTime={post.updatedAt?.toString()}
        twitterCard={(post.twitterCard as "summary_large_image" | "summary") || "summary_large_image"}
        jsonLd={jsonLd}
      />
      <Header />

      {/* Cover Image — LCP optimized */}
      {post.coverImage && (
        <div className="w-full aspect-[3/1] max-h-[480px] overflow-hidden bg-slate-200 dark:bg-slate-800">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 dark:text-slate-300 line-clamp-1">{post.title}</span>
        </nav>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

          {/* ======= LEFT SIDEBAR ======= */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-5">
              {/* Back button */}
              <Link href="/blog">
                <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
                </button>
              </Link>

              {/* Table of Contents */}
              {post.tocEnabled && post.content && (
                <TableOfContents contentHtml={post.content} />
              )}

              {/* Social Share */}
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" /> Share Article
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: <Twitter className="w-4 h-4" />,
                      label: "X / Twitter",
                      color: "hover:bg-black hover:text-white",
                      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`,
                    },
                    {
                      icon: <Linkedin className="w-4 h-4" />,
                      label: "LinkedIn",
                      color: "hover:bg-blue-600 hover:text-white",
                      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(post.title)}`,
                    },
                    {
                      icon: <Facebook className="w-4 h-4" />,
                      label: "Facebook",
                      color: "hover:bg-[#1877F2] hover:text-white",
                      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-all ${s.color}`}
                    >
                      {s.icon} {s.label}
                    </a>
                  ))}
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                  >
                    <Link2 className="w-4 h-4" /> Copy Link
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ======= MAIN CONTENT ======= */}
          <main className="lg:col-span-6 min-w-0">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {post.category && (
                <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                  <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                    {post.category}
                  </span>
                </Link>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {publishedDate}
              </span>
              {post.readingTime && (
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {post.readingTime} min read
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author (mobile) */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700 lg:hidden">
              {post.authorImage ? (
                <img src={post.authorImage} alt={post.authorName || ""} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {(post.authorName || "G").charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{post.authorName}</p>
              </div>
            </div>

            {/* AEO Key Takeaways */}
            {post.excerpt && <KeyTakeawaysCard excerpt={post.excerpt} />}

            {/* Article Content */}
            <div
              ref={contentRef}
              className="prose prose-slate dark:prose-invert max-w-none
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:rounded-r-xl prose-blockquote:py-2
                prose-ul:space-y-1 prose-ol:space-y-1
                prose-table:text-sm
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* FAQ Section */}
            {faqs.length > 0 && <FAQAccordion items={faqs} />}

            {/* Author Card */}
            <AuthorCard
              name={post.authorName || "GovtJobNow Editorial"}
              bio={post.authorBio}
              image={post.authorImage}
              publishedAt={post.publishedAt}
            />

            {/* Mobile social share */}
            <div className="flex gap-3 mt-6 lg:hidden">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Twitter className="w-4 h-4" /> Tweet
              </a>
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Link2 className="w-4 h-4" /> Copy
              </button>
            </div>
          </main>

          {/* ======= RIGHT SIDEBAR ======= */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-6">

              {/* CTA Widget */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-xl shadow-blue-500/20">
                <h3 className="font-bold text-base mb-2">🔔 Get Job Alerts</h3>
                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                  Never miss a government job notification. Join thousands of job seekers.
                </p>
                <Link href="/">
                  <button className="w-full py-2.5 bg-white text-blue-700 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors">
                    Browse Latest Jobs →
                  </button>
                </Link>
              </div>

              {/* Tags Cloud */}
              {tags.length > 0 && (
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors cursor-pointer">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Articles */}
              {recentPosts && recentPosts.filter((p) => p.slug !== slug).length > 0 && (
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Recent Articles
                  </p>
                  <div className="space-y-1">
                    {recentPosts
                      .filter((p) => p.slug !== slug)
                      .slice(0, 4)
                      .map((p) => (
                        <BlogCard key={p.id} post={p} variant="compact" />
                      ))}
                  </div>
                  <Link href="/blog">
                    <button className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center justify-center gap-1">
                      View all articles <ExternalLink className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
