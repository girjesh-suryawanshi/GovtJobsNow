import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Users, Lock, Globe, Mail } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Information We Collect</CardTitle>
                  <CardDescription>Types of data we gather when you use our services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and phone number when you create an account</li>
                  <li>Profile information including qualifications and preferences</li>
                  <li>Communication preferences for job alerts and notifications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Job searches, filters applied, and pages visited</li>
                  <li>Device information, browser type, and IP address</li>
                  <li>Cookies and similar tracking technologies for site functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>How We Use Your Information</CardTitle>
                  <CardDescription>The purposes for which we process your data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide personalized job recommendations based on your profile</li>
                  <li>Send job alerts and notifications according to your preferences</li>
                  <li>Enable account management and application tracking features</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Platform Improvement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Analyze usage patterns to improve our search and recommendation algorithms</li>
                  <li>Conduct research to enhance user experience and platform functionality</li>
                  <li>Monitor and prevent fraudulent or unauthorized activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Information Sharing</CardTitle>
                  <CardDescription>When and how we share your data with others</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">We Do NOT Share</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Your personal information with advertisers or marketers</li>
                  <li>Your job search history or application data with third parties</li>
                  <li>Your contact information for unsolicited communications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limited Sharing</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Technical service providers who help maintain our platform (under strict confidentiality)</li>
                  <li>Government authorities when required by law or legal process</li>
                  <li>In case of business transfer, with appropriate user notification</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Data Security</CardTitle>
                  <CardDescription>How we protect your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Industry-standard encryption for data transmission and storage</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls limiting employee access to necessary data only</li>
                <li>Secure data centers with physical and digital security measures</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Your Rights and Choices</CardTitle>
                  <CardDescription>Control over your personal data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Management</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Access and update your profile information at any time</li>
                  <li>Modify your communication preferences and job alert settings</li>
                  <li>Download your data or request account deletion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Manage cookie settings through your browser preferences</li>
                  <li>Opt out of non-essential tracking cookies</li>
                  <li>Note: Some features may not work properly with cookies disabled</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Contact Us</CardTitle>
                  <CardDescription>Questions about this privacy policy</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, your data rights, or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@govtjobsnow.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 8800-XXX-XXX</p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Plot No. 123, Sector 15, Gurgaon, Haryana - 122001, India
                </p>
              </div>
              <p className="text-sm text-gray-600">
                We will respond to your inquiry within 30 days of receipt.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Policy Updates</h3>
              <p className="text-blue-800">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website and sending an email notification to registered users. Your continued use of our services after such notification constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}