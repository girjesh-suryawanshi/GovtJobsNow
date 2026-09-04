import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Link } from "wouter";
import { ExternalLink, ShieldCheck, AlertTriangle, ArrowLeft, Building2 } from "lucide-react";

export default function RedirectNotice() {
  const searchParams = new URLSearchParams(window.location.search);
  const targetUrl = searchParams.get("url") || "https://govtjobnow.com";
  const isExpired = searchParams.get("expired") === "true";
  const jobTitle = searchParams.get("title") || "Official Government Portal";

  // Sanitize target URL to prevent open redirect security issues
  const safeTargetUrl = targetUrl.startsWith("http://") || targetUrl.startsWith("https://") 
    ? targetUrl 
    : `https://${targetUrl}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEOHead
        title="Leaving GovtJobNow — Official External Portal Redirect"
        description="Notice: You are navigating to an official government website or recruitment board notification."
        keywords="govtjobnow external redirect, official portal verification"
        robots="noindex, follow"
        url="https://govtjobnow.com/redirect"
      />
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12 sm:px-6 w-full flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 w-full text-center">
          
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-100">
            <Building2 className="h-8 w-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> External Government Portal Disclaimer
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            You are leaving GovtJobNow.com
          </h1>
          
          <p className="text-xs text-slate-500 font-medium mb-6">
            Connecting to official primary document for: <strong className="text-slate-800">{jobTitle}</strong>
          </p>

          {/* Expired Link Warning Box */}
          {isExpired ? (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-left mb-6 text-xs text-amber-900">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">Archived Recruitment Warning</h4>
                  <p className="mt-1 text-amber-850 leading-relaxed font-medium">
                    The deadline for this recruitment has passed. The official recruiting board may have archived or removed this PDF document from their server (resulting in a 404 error).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 text-xs text-slate-600 leading-relaxed">
              <p className="m-0">
                <strong>Important Candidate Notice:</strong> GovtJobNow aggregates verified recruitment links directly from official gazettes and <code>.gov.in</code> websites. Always ensure you do not pay money to any unauthorized private bank accounts.
              </p>
            </div>
          )}

          {/* Target URL Preview */}
          <div className="bg-slate-100 rounded-lg p-2.5 mb-6 text-xs text-slate-600 font-mono truncate max-w-full">
            Destination: {safeTargetUrl}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/">
              <a className="w-full sm:w-1/2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Return to Active Jobs
              </a>
            </Link>

            <a
              href={safeTargetUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-full sm:w-1/2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20 inline-flex items-center justify-center gap-2"
            >
              Continue to Official Site <ExternalLink className="h-4 w-4" />
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
