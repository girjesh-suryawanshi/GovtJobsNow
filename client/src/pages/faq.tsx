import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Users, FileText } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FAQ() {
  const faqCategories = [
    {
      category: "Job Search & Applications",
      icon: Search,
      color: "bg-blue-100 text-blue-600",
      questions: [
        {
          question: "How do I search for government jobs on GovtJobsNow?",
          answer: "You can search for government jobs using our advanced search filters. Use the location, department, qualification, and salary range filters on the homepage to find jobs that match your criteria. You can also browse by specific categories like Banking, Railway, Defense, etc."
        },
        {
          question: "How often are new jobs posted on the platform?",
          answer: "New government job postings are added daily to our platform. We automatically scrape jobs from 25+ official government sources and update our database every 6 hours to ensure you get the latest opportunities."
        },
        {
          question: "Can I apply directly through GovtJobsNow?",
          answer: "GovtJobsNow is a job aggregation platform. When you click 'Apply Now' on any job listing, you'll be redirected to the official government website or recruitment portal where you can submit your application directly."
        },
        {
          question: "How do I know if a job posting is genuine?",
          answer: "All job postings on GovtJobsNow are sourced directly from official government websites and verified recruitment portals. We display the source URL for each job posting so you can verify the authenticity."
        }
      ]
    },
    {
      category: "Account & Profile",
      icon: Users,
      color: "bg-green-100 text-green-600",
      questions: [
        {
          question: "Do I need to create an account to view jobs?",
          answer: "No, you can browse and view all job listings without creating an account. However, creating a free account allows you to set up job alerts, track applications, and access personalized recommendations."
        },
        {
          question: "How do I reset my password?",
          answer: "Currently, our authentication system is simplified for demonstration purposes. In the full version, you'll have password reset functionality via email verification."
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, once logged in, you can update your profile information including your name, email, and preferences. This helps us provide better job recommendations tailored to your qualifications."
        },
        {
          question: "Is my personal information secure?",
          answer: "Absolutely. We follow industry-standard security practices to protect your personal information. We never share your data with third parties without your explicit consent. Please refer to our Privacy Policy for detailed information."
        }
      ]
    },
    {
      category: "Features & Services",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      questions: [
        {
          question: "What is the Job Alerts feature?",
          answer: "Job Alerts allow you to receive notifications when new jobs matching your criteria are posted. You can set up alerts based on location, department, qualification level, and salary range. Alerts can be sent via email or SMS."
        },
        {
          question: "How does the Application Tracker work?",
          answer: "The Application Tracker helps you monitor the status of your job applications. You can track which jobs you've applied for, application deadlines, exam dates, and results - all in one convenient dashboard."
        },
        {
          question: "What is the Exam Calendar feature?",
          answer: "The Exam Calendar displays important dates for government job exams, result announcements, and application deadlines. You can filter by exam type and set reminders for important dates."
        },
        {
          question: "Can I compare different job opportunities?",
          answer: "Yes! Our Job Comparison tool allows you to compare up to 3 job listings side-by-side. You can compare salary, qualifications, location, deadlines, and other important criteria to make informed decisions."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: HelpCircle,
      color: "bg-orange-100 text-orange-600",
      questions: [
        {
          question: "The website is not loading properly. What should I do?",
          answer: "Try refreshing the page or clearing your browser cache. If the issue persists, try using a different browser or device. You can also contact our technical support team for assistance."
        },
        {
          question: "I'm not receiving job alert emails. Why?",
          answer: "Check your spam/junk folder first. Ensure that notifications@govtjobsnow.com is added to your safe sender list. You can also verify your email address in your account settings."
        },
        {
          question: "Can I access GovtJobsNow on my mobile phone?",
          answer: "Yes! GovtJobsNow is fully responsive and optimized for mobile devices. You can access all features through your mobile browser. We're also working on a dedicated mobile app."
        },
        {
          question: "How do I report a technical issue or bug?",
          answer: "You can report technical issues through our Contact Us page or email us directly at support@govtjobsnow.com. Please include details about the issue, your browser/device information, and steps to reproduce the problem."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about using GovtJobsNow, applying for government jobs, and our platform features.
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                    <CardDescription>
                      Common questions about {category.category.toLowerCase()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {category.questions.length} Questions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, questionIndex) => (
                    <AccordionItem
                      key={questionIndex}
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                        <span className="font-medium text-gray-900">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Still have questions?</CardTitle>
              <CardDescription className="text-lg">
                Our support team is here to help you with any additional queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="mailto:support@govtjobsnow.com"
                  className="inline-flex items-center justify-center rounded-md border border-blue-600 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}