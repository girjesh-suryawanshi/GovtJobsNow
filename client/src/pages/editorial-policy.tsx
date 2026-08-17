import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { ShieldCheck, BookOpen, FileCheck, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";

export default function EditorialPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Editorial Policy & Content Standards | GovtJobNow"
        description="Learn how GovtJobNow sources, verifies, edits, and maintains official government job notifications with complete transparency and accuracy."
        keywords="editorial policy, govtjobnow methodology, job verification standards, government recruitment sourcing"
        url="https://govtjobnow.com/editorial-policy"
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <ShieldCheck className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Editorial Policy & Content Standards
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Last updated &amp; verified: {new Date().getFullYear()} • GovtJobNow Editorial Desk
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Overview */}
            <section className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
              <h2 className="text-base font-bold text-blue-900 flex items-center gap-2 mt-0 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600" /> Executive Commitment to Accuracy
              </h2>
              <p className="m-0 text-slate-700">
                GovtJobNow is an independent recruitment information aggregator dedicated to providing accurate, structured, and timely information about Indian Central and State Government employment notifications. Our mission is to simplify official advertisements for jobseekers while ensuring strict adherence to official sources.
              </p>
            </section>


            {/* Core Principles */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" /> 1. Sourcing &amp; Primary Authorities
              </h2>
              <p>
                We source recruitment announcements exclusively from official government channels, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Official government gazettes and employment news bulletins.</li>
                <li>Official websites of recruitment bodies (e.g., UPSC, SSC, RRB, IBPS, State PSCs).</li>
                <li>Verified official press releases and official departmental portals.</li>
              </ul>
              <p className="mt-2 text-slate-600">
                We strictly avoid unverified third-party rumors, speculative exam dates, or unofficial social media leaks.
              </p>
            </section>

            {/* Verification Methodology */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <FileCheck className="h-5 w-5 text-blue-600" /> 2. Content Structure &amp; Human Enhancement
              </h2>
              <p>
                Official PDF notifications are often lengthy and complex. Our editorial processing follows a rigid structured framework:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Official Notification Extraction:</strong> Key fields such as vacancies, eligibility criteria, age limits, pay scale, and application deadlines are extracted directly from PDF notifications.</li>
                <li><strong>Clear Contextual Explanations:</strong> We provide simplified breakdowns of complex selection processes, age relaxations, and step-by-step application instructions.</li>
                <li><strong>Original Source Links:</strong> Every job listing published on GovtJobNow contains direct links to the official PDF notification file and the official recruitment portal.</li>
              </ol>
            </section>

            {/* AI Policy */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <UserCheck className="h-5 w-5 text-purple-600" /> 3. Responsible AI Assistance Policy
              </h2>
              <p>
                We leverage automated text extraction tools and language models to assist in formatting and structuring notifications into user-friendly layouts (such as Markdown summaries, key takeaways, and FAQ lists). However:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Automated output is validated against original source documents.</li>
                <li>Fact-critical fields (dates, qualification requirements, vacancies, fees) must match official notifications exactly.</li>
                <li>We do not publish purely AI-generated speculative content or fabricated career advice.</li>
              </ul>
            </section>

            {/* Corrections */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-600" /> 4. Updates &amp; Corrigendums
              </h2>
              <p>
                Government recruitment boards frequently issue corrigendums, date extensions, or syllabus changes. Our editorial team monitors official portals for updates:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>When an official deadline is extended, the record is updated with the revised date.</li>
                <li>When an official corrigendum is published, a notice is added to the job listing page.</li>
                <li>Expired recruitments remain archived with an explicit <em>"Application Closed"</em> status to preserve historical record integrity for indexed search queries.</li>
              </ul>
            </section>

            {/* Disclaimer of Affiliation */}
            <section className="bg-slate-100 p-5 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mt-0 mb-2">Government Non-Affiliation Statement</h3>
              <p className="m-0 text-xs text-slate-600">
                GovtJobNow is an independent informational website and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with any Indian Central or State Government agency or examination body. All government logos, trademarks, and notification titles belong to their respective official owners.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
