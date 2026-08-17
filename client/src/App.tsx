import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/user-context";
import { PWAProvider } from "@/contexts/pwa-context";
import Home from "@/pages/home";
import JobDetail from "@/pages/job-detail";
import ExamDetail from "@/pages/exam-detail";
import ExamCalendarPage from "@/pages/exam-calendar-page";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Disclaimer from "@/pages/disclaimer";
import SSCJobs from "@/pages/ssc-jobs";
import RailwayJobs from "@/pages/railway-jobs";
import CategoryDetail from "@/pages/category-detail";
import DynamicSeoLandingPage from "@/pages/dynamic-seo-landing";
import NotFound from "@/pages/not-found";
import AboutUs from "@/pages/about-us";
import EditorialPolicy from "@/pages/editorial-policy";
import VerificationPolicy from "@/pages/verification-policy";
import CorrectionsPolicy from "@/pages/corrections-policy";
import BlogList from "@/pages/blog-list";
import BlogDetail from "@/pages/blog-detail";
import CookieBanner from "@/components/cookie-banner";
import InstallPWA from "@/components/install-pwa";
import PWAManualGuide from "@/components/pwa-manual-guide";
import AiChatbot from "@/components/ai-chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/job/:slug" component={JobDetail} />
      <Route path="/exam/:slug" component={ExamDetail} />
      <Route path="/exams" component={ExamCalendarPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/editorial-policy" component={EditorialPolicy} />
      <Route path="/verification-policy" component={VerificationPolicy} />
      <Route path="/corrections" component={CorrectionsPolicy} />
      <Route path="/jobs/ssc" component={SSCJobs} />
      <Route path="/jobs/railway" component={RailwayJobs} />
      <Route path="/category/:slug" component={CategoryDetail} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/:slug" component={DynamicSeoLandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PWAProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CookieBanner />
            <InstallPWA />
            <PWAManualGuide />
            <AiChatbot />
          </TooltipProvider>
        </PWAProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
