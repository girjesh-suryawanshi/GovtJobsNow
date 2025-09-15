import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Search, 
  Bell, 
  FileText, 
  Calendar,
  Users,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const helpSections = [
    {
      title: "Getting Started",
      icon: Search,
      items: [
        {
          question: "How do I search for government jobs?",
          answer: "Use the search bar at the top to find jobs by title, department, or location. You can also use filters on the left sidebar to narrow down results by department, location, salary range, and qualifications."
        },
        {
          question: "How do I apply for a job?",
          answer: "Click on any job card to view full details. Each job listing contains official application links, requirements, and deadlines. Applications must be submitted through the official government website linked in each job posting."
        },
        {
          question: "What is the difference between job types?",
          answer: "Jobs are categorized by urgency: Red (1-3 days left), Orange (4-7 days), Yellow (1-2 weeks), and Green (2+ weeks). Higher urgency jobs require immediate attention for applications."
        }
      ]
    },
    {
      title: "Job Alerts & Tracking",
      icon: Bell,
      items: [
        {
          question: "How do I set up job alerts?",
          answer: "Use the floating action menu (bottom right) or click 'Job Alerts' to create customized alerts. Set your preferences for keywords, location, department, and notification frequency (instant, daily, or weekly)."
        },
        {
          question: "How do I track my applications?",
          answer: "Use the 'Application Tracker' feature to monitor your job applications. You can add applications, update their status, set reminders, and add notes about your progress through different stages."
        },
        {
          question: "Can I get SMS notifications?",
          answer: "Yes! When setting up job alerts, you can enable both email and SMS notifications. Provide your phone number and choose your preferred notification method."
        }
      ]
    },
    {
      title: "Exam Calendar",
      icon: Calendar,
      items: [
        {
          question: "How do I view upcoming exams?",
          answer: "Click 'Exam Calendar' in the navigation or use the floating menu. You can view exams in month or list format, filter by exam type, and see registration deadlines."
        },
        {
          question: "How do I register for exams?",
          answer: "Each exam listing shows the registration deadline and contains links to official registration portals. Make sure to register before the deadline and keep track of exam dates."
        },
        {
          question: "What exam types are available?",
          answer: "We track preliminary exams, main exams, interviews, skill tests, and medical examinations across all major government departments and organizations."
        }
      ]
    },
    {
      title: "Advanced Features",
      icon: FileText,
      items: [
        {
          question: "How do I compare jobs?",
          answer: "Click the 'Compare' button on job cards to add them to comparison. You can compare up to 3 jobs side-by-side to evaluate salary, requirements, and benefits."
        },
        {
          question: "How do I filter by salary range?",
          answer: "Use the salary filter in the sidebar with ranges like ₹10k-20k, ₹20k-30k, up to ₹50k+. This helps you find positions matching your salary expectations."
        },
        {
          question: "What do the organization logos mean?",
          answer: "Logos help you quickly identify the hiring organization - SSC, UPSC, IBPS, Railway, Banking, Defense, etc. This visual indicator makes it easier to spot jobs from preferred departments."
        }
      ]
    }
  ];

  const quickLinks = [
    { label: "Contact Support", icon: Mail, href: "mailto:support@govtjobsnow.com" },
    { label: "Report Issue", icon: MessageCircle, href: "#" },
    { label: "Feature Request", icon: ExternalLink, href: "#" },
    { label: "User Guide", icon: FileText, href: "#" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Help Center
          </DialogTitle>
          <DialogDescription>
            Find answers to frequently asked questions and get help with using GovtJobsNow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50k+</div>
                    <p className="text-xs text-gray-500">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">2500+</div>
                    <p className="text-xs text-gray-500">Job Listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <p className="text-xs text-gray-500">Job Updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-4">
            {helpSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {section.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>
                Still have questions? Reach out to us through these channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      if (link.href.startsWith('mailto:')) {
                        window.location.href = link.href;
                      } else {
                        // For now, just show a toast - these can be implemented later
                        console.log(`Navigate to: ${link.label}`);
                      }
                    }}
                    data-testid={`button-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">24/7 Support</h3>
                  <p className="text-blue-700 text-sm">
                    Email: <a href="mailto:support@govtjobsnow.com" className="underline">support@govtjobsnow.com</a>
                  </p>
                  <p className="text-blue-700 text-sm">
                    We typically respond within 2-4 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}