import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, ExternalLink, Shield, FileText, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important information about the use of GovtJobsNow platform and limitations of our services.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        <div className="mb-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
                  <p className="text-yellow-800">
                    GovtJobsNow is an independent job aggregation platform. We are not affiliated with any government department, recruitment board, or public sector organization. All job information is sourced from publicly available official sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>General Information Disclaimer</CardTitle>
                  <CardDescription>Important limitations about the information we provide</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Information Accuracy:</strong> While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, accuracy, or reliability of all job postings and related content.
                </li>
                <li>
                  <strong>Third-Party Content:</strong> Job listings are sourced from various government websites and official portals. We are not responsible for any errors, omissions, or changes in the original postings.
                </li>
                <li>
                  <strong>Real-Time Updates:</strong> Government departments may update job requirements, deadlines, or other details after we aggregate the information. Always verify details on the official website.
                </li>
                <li>
                  <strong>Educational Purpose:</strong> Our content is provided for informational and educational purposes only and should not be considered as professional career advice.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Third-Party Links and External Websites</CardTitle>
                  <CardDescription>Disclaimers about external links and resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>External Links:</strong> Our platform contains links to external websites for additional information and application processes. We do not control these websites and are not responsible for their content, availability, or functionality.
                </li>
                <li>
                  <strong>Official Applications:</strong> All job applications must be submitted through official government portals or recruitment websites. We facilitate access but do not process applications.
                </li>
                <li>
                  <strong>Third-Party Policies:</strong> External websites have their own terms of service and privacy policies. We recommend reviewing these before using their services.
                </li>
                <li>
                  <strong>Link Availability:</strong> External links may become inactive or redirected without our knowledge. Report broken links to help us maintain accuracy.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>No Employment Guarantee</CardTitle>
                  <CardDescription>Important clarifications about employment outcomes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>No Job Guarantee:</strong> GovtJobsNow does not guarantee employment, interview calls, or selection in any government job or examination.
                </li>
                <li>
                  <strong>Application Success:</strong> Success in applications depends entirely on individual qualifications, merit, and the selection process of respective government departments.
                </li>
                <li>
                  <strong>Eligibility Responsibility:</strong> Users are responsible for verifying their eligibility for any position before applying. We do not validate individual qualifications.
                </li>
                <li>
                  <strong>Selection Process:</strong> All recruitment processes are conducted by respective government departments according to their rules and regulations.
                </li>
                <li>
                  <strong>Career Decisions:</strong> Users make career decisions at their own discretion and risk. We provide information but not personalized career counseling.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Content and Copyright Disclaimer</CardTitle>
                  <CardDescription>Information about content ownership and usage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Content Sources:</strong> Job information is aggregated from publicly available government sources. Original copyrights remain with respective government departments.
                </li>
                <li>
                  <strong>Fair Use:</strong> We operate under principles of fair use for educational and informational purposes, providing proper attribution to original sources.
                </li>
                <li>
                  <strong>Original Content:</strong> Our original analysis, tools, and features are protected by copyright and should not be reproduced without permission.
                </li>
                <li>
                  <strong>Removal Requests:</strong> If you believe any content infringes on your rights, please contact us for prompt resolution.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>User Responsibility</CardTitle>
                  <CardDescription>Your responsibilities when using our platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Information Verification:</strong> Always verify job details, eligibility criteria, and application deadlines on official government websites before applying.
                </li>
                <li>
                  <strong>Due Diligence:</strong> Conduct proper research about job roles, departments, and application processes before making decisions.
                </li>
                <li>
                  <strong>Official Guidelines:</strong> Follow all guidelines and instructions provided by respective government departments and recruitment boards.
                </li>
                <li>
                  <strong>Personal Information:</strong> Protect your personal and sensitive information when applying for jobs or creating accounts.
                </li>
                <li>
                  <strong>Professional Advice:</strong> Consult qualified career counselors or professionals for personalized guidance when needed.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Contact Us</h3>
              <p className="text-blue-800 mb-4">
                If you have questions about this disclaimer or need clarification about any aspect of our services:
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@govtjobsnow.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 8800-XXX-XXX</p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Plot No. 123, Sector 15, Gurgaon, Haryana - 122001, India
                </p>
              </div>
              <p className="text-sm text-blue-700 mt-4">
                <strong>Disclaimer Updates:</strong> This disclaimer may be updated periodically. Continued use of our platform indicates acceptance of any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}