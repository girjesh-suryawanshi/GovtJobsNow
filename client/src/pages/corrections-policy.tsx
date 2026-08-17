import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { AlertTriangle, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function CorrectionsPolicy() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobUrl: "",
    issueType: "typo",
    details: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.details) {
      toast({
        title: "Missing Information",
        description: "Please provide a valid email and details regarding the correction.",
        variant: "destructive"
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Report Received",
      description: "Thank you! Our editorial desk will review your report within 24–48 hours."
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Corrections Policy & Error Reporting | GovtJobNow"
        description="Submit corrections, report broken links, or notify our editorial team of recruitment updates on GovtJobNow."
        keywords="corrections policy, report error govtjobnow, recruitment update feedback"
        url="https://govtjobnow.com/corrections"
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Corrections Policy &amp; Error Reporting
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Transparent Accountability &amp; Continuous Accuracy
              </p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Our Commitment to Accuracy</h2>
              <p>
                GovtJobNow strives for 100% accuracy across all recruitment details. If an error, typographical mistake, broken official link, or date extension occurs, we encourage our community to inform us immediately.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" /> Submit a Correction / Report an Issue
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-lg text-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-base">Correction Report Submitted</h3>
                  <p className="text-xs text-green-800 mt-1">
                    Thank you for helping maintain high quality standards on GovtJobNow. Our editorial team will verify the details against official sources.
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    size="sm"
                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", jobUrl: "", issueType: "typo", details: "" }); }}
                  >
                    Submit Another Report
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Page / Job URL</label>
                      <Input
                        type="url"
                        placeholder="https://govtjobnow.com/job/rrb-ntpc-2026"
                        value={formData.jobUrl}
                        onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.issueType}
                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                      >
                        <option value="typo">Typo / Grammatical Error</option>
                        <option value="date">Date Extension / Changed Deadline</option>
                        <option value="link">Broken Official PDF / Website Link</option>
                        <option value="criteria">Incorrect Eligibility / Age Limit</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description of Error &amp; Official Reference *</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full p-3 rounded-md border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe the inaccuracy and provide a link to the official government notification if available..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" /> Submit Correction Report
                  </Button>
                </form>
              )}
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
