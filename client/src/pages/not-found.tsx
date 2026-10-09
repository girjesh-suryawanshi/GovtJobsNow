import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Link } from "wouter";
import { Home, Search, ArrowLeft, Phone, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="404 Page Not Found | GovtJobNow"
        description="The page you are looking for does not exist. Browse the latest government jobs, exam calendar, and career guides on GovtJobNow."
        robots="noindex, follow"
      />
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-24 text-center">
        {/* Big 404 */}
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-blue-50 border-4 border-blue-100 mb-8 mx-auto">
          <span className="text-5xl font-black text-blue-600">404</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Sorry, the page you are looking for may have been moved, renamed, or no longer exists.
          Try searching for what you need, or navigate using the links below.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/">
            <a className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
              <Home className="h-5 w-5" />
              Go to Homepage
            </a>
          </Link>
          <Link href="/exams">
            <a className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <Search className="h-5 w-5" />
              Browse Exam Calendar
            </a>
          </Link>
        </div>

        {/* Quick Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Latest Jobs", href: "/" },
              { label: "SSC Jobs", href: "/jobs/ssc" },
              { label: "Railway Jobs", href: "/jobs/railway" },
              { label: "Exam Calendar", href: "/exams" },
              { label: "Blog & Guides", href: "/blog" },
              { label: "Contact Us", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={href} href={href}>
                <a className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors py-1">
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-blue-400 shrink-0" />
                  {label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-gray-400">
          Still can't find what you need?{" "}
          <Link href="/contact">
            <a className="text-blue-600 hover:underline font-medium">Contact our support team</a>
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
