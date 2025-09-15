import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Shield, AlertTriangle, Scale, Globe } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using GovtJobsNow. By accessing our platform, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Acceptance of Terms</CardTitle>
                  <CardDescription>Your agreement to use our services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By accessing and using GovtJobsNow ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>These terms apply to all visitors, users, and others who access or use the service</li>
                <li>We reserve the right to update these terms at any time without notice</li>
                <li>Your continued use after changes constitutes acceptance of new terms</li>
                <li>You must be at least 18 years old to use our services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>User Accounts and Responsibilities</CardTitle>
                  <CardDescription>Your obligations when using our platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide accurate, complete, and up-to-date information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>One account per person - multiple accounts are prohibited</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Using automated systems to scrape or download content</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Uploading malicious code, viruses, or harmful content</li>
                  <li>Using the service for illegal activities or spam</li>
                  <li>Impersonating others or providing false information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Service Description and Limitations</CardTitle>
                  <CardDescription>What we provide and our limitations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Our Services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Job listing aggregation from official government sources</li>
                  <li>Search and filtering tools for government job opportunities</li>
                  <li>Job alerts, application tracking, and exam calendar features</li>
                  <li>Educational content and career guidance resources</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Limitations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>We are a job aggregation platform, not a recruitment agency</li>
                  <li>Job applications are processed by respective government departments</li>
                  <li>We do not guarantee job placement or application success</li>
                  <li>Service availability may be interrupted for maintenance or technical issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Content and Intellectual Property</CardTitle>
                  <CardDescription>Rights and ownership of platform content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Our Content</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>All original content, design, and functionality are owned by GovtJobsNow</li>
                  <li>Job listings are aggregated from public government sources</li>
                  <li>You may not reproduce, distribute, or create derivative works without permission</li>
                  <li>Our trademarks and logos are protected intellectual property</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">User Content</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>You retain ownership of content you submit to our platform</li>
                  <li>You grant us license to use your content for service provision</li>
                  <li>You are responsible for the accuracy and legality of your content</li>
                  <li>We may remove content that violates these terms or applicable laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Scale className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Disclaimers and Limitation of Liability</CardTitle>
                  <CardDescription>Important limitations on our liability</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Disclaimers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Services are provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee the accuracy or completeness of job information</li>
                  <li>We are not responsible for decisions made based on our content</li>
                  <li>Third-party links and content are provided for convenience only</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount you paid for services (if any)</li>
                  <li>We are not responsible for employment decisions made by government departments</li>
                  <li>Users assume all risks associated with job applications and career decisions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Termination and Governing Law</CardTitle>
                  <CardDescription>How these terms may end and applicable law</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Termination</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>You may terminate your account at any time by contacting us</li>
                  <li>We may terminate or suspend accounts for violations of these terms</li>
                  <li>We reserve the right to discontinue services with reasonable notice</li>
                  <li>Certain provisions survive termination, including intellectual property rights</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Governing Law</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>These terms are governed by the laws of India</li>
                  <li>Any disputes will be resolved in courts of Gurgaon, Haryana</li>
                  <li>You agree to submit to the jurisdiction of these courts</li>
                  <li>If any provision is unenforceable, the remainder remains in effect</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Contact Information</h3>
              <p className="text-blue-800 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@govtjobsnow.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 8800-XXX-XXX</p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Plot No. 123, Sector 15, Gurgaon, Haryana - 122001, India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}