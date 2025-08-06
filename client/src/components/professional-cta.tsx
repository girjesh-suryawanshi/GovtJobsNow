import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfessionalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800/20 to-indigo-800/20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Don't Just Search Jobs,
            <span className="text-yellow-400 block">Dominate Your Career</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 font-light">
            Join the exclusive circle of government job seekers who are getting selected faster with our advanced platform
          </p>

          {/* Key Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Sources Only</h3>
              <p className="text-blue-200 text-sm text-center">
                100% authentic jobs from official government websites. No fake listings, ever.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast Alerts</h3>
              <p className="text-blue-200 text-sm text-center">
                Get notified within minutes of new job postings. Be the first to apply.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Success Analytics</h3>
              <p className="text-blue-200 text-sm text-center">
                Track your progress and optimize your job search strategy with data.
              </p>
            </div>
          </div>

          {/* Urgency & Scarcity */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-orange-200 font-medium">Limited Time Advantage</span>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse ml-3"></div>
            </div>
            <p className="text-lg text-red-100 mb-4">
              <strong className="text-white">200+ new jobs</strong> added this week. While others are still searching manually, 
              our users are already getting shortlisted.
            </p>
            <div className="text-sm text-orange-200">
              Join <strong className="text-white">10,000+ successful job seekers</strong> who chose the smart way
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-yellow-400/50 transition-all group">
              Get Competitive Advantage Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold">
              View Success Dashboard
            </Button>
          </div>

          {/* Final Trust Signal */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-6 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-200 text-sm font-medium">
                98% User Satisfaction • 50,000+ Successful Placements
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}