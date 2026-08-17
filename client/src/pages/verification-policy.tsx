import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { CheckCircle2, ShieldAlert, ExternalLink, Search, Lock } from "lucide-react";

export default function VerificationPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Job Verification Policy & Authenticity Standards | GovtJobNow"
        description="Learn how GovtJobNow verifies government recruitment notifications, checks official web domains, and protects jobseekers against fraudulent job postings."
        keywords="job verification policy, fake govt job protection, authentic sarkari naukri, verified recruitment sources"
        url="https://govtjobnow.com/verification-policy"
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Job Verification &amp; Authenticity Policy
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Protecting Jobseekers Through Rigorous Primary Source Validation
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Overview */}
            <section className="bg-green-50/50 p-5 rounded-lg border border-green-100">
              <h2 className="text-base font-bold text-green-900 flex items-center gap-2 mt-0 mb-2">
                <Lock className="h-5 w-5 text-green-600" /> Zero Tolerance for Fraudulent Postings
              </h2>
              <p className="m-0 text-slate-700">
                With the rise of fake recruitment advertisements and phishing websites imitating official government portals, GovtJobNow enforces a strict 4-step verification protocol before listing any recruitment advertisement.
              </p>
            </section>


            {/* 4-Step Protocol */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-blue-600" /> Our 4-Step Verification Protocol
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Step 1: Domain &amp; Host Check</h3>
                  <p className="text-xs text-slate-600">
                    We verify that the notification originates from official government domains (`.gov.in`, `.nic.in`, `.edu.in`, `.ac.in`) or established PSU/Bank portals.
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Step 2: Advt Number Cross-Check</h3>
                  <p className="text-xs text-slate-600">
                    Every recruitment record is mapped to its official Advertisement/Notification Number (e.g., `Advt No. 03/2026`).
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Step 3: Official Gazette Verification</h3>
                  <p className="text-xs text-slate-600">
                    Important recruitment drives are cross-referenced with Employment News (Rozgar Samachar) or official gazette releases.
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Step 4: Direct Link Transparency</h3>
                  <p className="text-xs text-slate-600">
                    We provide direct links to the official PDF and official application form so candidates can independently confirm details.
                  </p>
                </div>
              </div>
            </section>

            {/* Candidate Advice */}
            <section className="border-t border-slate-100 pt-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldAlert className="h-5 w-5 text-amber-600" /> How to Spot Fake Government Jobs
              </h2>
              <p className="text-slate-600">
                Candidates are strongly advised to keep the following safety rules in mind while applying for any government recruitment:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>No Cash for Selection:</strong> Genuine government recruitment NEVER asks candidates to pay money for selection or job placement through private bank accounts.</li>
                <li><strong>Check Official URLs:</strong> Always check that the application URL ends in official domain extensions such as <code>.gov.in</code> or <code>.nic.in</code>. Beware of lookalike domains (e.g., <code>.org.in</code> or <code>.com</code> imitating government boards).</li>
                <li><strong>Verify Notification PDF:</strong> Always download the complete official PDF notification document directly from the recruiting body's website.</li>
                <li><strong>Fee Payment Channels:</strong> Genuine application fees are collected only via official bank gateways specified in the official notification.</li>
              </ul>
            </section>

            {/* Reporting Fake Postings */}
            <section className="bg-slate-100 p-5 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mt-0 mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" /> Reporting Inaccuracies or Suspected Scams
              </h3>
              <p className="m-0 text-xs text-slate-600">
                If you encounter any suspicious advertisement or believe a listed link contains an error, please report it immediately via our <a href="/corrections" className="text-blue-600 font-semibold underline">Corrections &amp; Feedback Page</a>. Our editorial team investigates all reports within 24–48 hours.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
