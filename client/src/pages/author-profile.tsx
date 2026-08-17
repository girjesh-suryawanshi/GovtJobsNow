import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Link, useRoute } from "wouter";
import { ShieldCheck, BookOpen, Award, CheckCircle2, FileCheck, Mail, ArrowRight, ExternalLink } from "lucide-react";

export default function AuthorProfile() {
  const [, params] = useRoute("/author/:slug");
  const authorSlug = params?.slug || "editorial-team";

  const isFounder = authorSlug === "girjesh-suryawanshi";

  const author = {
    name: isFounder ? "Girjesh Suryawanshi" : "GovtJobNow Editorial Desk",
    title: isFounder ? "Founder & Chief Editorial Officer" : "Senior Recruitment Research & Editorial Team",
    experience: "15+ Years Domain Experience in Indian Govt Recruitment",
    bio: "Specializing in Indian Central and State Government Gazette Notifications, SSC, UPSC, Railway (RRB), Banking (IBPS/SBI), and Defense recruitment rules. Dedicated to converting complex 100-page official PDF notifications into structured, verified, and 100% accurate job summaries for jobseekers across India.",
    articlesCount: "1,200+ Verified Notifications Analyzed",
    qualifications: [
      "B.Tech / M.Tech in Information Technology",
      "Certified Technical Content Auditor",
      "Expert in Indian Recruitment Regulations & Employment News Gazette Verification"
    ],
    social: {
      email: "editorial@govtjobnow.com",
      website: "https://govtjobnow.com"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={`${author.name} — Author Profile & Editorial Credentials | GovtJobNow`}
        description={`Read about ${author.name}, ${author.title} at GovtJobNow. 15+ years experience verifying official Indian government recruitment notifications.`}
        keywords="girjesh suryawanshi, govtjobnow author, government job editor, sarkari naukri expert profile"
        url={`https://govtjobnow.com/author/${authorSlug}`}
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Author Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-3xl shrink-0 shadow-lg shadow-blue-500/20 border-2 border-white">
              {isFounder ? "GS" : "GJN"}
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {author.name}
                  </h1>
                  <p className="text-sm font-semibold text-blue-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck className="h-4 w-4" /> {author.title}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full self-center sm:self-auto">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified E-E-A-T Author
                </span>
              </div>

              <p className="text-slate-600 text-sm mt-4 leading-relaxed font-medium">
                {author.bio}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-slate-100 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Award className="h-4 w-4 text-amber-500" /> {author.experience}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <BookOpen className="h-4 w-4 text-blue-500" /> {author.articlesCount}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Editorial Standards & Verification Protocols */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" /> Editorial Verification Commitment
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Every recruitment notification reviewed by {author.name} undergoes a strict 4-step primary source validation protocol:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>1. Gazette Check:</strong> Cross-referenced with official Employment News &amp; Government Gazettes.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>2. Domain Security:</strong> Sourced strictly from verified <code>.gov.in</code> / <code>.nic.in</code> domains.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>3. Advt Mapping:</strong> Notification numbers and eligibility criteria checked against primary PDFs.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>4. Zero Fake Jobs:</strong> Absolute zero-tolerance policy against fake recruitment scams or unverified rumors.
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg">Read Our Editorial &amp; Verification Policies</h3>
              <p className="text-xs text-blue-200 mt-1">
                Learn how GovtJobNow maintains complete transparency, accuracy, and corrigendum tracking.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/editorial-policy">
                <a className="px-4 py-2.5 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-1">
                  Editorial Policy <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Link>
              <Link href="/verification-policy">
                <a className="px-4 py-2.5 bg-blue-800 text-white font-bold text-xs rounded-xl border border-blue-700 hover:bg-blue-700 transition-colors inline-flex items-center gap-1">
                  Verification Policy <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
