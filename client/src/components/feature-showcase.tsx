import { Bell, Target, Calendar, GitCompare, Zap, Shield, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureShowcase() {
  const features = [
    {
      icon: Bell,
      title: "Smart Job Alerts",
      description: "Get instant notifications for jobs matching your criteria with email/SMS alerts",
      color: "bg-blue-500",
      stats: "50+ Alert Types"
    },
    {
      icon: Target,
      title: "Application Tracker",
      description: "Track your job applications from submission to selection with progress indicators",
      color: "bg-green-500", 
      stats: "Complete Lifecycle"
    },
    {
      icon: Calendar,
      title: "Exam Calendar",
      description: "Never miss important exam dates with comprehensive scheduling and reminders",
      color: "bg-purple-500",
      stats: "Comprehensive Scheduling"
    },
    {
      icon: GitCompare,
      title: "Job Comparison",
      description: "Compare up to 3 jobs side-by-side with salary, benefits, and requirements",
      color: "bg-orange-500",
      stats: "Side-by-Side Analysis"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get fresh job postings 4 times daily from 25+ government sources",
      color: "bg-yellow-500",
      stats: "Updated 4x Daily"
    },
    {
      icon: Shield,
      title: "Verified Sources",
      description: "All jobs sourced directly from official government websites and portals",
      color: "bg-indigo-500",
      stats: "100% Authentic"
    },
    {
      icon: TrendingUp,
      title: "Success Analytics",
      description: "Track success rates, application trends, and optimize your job search",
      color: "bg-red-500",
      stats: "Data-Driven Insights"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join thousands of successful government job seekers on our platform",
      color: "bg-teal-500",
      stats: "10,000+ Users"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why GovtJobsNow is the 
            <span className="text-blue-600 ml-2">Winning Choice</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            More than just a job portal - it's your complete government career companion with features that give you a competitive edge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className={`text-xs font-bold ${feature.color.replace('bg-', 'text-')} bg-gray-100 px-3 py-1 rounded-full`}>
                    {feature.stats}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Government Job Search?</h3>
            <p className="text-xl mb-6 opacity-90">Join thousands who are already getting ahead with our advanced features</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Your Search Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                See Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}