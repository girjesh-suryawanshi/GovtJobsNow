import React, { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * SEO-friendly Breadcrumbs component.
 * Improves crawlability and user navigation hierarchy.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  
  useEffect(() => {
    // Inject BreadcrumbList JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://govtjobnow.com"
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          "item": item.href ? `https://govtjobnow.com${item.href}` : undefined
        }))
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `breadcrumb-schema-${Math.random().toString(36).substr(2, 9)}`;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground ${className}`}
    >
      <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="transition-colors hover:text-primary whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-extrabold text-foreground whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
