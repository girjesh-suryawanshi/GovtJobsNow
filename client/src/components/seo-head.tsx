import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  alternateLocale?: string;
}

export default function SEOHead({
  title = "GovtJobsNow - Latest Government Jobs, Sarkari Naukri 2025",
  description = "Find latest government jobs, sarkari naukri notifications 2025. Browse 3900+ govt jobs from SSC, Railway, Banking, UPSC, Defence, PSU. Apply for central & state govt jobs online.",
  keywords = "government jobs, sarkari naukri, govt jobs 2025, SSC jobs, railway jobs, banking jobs, UPSC jobs, latest govt jobs, central government jobs, state government jobs, sarkari result",
  image = "/og-image.jpg",
  url = "https://govtjobsnow.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "GovtJobsNow",
  siteName = "GovtJobsNow",
  locale = "en_IN",
  alternateLocale = "hi_IN"
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', locale, true);
    
    if (alternateLocale) {
      updateMetaTag('og:locale:alternate', alternateLocale, true);
    }

    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }

    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', '@GovtJobsNow');
    updateMetaTag('twitter:site', '@GovtJobsNow');

    // Additional SEO tags
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('msapplication-navbutton-color', '#2563eb');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('format-detection', 'telephone=no');

    // Canonical URL
    updateLinkTag('canonical', url);

    // Hreflang tags for Indian localization
    updateLinkTag('alternate', `${url}?lang=hi`);
    document.querySelector('link[rel="alternate"][hreflang="hi-IN"]')?.remove();
    const hreflangHi = document.createElement('link');
    hreflangHi.setAttribute('rel', 'alternate');
    hreflangHi.setAttribute('hreflang', 'hi-IN');
    hreflangHi.setAttribute('href', `${url}?lang=hi`);
    document.head.appendChild(hreflangHi);

    const hreflangEn = document.createElement('link');
    hreflangEn.setAttribute('rel', 'alternate');
    hreflangEn.setAttribute('hreflang', 'en-IN');
    hreflangEn.setAttribute('href', url);
    document.head.appendChild(hreflangEn);

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, siteName, locale, alternateLocale]);

  return null;
}