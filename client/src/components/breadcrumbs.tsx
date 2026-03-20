import React from "react";
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
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-xs font-medium text-muted-foreground ${className}`}
    >
      <Link href="/" className="flex items-center transition-colors hover:text-primary">
        <Home className="mr-1 h-3.5 w-3.5" />
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
