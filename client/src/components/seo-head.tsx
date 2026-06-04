import { useEffect, useRef } from 'react';

interface JsonLdBlock {
  id: string;
  schema: object;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonical?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  jsonLd?: object | object[];
}

export default function SEO({
  title = "GovtJobNow - Latest Government Jobs, Sarkari Naukri 2025",
  description = "Find latest government jobs, sarkari naukri notifications 2025. Browse 3900+ govt jobs from SSC, Railway, Banking, UPSC, Defence, PSU.",
  keywords = "government jobs, sarkari naukri, govt jobs 2025, SSC jobs, railway jobs, banking jobs, UPSC jobs",
  author = "GovtJobNow",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  canonical,
  image = "/og-image.jpg",
  url = "https://govtjobnow.com",
  type = "website",
  publishedTime,
  modifiedTime,
  siteName = "GovtJobNow",
  twitterCard = "summary_large_image",
  jsonLd,
}: SEOProps) {
  const jsonLdIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // ---- Document title ----
    document.title = title;

    const setMeta = (selector: string, content: string, attrName = 'content') => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [attr, val] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attr, val.replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attrName, content);
    };

    const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
      if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    };

    // Core meta
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[name="author"]', author);
    setMeta('meta[name="robots"]', robots);
    setMeta('meta[name="googlebot"]', robots);
    setMeta('meta[name="viewport"]', 'width=device-width, initial-scale=1, shrink-to-fit=no');

    // Open Graph
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:image:width"]', '1200');
    setMeta('meta[property="og:image:height"]', '630');
    setMeta('meta[property="og:image:alt"]', title);
    setMeta('meta[property="og:site_name"]', siteName);
    setMeta('meta[property="og:locale"]', 'en_IN');
    if (publishedTime) setMeta('meta[property="article:published_time"]', publishedTime);
    if (modifiedTime) setMeta('meta[property="article:modified_time"]', modifiedTime);

    // Twitter
    setMeta('meta[name="twitter:card"]', twitterCard);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image);
    setMeta('meta[name="twitter:site"]', '@GovtJobNow');
    setMeta('meta[name="twitter:creator"]', '@GovtJobNow');

    // Canonical
    setLink('canonical', canonical || url);

    // ---- JSON-LD injection ----
    // Remove previously injected scripts from this component instance
    jsonLdIdsRef.current.forEach((id) => document.getElementById(id)?.remove());
    jsonLdIdsRef.current = [];

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, i) => {
        const id = `seo-jsonld-${Date.now()}-${i}`;
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        jsonLdIdsRef.current.push(id);
      });
    }

    // Cleanup JSON-LD on unmount
    return () => {
      jsonLdIdsRef.current.forEach((id) => document.getElementById(id)?.remove());
      jsonLdIdsRef.current = [];
    };
  }, [title, description, keywords, author, robots, canonical, image, url, type, publishedTime, modifiedTime, siteName, twitterCard, jsonLd]);

  return null;
}